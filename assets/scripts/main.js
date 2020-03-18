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

// -------------------------------------------------- Multisearch
var topicsArray = []
addTopicButton.click(function(event){
    // Do not refresh
    event.preventDefault();
    if (!(searchField.val() === '')){
        topicsArray.push(searchField.val());
        }
        buildTopicsDiv()
        searchField.val('');
    })

// BuildTopicsDiv function
function buildTopicsDiv(){
    topicContainer.empty();
    for (i = 0; i < topicsArray.length; i++){
        createTopicElement(topicsArray[i], i);
    }
}

// createTopicElement function
function createTopicElement(userTopic, index) {
    var newTopicElement = $($.parseHTML('<div class="topic-element"><form class="form-inline"><input id="search-input-field" class="form-control mr-sm-2" aria-label="Search" value="' + userTopic + '" readonly /><button id="' + index + '" class="btn btn-outline-dark my-2 my-sm-0 delete-topic-buttons" type="submit"><i class="material-icons">close</i></button></form></div>'));
    topicContainer.prepend(newTopicElement);
}

// Delete topic buttons listener
$(document).on('click', '.topic-element', function(event){
    event.preventDefault();
    
    if (event.target.tagName.toLowerCase() === 'button') {
        // console.log('button');
        //console.log(event.target.parentElement.parentElement.parentElement);
        var index = event.target.id;
        topicsArray.splice(index, 1);
        buildTopicsDiv()
    }
    else if (event.target.tagName.toLowerCase() === 'i') {
        // console.log('i');
        var index = event.target.parentElement.id;
        topicsArray.splice(index, 1);
        buildTopicsDiv()
        // console.log(event.target.parentElement.id);
    }

})

// -------------------------------------------------- Run Search
searchButton.click(function(event){
    // Do not refresh
    event.preventDefault();
    // If some text is in the field, add it to the topicsArray and build the topic elements
    if (!(searchField.val() === '')) {
        topicsArray.push(searchField.val());
        buildTopicsDiv()
    }
    // If nothing is in the seracg field or the topics awway, dont to anything
    if (searchField.val() === '' && topicsArray.length === 0 ){
        console.log('nada');
        return
    }
    // Clear the search form text
    searchField.val('');
    // Show the chart result container
    chartResultsContainer.attr('style', 'display: block;');
    // Hide the welcome container
    welcomeContainer.attr('style', 'display: none;');

    

    // Arrays to store api call response values
    var githubResultArray = [];
    var stackOverflowResultsArray = [];

    createResultArrays(topicsArray, githubResultArray, stackOverflowResultsArray);

    // Run buildChart functions with the arrays
    buildGithubChart(topicsArray, githubResultArray);
    buildStackOverflowChart(topicsArray, stackOverflowResultsArray);
    
    console.log(topicsArray);
})

// Create result arrays
function createResultArrays(topics, github, stackOverflow) {
    for (i = 0; i < topics.length; i++) {
        // call github api function and put response into github array
        // call stock overflow api function and put response into stack overflow array
    }
}

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