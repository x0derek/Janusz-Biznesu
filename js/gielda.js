document.addEventListener('DOMContentLoaded', function () {
    const poczatkowaGotowka = 100.00;
    let portfelGracza = {
        gotowka: poczatkowaGotowka,
        aktywa: {
            KRYPTO: { ilosc: 0, sredniaCena: 0 },
            ZLOTO: { ilosc: 0, sredniaCena: 0 },
            KGHM: { ilosc: 0, sredniaCena: 0 }
        }
    };

    let aktualnyRynek = "KRYPTO";
    const bazowyCzas = Date.now();

    const konfiguracjaRynkow = {
        KRYPTO: {
            etykieta: 'KRYPTO (PLN)',
            bazowaCena: 10,
            zmiennosc: 12,
            tendencja: 0.02,
            opor: 0.05
        },
        ZLOTO: {
            etykieta: 'ZŁOTO (PLN/oz)',
            bazowaCena: 250,
            zmiennosc: 3,
            tendencja: 0.005,
            opor: 0.01
        },
        KGHM: {
            etykieta: 'KGHM (PLN)',
            bazowaCena: 50,
            zmiennosc: 6,
            tendencja: 0.01,
            opor: 0.03
        }
    };

    const daneRynkow = {};
    Object.keys(konfiguracjaRynkow).forEach(rynek => {
        daneRynkow[rynek] = [];
        const config = konfiguracjaRynkow[rynek];
        let poprzednieZamkniecie = config.bazowaCena;

        for (let i = 25; i >= 0; i--) {
            let otwarcie = poprzednieZamkniecie;

            const odlegloscOdCenyBazowej = (otwarcie - config.bazowaCena) / config.bazowaCena;
            const procentZmiany = (Math.random() - 0.5) * (config.zmiennosc / 100) + config.tendencja - (odlegloscOdCenyBazowej * config.opor);

            let zamkniecie = Math.max(1, parseFloat((otwarcie * (1 + procentZmiany)).toFixed(2)));
            let maksimum = parseFloat((Math.max(otwarcie, zamkniecie) + (Math.random() * (otwarcie * (config.zmiennosc / 300)))).toFixed(2));
            let minimum = parseFloat((Math.min(otwarcie, zamkniecie) - (Math.random() * (otwarcie * (config.zmiennosc / 300)))).toFixed(2));

            daneRynkow[rynek].push({
                x: bazowyCzas - i * 1000,
                o: otwarcie, h: maksimum, l: minimum, c: zamkniecie
            });
            poprzednieZamkniecie = zamkniecie;
        }
    });

    function utworzWykres(idKanwy) {
        const kanwa = document.getElementById(idKanwy);
        if (!kanwa) return null;

        return new Chart(kanwa.getContext('2d'), {
            type: 'candlestick',
            data: {
                datasets: [{
                    label: konfiguracjaRynkow[aktualnyRynek].etykieta,
                    data: daneRynkow[aktualnyRynek],
                    color: {
                        up: '#48bb78',
                        down: '#f56565',
                        unchanged: '#cbd5e0'
                    }
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        type: 'time',
                        time: { unit: 'second', displayFormats: { second: 'HH:mm:ss' } },
                        ticks: { color: 'rgba(255, 255, 255, 0.6)', font: { size: 10 } },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                },
                y: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: { size: 10 }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                }
            }
        });
    }

    let wykresGlowny = utworzWykres('gieldaCanvas');
    let wykresPopup = utworzWykres('gieldaCanvasPopup');

    function aktualizujInterfejs() {
        document.getElementById('player-cash').innerText = portfelGracza.gotowka.toFixed(2);

        const procentZysku = ((portfelGracza.gotowka - poczatkowaGotowka) / poczatkowaGotowka) * 100;
        const procentEl = document.getElementById('stan-procent');
        procentEl.innerText = (procentZysku >= 0 ? "+" : "") + procentZysku.toFixed(1) + "%";
        procentEl.className = "stan-status " + (procentZysku >= 0 ? "positive" : "negative");

        document.getElementById('current-symbol').innerText = aktualnyRynek;
        document.getElementById('user-has').innerText = portfelGracza.aktywa[aktualnyRynek].ilosc;
        document.getElementById('user-price').innerText = portfelGracza.aktywa[aktualnyRynek].sredniaCena.toFixed(2);
    }

    document.querySelectorAll('.btn-tab').forEach(zakladka => {
        zakladka.addEventListener('click', function () {
            document.querySelector('.btn-tab.active').classList.remove('active');
            this.classList.add('active');

            aktualnyRynek = this.getAttribute('data-market');

            if (wykresGlowny) {
                wykresGlowny.data.datasets[0].label = konfiguracjaRynkow[aktualnyRynek].etykieta;
                wykresGlowny.data.datasets[0].data = daneRynkow[aktualnyRynek];
                wykresGlowny.update('none');
            }
            if (wykresPopup) {
                wykresPopup.data.datasets[0].label = konfiguracjaRynkow[aktualnyRynek].etykieta;
                wykresPopup.data.datasets[0].data = daneRynkow[aktualnyRynek];
                wykresPopup.update('none');
            }
            aktualizujInterfejs();
        });
    });

    function generujKolejneSwiece() {
        Object.keys(konfiguracjaRynkow).forEach(rynek => {
            const daneSwiec = daneRynkow[rynek];
            const ostatniaSwieca = daneSwiec[daneSwiec.length - 1];
            const config = konfiguracjaRynkow[rynek];

            const cenaOtwarcia = ostatniaSwieca.c;

            const odlegloscOdCenyBazowej = (cenaOtwarcia - config.bazowaCena) / config.bazowaCena;
            const procentZmiany = (Math.random() - 0.5) * (config.zmiennosc / 100) + config.tendencja - (odlegloscOdCenyBazowej * config.opor);

            const cenaZamkniecia = Math.max(1, parseFloat((cenaOtwarcia * (1 + procentZmiany)).toFixed(2)));
            const cenaMaksymalna = parseFloat((Math.max(cenaOtwarcia, cenaZamkniecia) + (Math.random() * (cenaOtwarcia * (config.zmiennosc / 400)))).toFixed(2));
            const cenaMinimalna = parseFloat((Math.min(cenaOtwarcia, cenaZamkniecia) - (Math.random() * (cenaOtwarcia * (config.zmiennosc / 400)))).toFixed(2));

            daneSwiec.push({
                x: ostatniaSwieca.x + 1000,
                o: cenaOtwarcia, h: cenaMaksymalna, l: cenaMinimalna, c: cenaZamkniecia
            });

            if (daneSwiec.length > 40) {
                daneSwiec.shift();
            }
        });

        if (wykresGlowny) wykresGlowny.update('none');
        if (wykresPopup) wykresPopup.update('none');
        aktualizujInterfejs();
    }
    setInterval(generujKolejneSwiece, 1000);

    document.getElementById('action-buy').addEventListener('click', function () {
        const ilosc = parseInt(document.getElementById('trade-amount').value);
        if (isNaN(ilosc) || ilosc <= 0) return;

        const aktualneDane = daneRynkow[aktualnyRynek];
        const aktualnaCena = aktualneDane[aktualneDane.length - 1].c;
        const calkowityKoszt = ilosc * aktualnaCena;

        if (portfelGracza.gotowka >= calkowityKoszt) {
            portfelGracza.gotowka -= calkowityKoszt;

            const aktualneAktywo = portfelGracza.aktywa[aktualnyRynek];
            const nowaIlosc = aktualneAktywo.ilosc + ilosc;
            aktualneAktywo.sredniaCena = ((aktualneAktywo.ilosc * aktualneAktywo.sredniaCena) + calkowityKoszt) / nowaIlosc;
            aktualneAktywo.ilosc = nowaIlosc;

            aktualizujInterfejs();
        } else {
            alert("Brak srodków uzbiearj więcej hajsu");
        }
    });

    document.getElementById('action-sell').addEventListener('click', function () {
        const ilosc = parseInt(document.getElementById('trade-amount').value);
        if (isNaN(ilosc) || ilosc <= 0) return;

        const aktualneAktywo = portfelGracza.aktywa[aktualnyRynek];

        if (aktualneAktywo.ilosc >= ilosc) {
            const aktualneDane = daneRynkow[aktualnyRynek];
            const aktualnaCena = aktualneDane[aktualneDane.length - 1].c;

            portfelGracza.gotowka += ilosc * aktualnaCena;
            aktualneAktywo.ilosc -= ilosc;

            if (aktualneAktywo.ilosc === 0) {
                aktualneAktywo.sredniaCena = 0;
            }

            aktualizujInterfejs();
        } else {
            alert("Nie masz akcji na sprzedaż");
        }
    });

    aktualizujInterfejs();
});