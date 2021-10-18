window.onload = () => {
    fetchData("/admin/monthly?year=2021").then(data => {
        console.log(data);
        let labels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
        const title = "Doanh thu theo từng tháng của năm 2020 và 2021"
        const eleChart = "monthlyChart"
        drawChart(data, title, eleChart, labels)
    }).catch(error => {
        console.log(error);
    })

    fetchData("/admin/annual?startYear=2010&endYear=2021").then(data => {
        console.log(data);
        let labels = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021']
        const title = "Doanh thu theo từng năm từ 2010 đến năm 2021"
        const eleChart = "annualChart"
        drawOneChart(data.data, title, eleChart, labels)
        drawOneChart(data.data, title, 'annualChart2', labels)
    })
        .catch(error => {
            console.log(error);
        })

}

function drawChart(duLieu, tieuDe, eleChart, lables) {
    let myChart = document.getElementById(eleChart).getContext('2d');
    // Global Options
    Chart.defaults.global.defaultFontFamily = 'Lato';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#000';

    let massPopChart = new Chart(myChart, {
        type: 'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data: {
            labels: lables,
            datasets: [{
                label: 'Năm 2021',
                data: duLieu.thisYear,
                backgroundColor: '#00BFFF',
                borderWidth: 1,
                borderColor: '#778899',
                hoverBorderWidth: 1,
                hoverBorderColor: '#1E90FF'
            }, {
                label: 'Năm 2020',
                data: duLieu.lastYear,
                backgroundColor: '#228B22',
                borderWidth: 1,
                borderColor: '#778899',
                hoverBorderWidth: 1,
                hoverBorderColor: '#1E90FF'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: tieuDe,
                fontSize: 25
            },
            legend: {
                display: true,
                position: 'right',
                labels: {
                    fontColor: '#000'
                }
            },
            layout: {
                padding: {
                    left: 50,
                    right: 0,
                    bottom: 0,
                    top: 0
                }
            },
            tooltips: {
                enabled: true
            }
        }
    });
}

function drawOneChart(duLieu, tieuDe, eleChart, lables) {
    let myChart = document.getElementById(eleChart).getContext('2d');
    // Global Options
    Chart.defaults.global.defaultFontFamily = 'Lato';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#000';

    let massPopChart = new Chart(myChart, {
        type: 'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data: {
            labels: lables,
            datasets: [{
                label: null,
                data: duLieu,
                backgroundColor: '#00BFFF',
                borderWidth: 1,
                borderColor: '#778899',
                hoverBorderWidth: 1,
                hoverBorderColor: '#1E90FF'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: tieuDe,
                fontSize: 25
            },
            legend: {
                display: false,
                position: 'right',
                labels: {
                    fontColor: '#000'
                }
            },
            layout: {
                padding: {
                    left: 50,
                    right: 0,
                    bottom: 0,
                    top: 0
                }
            },
            tooltips: {
                enabled: true
            }
        }
    });
}

async function fetchData(url) {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error("lỗi fetch data")
    }
    const data = await response.json()
    return data
}