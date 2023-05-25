
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
        label: 'Pokemon1',
        data: [hp1, attack1, defense1, specialAttack1, specialDefense1, speed1],
        fill: true,
        backgroundColor: 'rgba(100,149,237,0.2)',
        borderColor: 'blue',
        pointBackgroundColor: 'blue',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'blue'
    }, {
        label: 'Pokemon2',
        data: [hp2, attack2, defense2, specialAttack2, specialDefense2, speed2],
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

function updateChart1() {
    data.datasets[0].data = [hp1, attack1, defense1, specialAttack1, specialDefense1, speed1];
    data.datasets[0].label = name1;
    chart.update();
}
function updateChart2() {
    data.datasets[1].data = [hp2, attack2, defense2, specialAttack2, specialDefense2, speed2];
    data.datasets[1].label = name2;
    chart.update();
}

const ctx = document.getElementById('myChart');
chart = new Chart(ctx, config)
