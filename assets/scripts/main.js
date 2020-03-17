// -------------------------------------------------- Select page elements
// Containers
var welcomeContainer = $('#welcome-container');
var chartResultsContainer = $('#chart-results-container');
// Buttons
var searchButton = $('#search-submit-button');
// Search field
var searchField = $('#search-input-field');
// Page title
var pageTitle = $('#page-title');

// -------------------------------------------------- Navigation and View Management
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
    buildGithubChart(['react'], [10000]);
    buildStackOverflowChart(['react'], [8700]);

    // buildGithubChart(['react', 'angular'], [9000, 7600]);
    // buildStackOverflowChart(['react', 'angular'], [12000, 5700]);
})

// -------------------------------------------------- Chart Functions
// Select github canvas
let githubChart = document.getElementById('github-chart').getContext('2d');
// Github Chart Function
function buildGithubChart(topics, githubResults){
    // Create empty array for datasets:
    var githubDataSet = [];
    // Loop the topics and populate dataset array
    for(i = 0; i < topics.length; i++){
        var topicDataObject = {
            label: topics[i],
            data: [githubResults[i]]
        }
        githubDataSet.push(topicDataObject);
    }
    // Build the chart according to githubDataSet
    let barChart = new Chart(githubChart, {
        type: 'bar',
        data: {
            labels: ['Questions'],
            datasets: githubDataSet
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

// Select stack overflow canvas
let stackOverflowChart = document.getElementById('stack-overflow-chart').getContext('2d');
// Stack Overflow Chart Function
function buildStackOverflowChart(topics, stackOverflowResults){
    // Create empty array for datasets:
    var stackOverflowDataSet = [];
    // Loop the topics and populate dataset array
    for(i = 0; i < topics.length; i++){
        var topicDataObject = {
            label: topics[i],
            data: [stackOverflowResults[i]]
        }
        stackOverflowDataSet.push(topicDataObject);
    }
    // Build the chard according to stackOverflowDataSet
    let barChart = new Chart(stackOverflowChart, {
        type: 'bar',
        data: {
            labels: ['Repositories'],
            datasets: stackOverflowDataSet
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