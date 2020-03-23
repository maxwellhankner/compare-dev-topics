
// START searchGitHubRepos function
async function getGitHubReposCount(searchValue){
    
    var count = 0;
    
    // create queryString variable for GitHub API call
    var gitHubQueryString = "https://api.github.com/search/repositories?q=language:"+searchValue+"+"+searchValue+"&sort=stars&order=desc";

    // START gitHub API call
    await $.ajax({
        // use GET to return api data
        type: "GET",
        // queryString url
        url: gitHubQueryString,
        // data returned will be in json format
        dataType: "json"  
    }).then(function(response) {

        count = response.total_count;

    });
    // END gitHub API call

    return count;

}
// END searchGitHubRepos function

// getTopGitHubRepos("Javascript");
// START getTopGithubRepos
async function getTopGitHubRepos(searchValue, count){
    
    // create blank array of objects
    var arrGitHubObjects = [];
    
    // create queryString URL
    var gitHubQueryString = "https://api.github.com/search/repositories?q=language:"+searchValue+"+"+searchValue+"&sort=stars&order=desc";
    
    // START gitHub API call
    await $.ajax({
        // use GET to return api data
        type: "GET",
        // queryString url
        url: gitHubQueryString,
        // data returned will be in json format
        dataType: "json"  
        // then promise
    }).then(function(response) {
        
        console.log(response);
        // START iterate through top five objects in response 
        for (var i = 0; i < count; i++){

            // create var for current repo object
            var repo = response.items[i];
            
            // assign repo title and link to object at current index
            arrGitHubObjects.push({name: repo.name, url: repo.html_url}); 

        }
        // END iterate through top five objects in response

    });
    // END gitHub API call

    return arrGitHubObjects;

}
// END getTopGitHubRepos
