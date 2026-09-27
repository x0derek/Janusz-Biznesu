// NI CHUJA NIE WIEM CO TU SIE DZIEJE NIE OGARNIAM GIELDY TO BYL SZYBKI PROMPT ZEBY ZOBACZYC JAK TO BEDZE WYGLADAC

document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('gieldaCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Przykładowe dane rynkowe z formacją świecową
    const candleData = [
        { x: new Date('2026-03-01').getTime(), o: 100, h: 108, l: 98,  c: 105 },
        { x: new Date('2026-03-02').getTime(), o: 105, h: 107, l: 99,  c: 101 },
        { x: new Date('2026-03-03').getTime(), o: 101, h: 103, l: 90,  c: 92  },
        // Młotek (długi dolny cień/knot i małe ciało u góry)
        { x: new Date('2026-03-04').getTime(), o: 92,  h: 96,  l: 80,  c: 95  },
        { x: new Date('2026-03-05').getTime(), o: 95,  h: 106, l: 94,  c: 104 },
        { x: new Date('2026-03-06').getTime(), o: 104, h: 112, l: 102, c: 110 }
    ];

    new Chart(ctx, {
        type: 'candlestick',
        data: {
            datasets: [{
                label: 'JANUSZ_COIN (PLN)',
                data: candleData,
                color: {
                    up: '#48bb78',        // Zgodny z zielonym w balansie
                    down: '#f56565',      // Zgodny z czerwonym w balansie
                    unchanged: '#cbd5e0'
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(26, 32, 44, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#cbd5e0',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: { unit: 'day' },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: { size: 10 }
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
        }
    });
});