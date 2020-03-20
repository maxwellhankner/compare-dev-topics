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
    // Clear arrays
    topicsArray = [];
    githubResultsArray = [];
    stackOverflowResultsArray = [];
    githubTopReposArray = [];
    stackOverflowTopQuestionsArray = [];
    // Build topics array elements
    buildTopicsDiv();
    // Clear charts
    barChartGithub.destroy();
    barChartStack.destroy();

    // ------------------------- TODO Empty the top result containers and hide them ------

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
    topicContainer.append(newTopicElement);
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
searchButton.click(async function(event){
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

    // Arrays to store api call count values
    var githubResultsArray = [];
    var stackOverflowResultsArray = [];
    // Arrays to store api call top resonse values
    var githubTopReposArrays = [];
    var stackOverflowTopQuestionsArrays = [];

    for(i = 0; i < topicsArray.length; i++){
        // Github counts array
        var currentReposCount = await createGithubResultArrays(topicsArray[i])
        githubResultsArray.push(currentReposCount);

        // Github top repos array ---------------------------------------------- TODO
        // var currentRepoObject = await createGithubResultArrays(topicsArray[i])
        var currentRepoArray = [{title: 'title1', link: 'link1'}, {title: 'title2', link: 'link2'}]
        githubTopReposArrays.push(currentRepoArray);

        //Stack Overflow counts array
        var currentQuestionCount = await createStackOverflowResultArrays(topicsArray[i])
        stackOverflowResultsArray.push(currentQuestionCount);

        // Stack Overflow top questions array ---------------------------------------------- TODO
        // var currentQuestionObject = await createStackOverflowResultArrays(topicsArray[i])
        var currentQuestionArray = [{title: 'title', link: 'link'}]
        stackOverflowTopQuestionsArrays.push(currentQuestionArray);
    }

    // Run buildChart functions with the arrays
    buildGithubChart(topicsArray, githubResultsArray);
    buildStackOverflowChart(topicsArray, stackOverflowResultsArray);

    // Run buildTopResponse functions with the arrays
    buildGithubResponseElement(topicsArray, githubTopReposArrays);

    // console.log(topicsArray)
    // console.log(githubTopReposArray);
    
})


// Create result arrays
function createGithubResultArrays(topic) {
    var topicsReposCount = getGitHubReposCount(topic);
    return topicsReposCount
}

function createStackOverflowResultArrays(topic) {
    var topicsQuestionCount = stackOverflow.getCount(topic, "inname");
    return topicsQuestionCount
}

// -------------------------------------------------- Chart Functions
// Bar chart colors
var colors = ['#1ABC9C', '#F39C12', '#E74C3C', '#A569BD'];
// Select github canvas
let githubChart = document.getElementById('github-chart').getContext('2d');
// Creat chart
let barChartGithub;
// Github Chart Function
function buildGithubChart(topics, githubResults){
    // Create empty array for datasets:
    var githubDataSet = [];
    // Loop the topics and populate dataset array
    for(i = 0; i < topics.length; i++){
        var topicDataObject = {
            label: topics[i],
            data: [githubResults[i]],
            backgroundColor: colors[i]
        }
        githubDataSet.push(topicDataObject);
    }
    // Build the chart according to githubDataSet
    barChartGithub = new Chart(githubChart, {
        type: 'bar',
        data: {
            labels: ['Repositories'],
            datasets: githubDataSet,
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            events: []
        }
    });
    
}

// Select stack overflow canvas
let stackOverflowChart = document.getElementById('stack-overflow-chart').getContext('2d');
// Create chart variable
let barChartStack
// Stack Overflow Chart Function
function buildStackOverflowChart(topics, stackOverflowResults){
    // Create empty array for datasets:
    var stackOverflowDataSet = [];
    // Loop the topics and populate dataset array
    for(i = 0; i < topics.length; i++){
        var topicDataObject = {
            label: topics[i],
            data: [stackOverflowResults[i]],
            backgroundColor: colors[i]
        }
        stackOverflowDataSet.push(topicDataObject);
    }
    // Build the chard according to stackOverflowDataSet
    barChartStack = new Chart(stackOverflowChart, {
        type: 'bar',
        data: {
            labels: ['Questions'],
            datasets: stackOverflowDataSet
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            events: []
        }
    });
    
}

// Build top result element arrays
function buildGithubResponseElement(topics, reposArrays){
    // select github card
    var githubReposCard = $('#github-repos-card')
    githubReposCard.empty();
    // empty everything in github card-body
    for (i = 0; i < topics.length; i++){
        // console.log(topics[i] + " " + reposArrays[i][0].title + " " + reposArrays[i][0].link);

        // create div.card
        var topicCard = $('<div>');
        topicCard.addClass('card');
        // create div.card-header
        var topicHeader = $('<div>');
        topicHeader.addClass('card-header');
        topicHeader.text(topics[i]);
        topicCard.append(topicHeader);
        var topicBody = $('<div>');
        topicBody.addClass('card-body');
        topicCard.append(topicBody);

        for (x = 0; x < reposArrays[i].length; x++) {
            // create div.card-body
            var repoResult = $('<div>');
            repoResult.addClass('card');
            var repoHeader = $('<div>');
            repoHeader.addClass('card-header')
            repoHeader.text(reposArrays[i][x].title);
            repoResult.append(repoHeader);
            var repoBody = $('<div>');
            repoBody.addClass('card-body');
            repoBody.text(reposArrays[i][x].link);
            repoResult.append(repoBody)
            // append to parent card
            topicBody.append(repoResult);
        }
        // append topic card to github card-body
        githubReposCard.append(topicCard);
    }
}

// function buildStackOverflowResponseElement(topics, stackOverflowTopQuestionsArray){
//     console.log(topics + " " + stackOverflowTopQuestionsArray[0]);
// }