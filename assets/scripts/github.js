// START document ready function
$(document).ready(function(){

    
    console.log("ln 5 gitHubReposCount: "+ getGitHubReposCount("javascript"))


    // START searchGitHubRepos function
    function getGitHubReposCount(searchValue){
        
        var count = 0;
        
        // create queryString variable for GitHub API call
        var gitHubQueryString = "https://api.github.com/search/repositories?q=language:"+searchValue+"&sort=stars&order=desc";
        
        console.log(gitHubQueryString)

        // START gitHub API call
        $.ajax({          
            
            // use GET to return api data
            type: "GET",
            // queryString url
            url: gitHubQueryString,
            // data returned will be in json format
            dataType: "json"  
        }).then(function(response) {

            console.log("ln 29 response.total_count: " + response.total_count);
            count = response.total_count;

        });
        // END gitHub API call

        return count;

    }
    // END searchGitHubRepos function
})
// START document ready function