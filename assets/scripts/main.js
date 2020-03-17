// -------------------------------------------------- Select page elements
// Containers
var welcomeContainer = $('#welcome-container');
var chartResultsContainer = $('#chart-results-container');
// Buttons
var searchButton = $('#search-submit-button');
var addTopicButton = $('#add-topic-button');
var deleteTopicButtons = $('.delete-topic-buttons');
// Search field
var searchField = $('#search-input-field');
// Page title
var pageTitle = $('#page-title');
// Topic container
var topicContainer = $('#topic-container');

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

// Multisearch
addTopicButton.click(function(event){
    // Do not refresh
    event.preventDefault();
    console.log(searchField.val());
    createTopicElement(searchField.val());
    searchField.val('');
    // If there is nothing in the field, do nothing
    // If there is something in the field..
    // create a new topic-element div with the search form value in the value
    // prepend it to the top of the form-inline div
})

// createTopicElement function
function createTopicElement(userTopic) {
    var newTopicElement = $($.parseHTML('<div class="topic-element"><form class="form-inline"><input id="search-input-field" class="form-control mr-sm-2" aria-label="Search" value="' + userTopic + '"/><button class="btn btn-outline-dark my-2 my-sm-0 delete-topic-buttons" type="submit"><i class="material-icons">close</i></button></form></div>'));
    topicContainer.prepend(newTopicElement);
}

// Delete topic buttons
// event listener on all dynamically changing topic-elements
$(document).on('click', '.delete-topic-buttons', function(event){
    event.preventDefault();
    console.log(event.target());
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