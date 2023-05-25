
const data = {
    labels: [
        'hp',
        'attack',
        'defense',
        'specialAttack',
        'specialDefense',
        'speed'
    ],
    datasets: [{
        label: 'Stats',
        data: [hp, attack, defense, specialAttack, specialDefense, speed],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
    }]
};

const config = {
    type: 'radar',
    data: data,
    options: {
        elements: {
            line: {
                borderWidth: 1
            }
        }, scales: {
            r: {
                angleLines: {
                    display: false
                },
                suggestedMin: 0,
                suggestedMax: 250
            }
        },
},
};

Chart.defaults.color = 'black';

function updateChart() {
    data.datasets[0].data = [hp, attack, defense, specialAttack, specialDefense, speed];
    chart.update();
}

const ctx = document.getElementById('myChart');
chart = new Chart(ctx, config)
