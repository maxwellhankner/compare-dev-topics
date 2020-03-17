// Select page elements
// Containers
var welcomeContainer = $('#welcome-container');
var chartResultsContainer = $('#chart-results-container');
// Buttons
var searchButton = $('#search-submit-button');
// Search field
var searchField = $('#search-input-field');
// Page title
var pageTitle = $('#page-title');

// -------------------------------------------------- Navigation and Views
// Hidden on page launch
chartResultsContainer.attr('style', 'display: none;');

// Title listener
pageTitle.click(function(event){
    // Do not refresh
    event.preventDefault();
    // Show the chart result container
    chartResultsContainer.attr('style', 'display: none;');
    // Hide the welcome container
    welcomeContainer.attr('style', 'display: block;');
})

// Search listener
searchButton.click(function(event){
    // Do not refresh
    event.preventDefault();
    // Clear the search form text
    searchField.val('');
    // Show the chart result container
    chartResultsContainer.attr('style', 'display: grid;');
    // Hide the welcome container
    welcomeContainer.attr('style', 'display: none;');
    // Run buildChart function with static parameters
    buildChart(['react'], [10000]);
})

// -------------------------------------------------- Chart Function

let myChart = document.getElementById('my-chart').getContext('2d');
function buildChart(topics, results){
    console.log(topics, results);
    if(topics.length = 1){
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
    else if(topics.length = 2){
        let barChart = new Chart(myChart, {
            type: 'bar',
            data: {
                labels: ['Repositories'],
                datasets: [{
                    label: topics[0],
                    data: results[0]
                },
                {
                    label: topics[1],
                    data: results[1]
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
}
