// 由于脚本放置在 body 底部，可以直接执行，避免页面闪烁
const langToggle = document.getElementById("lang-toggle");
const body = document.body;

// 获取历史偏好，默认设为 "en"
let currentLang = localStorage.getItem("preferred-lang") || "en";

// 渲染语言状态的函数
function applyLanguage(lang) {
    if (lang === "zh") {
        body.classList.add("lang-zh");
        langToggle.textContent = "EN"; // 已经是中文，按钮提示切回 EN
    } else {
        body.classList.remove("lang-zh");
        langToggle.textContent = "中文"; // 已经是英文，按钮提示切回中文
    }
}

// 页面加载时立刻应用语言设置
applyLanguage(currentLang);

// 监听按钮点击切换
langToggle.addEventListener("click", (e) => {
    e.preventDefault();
    // 切换语言状态
    currentLang = currentLang === "en" ? "zh" : "en";
    
    // 保存到本地浏览器
    localStorage.setItem("preferred-lang", currentLang);
    
    // 应用新状态
    applyLanguage(currentLang);
});