const tileButtons = document.getElementsByClassName("tile-button");
const popup = document.getElementById("popup");
const mainScreen = document.getElementById("main-screen");
const profileInfo = document.querySelector(".profileInfo");
const settingInfo = document.querySelector(".stockInfo");

for (let button of tileButtons) {
    button.addEventListener("click", (e) => {
        mainScreen.style.filter = "blur(1.0rem)";
        popup.style.display = "block";

        profileInfo.style.display = "none";
        settingInfo.style.display = "none";

        if (button.name === "profile") {
            profileInfo.style.display = "block";
        } else if (button.name === "stock") {
            settingInfo.style.display = "block";
        }
    });
}

document.addEventListener("keydown", (e) => {
    mainScreen.style.filter = "blur(0)";
    popup.style.display = "none";
});
