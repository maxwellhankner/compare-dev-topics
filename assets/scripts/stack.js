//////////////////////////////////////////////////////////////////////////
//   A singleton facade Object for interacting with the tag api of stackoverflow
//      - Accepts an array, single-item array, single sting, or stringfied array.
//        e.g.
//          ["reactjs", "vuejs"]
//          ["reactjs"]
//          "reactjs"
//          "reactjs,vuejs,angularjs"
//
// - Usage:
//    Create the object:
//        var stackOverflow = new GetStackOverflow();
//
//    to get the count of all posts with javascript in the tag name
//        stackOverflow.getCount("javascript","inname");
//
//    to get the top 3 questions on a tag using cached tags (max 30).
//        stackOverflow.getFaqOnTag(tag, 3);
//
//
// TODO: error handling for network requests. (throttle limit specifically)

var GetStackOverflow = function() {
  "use strict";

  this.buildQueryString = function(tagArray, endpoint) {
    //////////////////////////////////////////////////////////////////////////
    //set queryURL based on request type.
    //    - Accepts an array, single-item array, single sting, or stringfied array.
    //      e.g.
    //        ["reactjs", "vuejs"]
    //        ["reactjs"]
    //        "reactjs"
    //        "reactjs,vuejs,angularjs"
    //
    var queryURL;

    // a switch is used here to achieve the effect "if/else && always"
    // switch(true) is used here to allow each case to be processed as well as in this particular order.
    switch (true) {
      // Throw an error for any non-conforming types
      case typeof tagArray === "number" ||
        (typeof tagArray === "object" && !Array.isArray(tagArray)) ||
        typeof tagArray === "boolean" ||
        typeof tagArray === "undefined" ||
        typeof tagArray === "bigint" ||
        typeof tagArray === "function" ||
        typeof tagArray === "symbol" ||
        tagArray.length === 0:
        throw "- buildQueryString:invalid input on tagArray";

      // Always remove a trailing comma (,) or semicolon (;). No 'break' is used here
      // and positionally it is placed 'on-top' of any actions to achieve 'always' behavior.
      case tagArray[tagArray.length - 1] === "," ||
        tagArray[tagArray.length - 1] === ";":
        tagArray = tagArray.slice(0, -1);

      // if variable named 'array' is indeed an array of non-zero length
      // or, if it a string that includes a comma or semicolon:
      //   - stringify the input.
      case Array.isArray(tagArray) === true || typeof tagArray === "string":
        switch (true){
          case endpoint === "synonyms":
            // deprecated - query may find use later.
            queryURL =
              "https://api.stackexchange.com/2.2/tags/%7B" +
              this.buildStringList(tagArray) +
              "%7D/synonyms?order=desc&sort=creation&site=stackoverflow";
            break;
          case endpoint === "inname":
            // implemented
            queryURL =
              "https://api.stackexchange.com/2.2/tags?order=desc&sort=popular&inname=" +
              this.buildStringList(tagArray) +
              "&site=stackoverflow";
            break;
          case endpoint === "related":
            queryURL = 
              "https://api.stackexchange.com/2.2/tags/" +
              this.buildStringList(tagArray) +
              "/related?pagesize=100&site=stackoverflow"
            break;
          case endpoint === "faq":
            // implemented
            queryURL =
              "https://api.stackexchange.com/2.2/tags/" +
              this.buildStringList(tagArray) +
              "/faq?site=stackoverflow";
            break;
          case endpoint === "popular_recent":
            queryURL =
              "https://api.stackexchange.com/2.2/tags?pagesize=100&fromdate=" +
              this.setRecentTimeWindow(4) +
              "&order=desc&sort=popular&site=stackoverflow";
            break;
          case endpoint === "popular_alltime":
            queryURL =
              "https://api.stackexchange.com/2.2/tags?pagesize=100&order=desc&sort=popular&site=stackoverflow";
            break;
        }
        break;
      default:
        // if you've gotten here, watch out for dragons
        throw "- buildQueryString:unhandled exception - exiting";
    }
    // return the final query string
    return queryURL;
  };

  this.buildStringList = function(array) {
    //////////////////////////////////////////////////////////////////////////
    // A beep beep bop utility for this.buildQueryString() that helpfully
    // removes spaces and replace commas with semi-colons for this.queryURL
    return array
      .toString()
      .split(" ")
      .join("%")
      .split(",")
      .join(";");
  };

  this.setRecentTimeWindow = function(minusYears) {
    var currentDate = new Date();
    var currentTimeEpochSeconds = Math.floor(currentDate.getTime() / 1000);

    // return current time minus x years
    //    - the number of seconds in a day (86400)
    //    - the number of days in an average year (365)
    return currentTimeEpochSeconds - ((86400 * 365) * minusYears);
  };

  
  this.getJSON = async function(queryURL) {
    //////////////////////////////////////////////////////////////////////////
    // a jazzy request utility to get a json response and store it as a
    // property in this object.
    await $.ajax({
      url: queryURL,
      type: "GET",
      context: this,
      datatype: "json"
    }).then(function(data) {
      this.parsedJSON = data;
    });
  };


  this.queryTags = [];
  this.cacheQueryTags = async function (endpoint, fetchNew = false, tags) {
    // stores stackoverflow tags from a tag-inname request to an array
    if(fetchNew){
      if(tags.length > 0){
        this.queryURL = this.buildQueryString(tags, endpoint);
        await this.getJSON(this.queryURL);
      } else {
        throw "fetchNew set to true, tags param must be specified.";
      };
    };

    this.queryTags = this.parsedJSON.items.map(function (element){
      switch(true){
        case endpoint === "synonyms":
          var obj = {
            parentTag: element.to_tag,
            synonym: element.from_tag
          };
          return obj;
        case endpoint === "inname":
          var obj = {
            tagName: element.name,
            tagCount: element.count
          };
          return obj;
      }
    });
  };

  this.decodeCharEntities = function (strWithEntity) {
    // given the string "setState doesn&#39;t update the state immediately"
    //
    // we need to convert the character entity &#39; into an apostrophe (')
    // without manually creating an entry in an enumeration for every character entity
    // that may be encountered.

    // javascript doesn't parse HTML character entities by default,
    // in order to clean up the entities that are returned in question
    // titles returned by StackExchange, we have to tell JS to treat
    // each returned title as HTML.  To do that we:

    // spin up the the DOM parser engine
    var parser = new DOMParser()

    // Again, given that strWithEntity = "setState doesn&#39;t update the state immediately"
    // we convert each title (strWithEntity) to a new documentFragment.
    var documentFragment = parser.parseFromString(strWithEntity, "text/html")
    // Now strWithEntity no longer a typeof string, but instead a complete and 
    // independent html document with child nodes (var doc). 
    // var doc's now DOM is:
    // <html>
    //    <head></head>
    //    <body>
    //      setState doesn't update the state immediately
    //    </body>
    // </html>
    //
    // this implicitly decodes the character entity for an apostrophe (&#39;) or
    // any other character entity for that matter, because it's html and no longer a simple a JS string.

    // the only thing that's left is to extract the text content from the body of our
    // temporary html document fragment.
    return documentFragment.body.textContent;

    // though not encountered yet, the only forseeable problem with this
    // solution is a case where quotes (single or double) might be decoded
    //  and returned into a json-like object.
    //  
    //  i.e. 
    //    " " " or ' ' '  
    // 
    //    though...
    //   " ' " and ' " '
    //    will not pose an issue.
    //
    // if these cases arise, the Javascript engine itself will certainly choke on the malformed string.
  };

  

  this.faqs = {};
  this.getFaqOnTag = async function (tag, returnCount,fetchNew = false) {

    // update the tag cache
    if(fetchNew){
      if(tag.length > 0){
        await this.cacheQueryTags("inname",true,tag);
      } else {
        throw "fetchNew set to true, tag param must be specified.";
      };
    };

    // get top entry from tag cache
    // generate new query string for faqs on top entry from tag cache
    this.queryURL = await this.buildQueryString(this.queryTags[0].tagName,"faq");

    // place fetch on query 
    await this.getJSON(this.queryURL);
    var that = this;
    // map query results to object
    this.faqs = this.parsedJSON.items.map(function (element) {
      var obj = {
        title: this.decodeCharEntities(element.title),
        link: element.link,
        views: element.view_count,
        tags: element.tags
      }
      return obj;
    }, this);

    // return objects based in desired count
    return this.faqs.slice(0,returnCount)
  };

  this.relatedTags = {};
  this.getRelatedOnTag = async function (tag) {
    console.log("getRelatedOnTag is not yet implemented");
  };
  this.getRelated_OR_onTags = async function (tagArray) {
    // The stack exchange API does accept multiple tags, but ANDs them implicitly.
    // in order to provide an ORDERED single data set of related tags for any compared topics
    // the related tags API must be hit for each search term, the results for each term must be
    // concatenated into a single array, and then sorted by times a given tag has been applied.
    console.log("getRelated_OR_onTags is not yet implemented");
  };

  this.calcCount = async function(endpoint) {
    await this.getJSON(this.queryURL);
    await this.cacheQueryTags(endpoint);
    var count = this.parsedJSON.items.reduce(function(total, element) {
      return total + element.count;
    }, 0);

    return count;
  };

  this.count;
  this.getCount = async function(tags, endpoint) {
    // actually call and build the query string for counting tagged items
    this.queryURL = this.buildQueryString(tags, endpoint);
    this.count = await this.calcCount(endpoint);

    return this.count;
  };
};

// Stack Overflow setup
var stackOverflow = new GetStackOverflow();


///////////// Useful function test calls
//var tag = "react";
//console.log(stackOverflow.buildQueryString(tag,"popular_recent"));
//stackOverflow.getCount(tag,"inname"); //add console.log(this.count) to line before return.
//stackOverflow.getFaqOnTag(tag, 3, true); //add console.log(this.faqs.slice(0,returnCount)); to line before return
//console.log(stackOverflow.buildQueryString(tag,"faq"));
//stackOverflow.cacheQueryTags("inname",true,tag);
//stackOverflow.getFaqOnTag(tag,3);
//console.log(stackOverflow.setRecentTimeWindow(4));
