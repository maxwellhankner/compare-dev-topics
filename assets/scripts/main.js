// Select page elements
// Containers
var welcomeContainer = $('#welcome-container');
var chartResultsContainer = $('#chart-results-container');
// Buttons
var searchButton = $('#search-submit-button');
// Search field
var searchField = $('#search-input-field');

// -------------------------------------------------- Navigation
// Hide results on page launch
chartResultsContainer.attr('style', 'display: none;');

// Search
searchButton.click(function(event){
    event.preventDefault();
    console.log(searchField.val())
    searchField.val('');
    chartResultsContainer.attr('style', 'display: grid;');
    welcomeContainer.attr('style', 'display: none;');
    // get api responses
    // Run buildChart
    buildChart(['react'], [10000]);
})

// -------------------------------------------------- Chart Function

let myChart = document.getElementById('my-chart').getContext('2d');
function buildChart(topics, results){
    console.log(topics, results);
    let barChart = new Chart(myChart, {
        type: 'bar',
        data: {
            labels: ['Repositories'],
            datasets: [{
                label: topics,
                data: results
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
}
