document.addEventListener('DOMContentLoaded', function () {

    // Dane początkowe
    const baseTime = Date.now();
    const candleData = [
        { x: baseTime - 5 * 600, o: 100, h: 108, l: 98, c: 105 },
        { x: baseTime - 4 * 600, o: 105, h: 107, l: 99, c: 101 },
        { x: baseTime - 3 * 600, o: 101, h: 103, l: 90, c: 92 },
        { x: baseTime - 2 * 600, o: 92, h: 96, l: 80, c: 95 },
        { x: baseTime - 1 * 600, o: 95, h: 106, l: 94, c: 104 },
        { x: baseTime, o: 104, h: 112, l: 102, c: 110 }
    ];

    // Wykłes
    function createChart(canvas) {
        if (!canvas) return null;

        return new Chart(canvas.getContext('2d'), {
            type: 'candlestick',
            data: {
                datasets: [{
                    label: 'JANUSZ_COIN (PLN)',
                    data: candleData,
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
                        time: { unit: 'minute' },
                        ticks: { color: 'rgba(255, 255, 255, 0.6)', font: { size: 10 } },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    },
                    y: {
                        ticks: { color: 'rgba(255, 255, 255, 0.6)', font: { size: 10 } },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    }
                }
            }
        });
    }

    // genełate wykłes
    const canvasMain = document.getElementById('gieldaCanvas');
    const canvasPopup = document.getElementById('gieldaCanvasPopup');

    window.gieldaChartMain = createChart(canvasMain);
    window.gieldaChartPopup = createChart(canvasPopup);

    // refresz the wykłes
    function updateCharts() {
        if (window.gieldaChartMain) window.gieldaChartMain.update('none');
        if (window.gieldaChartPopup) window.gieldaChartPopup.update('none');
    }

    // nowa "Świece" - ten pacholeczek 
    function generateNextCandle() {
        const lastCandle = candleData[candleData.length - 1];

        // miesjce nowej swieczki
        const openPrice = lastCandle.c;
        const change = (Math.random() - 0.47) * 6;
        const closePrice = Math.max(1, parseFloat((openPrice + change).toFixed(2)));

        // Wyznaczenie maksimów i minimów (knoty świecy)
        const highPrice = parseFloat((Math.max(openPrice, closePrice) + Math.random() * 2).toFixed(2));
        const lowPrice = parseFloat((Math.min(openPrice, closePrice) - Math.random() * 2).toFixed(2));

        // Nowy punkt w czasie
        const nextTime = lastCandle.x + 600;

        // Dotanie nowej świecy do tablicy
        candleData.push({
            x: nextTime,
            o: openPrice,
            h: highPrice,
            l: lowPrice,
            c: closePrice
        });

        // Umax 30 swuieczusek
        if (candleData.length > 30) {
            candleData.shift();
        }

        updateCharts();
    }

    // Uruchomienie symulacji - nowa świeca co 0.6 sekundy
    setInterval(generateNextCandle, 600);
    window.updateGieldaCharts = updateCharts;
});
