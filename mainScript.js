let tileButtons = document.getElementsByClassName("tile-button")
for (let button of tileButtons) {
    button.addEventListener("click", (e) => {
        document.getElementById("main-screen").style.filter = "blur(1.0rem)";
        document.getElementById("popup").style.display = "block"
    })
    document.addEventListener("keydown", (e) => {
        document.getElementById("main-screen").style.filter = "blur(0)"
        document.getElementById("popup").style.display = "none"
    })
}