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

    // Figure out how many topics the user desires
    
    // got topics
    // call githubFunction(topic) 

    // Build two arrays

    // Run buildChart function with static parameters
    buildChart(['react'], [10000]);
})

// -------------------------------------------------- Chart Function

let myChart = document.getElementById('my-chart').getContext('2d');
function buildChart(topics, githubResults){
    var githubDataSet = [];
    // var stackOverflowDataSet = [];
    for(i = 0; i < topics.length; i++){
        var topicDataObject = {
            label: topics[i],
            data: githubResults[i]
        }
        console.log(topicDataObject);
        githubDataSet.push(topicDataObject);
    }
    console.log(githubDataSet);
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
}
