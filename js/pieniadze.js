const KLUCZ_ZAPISU = "Portfel"

export const progiPoziomow = [
    { poziom: 1, wymaganaKwota: 0 },
    { poziom: 2, wymaganaKwota: 1000 },
    { poziom: 3, wymaganaKwota: 5000 },
    { poziom: 4, wymaganaKwota: 10000 },
    { poziom: 5, wymaganaKwota: 50000 },
    { poziom: 6, wymaganaKwota: 250000 },
    { poziom: 7, wymaganaKwota: 1000000 }
];

const nasluchiwacze = [];

export const bank = {
    poczatkowaGotowka: 1000.00,
    gotowka: 100.00,
    najwyzszaGotowka: 100.00,
    poziom: 1,

    // Flagi - Do naprawy
    osiagnietePoziomy: {
        1: true,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false
    },

    mnozniki: {
        globalny: 1.0,
        gieldaZysk: 1.0,
        pasywny: 1.0
    },

    onAktualizacja(funkcja) {
        nasluchiwacze.push(funkcja);
    },

    pobierzMnoznik(typ = 'globalny') {
        if (typ === 'globalny') return this.mnozniki.globalny;
        return this.mnozniki.globalny * (this.mnozniki[typ] || 1.0);
    },

    sprawdzPoziom() {
        if (this.gotowka > this.najwyzszaGotowka) {
            this.najwyzszaGotowka = this.gotowka;
        }

        progiPoziomow.forEach(prog => {
            if (this.najwyzszaGotowka >= prog.wymaganaKwota && !this.osiagnietePoziomy[prog.poziom]) {
                this.osiagnietePoziomy[prog.poziom] = true;
                if (prog.poziom > this.poziom) {
                    this.poziom = prog.poziom;
                }
            }
        });
    },

    dodaj(kwota, typMnoznika = 'globalny') {
        if (kwota <= 0) return;
        const mnoznik = typMnoznika ? this.pobierzMnoznik(typMnoznika) : 1;
        this.gotowka += kwota * mnoznik;

        this.sprawdzPoziom();
        this.zapisz();
        this.odswiezUI();
    },

    odejmij(kwota) {
        if (kwota <= 0) return true;
        if (this.gotowka >= kwota) {
            this.gotowka -= kwota;
            this.zapisz();
            this.odswiezUI();
            return true;
        }
        return false;
    },

    ustawMnoznik(typ, nowaWartosc) {
        if (this.mnozniki.hasOwnProperty(typ)) {
            this.mnozniki[typ] = nowaWartosc;
            this.zapisz();
        }
    },

    odswiezUI() {
        const cashEl = document.getElementById('player-cash');
        if (cashEl) {
            cashEl.innerText = this.gotowka.toLocaleString('pl-PL', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }

        const levelEl = document.getElementById('player-level');
        if (levelEl) {
            levelEl.innerText = this.poziom;
        }

        // Powiadomienie o zmianie stanu
        nasluchiwacze.forEach(fn => fn());
    },

    zapisz() {
        localStorage.setItem(KLUCZ_ZAPISU, JSON.stringify({
            gotowka: this.gotowka,
            najwyzszaGotowka: this.najwyzszaGotowka,
            poziom: this.poziom,
            osiagnietePoziomy: this.osiagnietePoziomy,
            mnozniki: this.mnozniki
        }));
    },

    wczytaj() {
        const zapisane = localStorage.getItem(KLUCZ_ZAPISU);
        if (zapisane) {
            const dane = JSON.parse(zapisane);
            this.gotowka = dane.gotowka ?? this.poczatkowaGotowka;
            this.najwyzszaGotowka = dane.najwyzszaGotowka ?? this.gotowka;
            this.poziom = dane.poziom ?? 1;
            this.osiagnietePoziomy = { ...this.osiagnietePoziomy, ...dane.osiagnietePoziomy };
            this.mnozniki = { ...this.mnozniki, ...dane.mnozniki };
        }
        this.sprawdzPoziom();
        this.odswiezUI();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    bank.wczytaj();
});