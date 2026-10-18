document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const mainScreen = document.getElementById("main_screen");
    const closeButton = document.getElementById("popup-close");

    const settingInfo = document.querySelector(".settingInfo");
    const stockInfo = document.querySelector(".stockInfo");

    function openPopup(name) {
        mainScreen.inert = true;
        mainScreen.style.filter = "blur(0.2rem)";
        popup.style.display = "block";

        if (stockInfo) stockInfo.style.display = name === "stock" ? "block" : "none";
        if (settingInfo) settingInfo.style.display = name === "setting" ? "block" : "none";

        window.dispatchEvent(new Event("resize"));
    }

    function closePopup() {
        mainScreen.inert = false;
        mainScreen.style.filter = "none";
        popup.style.display = "none";
    }

    document.querySelectorAll(".tile-button, #ustawienia").forEach(button => {
        button.addEventListener("click", () => openPopup(button.name));
    });

    if (closeButton) closeButton.addEventListener("click", closePopup);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closePopup();
    });
});