// Select page elements
// Containers
var welcomeContainer = $('#welcome-container');
var chartResultsContainer = $('#chart-results-container');
// Buttons
var searchButton = $('#search-submit-button');

// Navigation
// Hide results on page launch
chartResultsContainer.attr('style', 'display: none;');

// Event listener for search
searchButton.click(function(event){
    event.preventDefault();
    console.log('hello')
    chartResultsContainer.attr('style', 'display: grid;');
    welcomeContainer.attr('style', 'display: none;');
})


// Charts
let myChart = document.getElementById('my-chart').getContext('2d');
let barChart = new Chart(myChart, {
    type: 'bar',
    data: {
        labels: ['repositories', 'commits', 'visits'],
        datasets: [{
            label: 'count',
            data: [10000, 8700, 5600]
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});