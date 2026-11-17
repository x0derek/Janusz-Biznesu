import { bank } from './pieniadze.js';

const KLUCZ_PRACOWNICY = "Pracownicy"

const listaPracownikow = [
    {
        id: 'amanda',
        nazwa: 'Amanda Ryc',
        obrazek: 'obrazy/pracownicy/b-woman-ginger.svg',
        kosztBazowy: 100,
        zarobekBazowy: 5,
        poziom: 0
    },
    {
        id: 'marek',
        nazwa: 'Marek Nowak',
        obrazek: 'obrazy/pracownicy/w-man-brown.svg',
        kosztBazowy: 500,
        zarobekBazowy: 25,
        poziom: 0
    }
];

function wczytajPracownikow() {
    const zapisane = localStorage.getItem(KLUCZ_PRACOWNICY);
    if (zapisane) {
        const dane = JSON.parse(zapisane);
        listaPracownikow.forEach(p => {
            if (dane[p.id] !== undefined) {
                p.poziom = dane[p.id];
            }
        });
    }
}

function zapiszPracownikow() {
    const doZapisu = {};
    listaPracownikow.forEach(p => {
        doZapisu[p.id] = p.poziom;
    });
    localStorage.setItem(KLUCZ_PRACOWNICY, JSON.stringify(doZapisu));
}

function obliczKoszt(pracownik) {
    if (pracownik.poziom === 0) return pracownik.kosztBazowy;
    return Math.round(pracownik.kosztBazowy * Math.pow(1.5, pracownik.poziom));
}

function renderujPracownikow() {
    const kontener = document.getElementById('pracownicy-kontener');
    if (!kontener) return;

    if (!bank.osiagnietePoziomy[2]) {
        kontener.innerHTML = `<div>🔒</div>`;
        return;
    }

    kontener.innerHTML = listaPracownikow.map(p => {
        const koszt = obliczKoszt(p);
        const stacGracza = bank.gotowka >= koszt;
        const tekstPrzycisku = p.poziom === 0 ? `Zatrudnij (${koszt}$)` : `Ulepsz (${koszt}$)`;
        const obecnyZarobek = p.poziom * p.zarobekBazowy;

        return `
            <div class="pracownik">
                <img src="${p.obrazek}" alt="pracownik_pp">
                <div class="info">
                    <div class="nazwa">${p.nazwa}</div>
                    <div class="poziom">Poziom: ${p.poziom} (${obecnyZarobek}$/s)</div>
                </div>
                <button 
                    class="btn-kup-pracownika" 
                    data-id="${p.id}" 
                    ${!stacGracza ? '' : ''}>
                    ${tekstPrzycisku}
                </button>
            </div>
        `;
    }).join('');

    kontener.querySelectorAll('.btn-kup-pracownika').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const pracownik = listaPracownikow.find(p => p.id === id);
            if (!pracownik) return;

            const koszt = obliczKoszt(pracownik);
            if (bank.odejmij(koszt)) {
                pracownik.poziom += 1;
                zapiszPracownikow();
                renderujPracownikow();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    wczytajPracownikow();
    renderujPracownikow();

    // Odśwież widok
    bank.onAktualizacja(renderujPracownikow);

    // Pasywny zarobek
    setInterval(() => {
        let sumaZarobku = 0;
        listaPracownikow.forEach(p => {
            if (p.poziom > 0) {
                sumaZarobku += p.poziom * p.zarobekBazowy;
            }
        });

        if (sumaZarobku > 0) {
            bank.dodaj(sumaZarobku, 'pasywny');
        }
    }, 1000);
});