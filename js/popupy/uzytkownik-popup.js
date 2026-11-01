document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("uzytkownik-popup");
    const stronaGlowna = document.getElementById("strona-glowna");
    const wyjdz = document.getElementById("uzytkownik-wyjdz");


    function openPopup(name) {
        stronaGlowna.inert = true;
        stronaGlowna.style.filter = "blur(0.2rem)";
        popup.style.display = "block";

        window.dispatchEvent(new Event("resize"));
    }

    function closePopup() {
        stronaGlowna.inert = false;
        stronaGlowna.style.filter = "none";
        popup.style.display = "none";
    }

    document.querySelectorAll(".uzytkownik-ustawienia, #ustawienia").forEach(button => {
        button.addEventListener("click", () => openPopup(button.name));
    });

    if (wyjdz) wyjdz.addEventListener("click", closePopup);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closePopup();
    });
});