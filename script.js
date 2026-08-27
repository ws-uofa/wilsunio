// Shared language switcher and publication-page interactions.
const langToggle = document.getElementById("lang-toggle");
const body = document.body;

function readSavedLanguage() {
    try {
        return localStorage.getItem("preferred-lang") || "en";
    } catch (error) {
        return "en";
    }
}

let currentLang = readSavedLanguage();

function applyLanguage(lang) {
    const isChinese = lang === "zh";
    body.classList.toggle("lang-zh", isChinese);
    document.documentElement.lang = isChinese ? "zh-CN" : "en";

    if (langToggle) {
        langToggle.textContent = isChinese ? "EN" : "中文";
        langToggle.setAttribute(
            "aria-label",
            isChinese ? "Switch to English" : "切换到中文"
        );
    }
}

applyLanguage(currentLang);

if (langToggle) {
    langToggle.addEventListener("click", (event) => {
        event.preventDefault();
        currentLang = currentLang === "en" ? "zh" : "en";

        try {
            localStorage.setItem("preferred-lang", currentLang);
        } catch (error) {
            // The language still changes even when browser storage is unavailable.
        }

        applyLanguage(currentLang);
    });
}

// Toggle the Abstract and BibTeX panels. Only one panel per paper stays open.
document.querySelectorAll(".publication-toggle[data-panel-target]").forEach((button) => {
    button.addEventListener("click", () => {
        const panelId = button.dataset.panelTarget;
        const panel = document.getElementById(panelId);
        const publication = button.closest(".publication-entry");

        if (!panel || !publication) return;

        const shouldOpen = button.getAttribute("aria-expanded") !== "true";

        publication.querySelectorAll(".publication-toggle[data-panel-target]").forEach((otherButton) => {
            const otherPanel = document.getElementById(otherButton.dataset.panelTarget);
            otherButton.setAttribute("aria-expanded", "false");
            if (otherPanel) otherPanel.hidden = true;
        });

        if (shouldOpen) {
            button.setAttribute("aria-expanded", "true");
            panel.hidden = false;
        }
    });
});

async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    const copied = document.execCommand("copy");
    textarea.remove();

    if (!copied) {
        throw new Error("Clipboard copy failed");
    }
}

document.querySelectorAll(".copy-bibtex[data-copy-target]").forEach((button) => {
    button.addEventListener("click", async () => {
        const source = document.getElementById(button.dataset.copyTarget);
        const englishLabel = button.querySelector(".en");
        const chineseLabel = button.querySelector(".zh");

        if (!source) return;

        const originalEnglish = englishLabel ? englishLabel.textContent : "Copy";
        const originalChinese = chineseLabel ? chineseLabel.textContent : "复制";

        try {
            await copyToClipboard(source.textContent.trim());
            if (englishLabel) englishLabel.textContent = "Copied";
            if (chineseLabel) chineseLabel.textContent = "已复制";
        } catch (error) {
            if (englishLabel) englishLabel.textContent = "Copy failed";
            if (chineseLabel) chineseLabel.textContent = "复制失败";
        }

        window.setTimeout(() => {
            if (englishLabel) englishLabel.textContent = originalEnglish;
            if (chineseLabel) chineseLabel.textContent = originalChinese;
        }, 1600);
    });
});
