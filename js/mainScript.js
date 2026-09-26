document.addEventListener("DOMContentLoaded", () => {
    const tileButtons = document.getElementsByClassName("tile-button");
    const popup = document.getElementById("popup");
    const mainScreen = document.getElementById("main_screen");

    const settingInfo = document.querySelector(".settingInfo");
    const stockInfo = document.querySelector(".stockInfo");

    for (let button of tileButtons) {
        button.addEventListener("click", (e) => {
            mainScreen.inert = true
            mainScreen.style.filter = "blur(0.2rem)";
            popup.style.display = "block";

            if (stockInfo) stockInfo.style.display = "none";
            if (settingInfo) settingInfo.style.display = "none";

            if (button.name === "setting") {
                if (settingInfo) settingInfo.style.display = "block";
            } else if (button.name === "stock") {
                if (stockInfo) stockInfo.style.display = "block";
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        mainScreen.inert = false
        mainScreen.style.filter = "blur(0)";
        popup.style.display = "none";
    });

});

