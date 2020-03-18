"use strict";

var GetStackOverflow = function() {
  //////////////////////////////////////////////////////////////////////////
  // remove spaces and replace commas with semi-colons for queryString
  this.buildStringList = function(array) {
    return array
      .toString()
      .split(" ")
      .join("")
      .split(",")
      .join(";");
  };

  //////////////////////////////////////////////////////////////////////////
  //set queryURL based on request type.
  //    - Accepts an array, single-item array, single sting, or stringfied array.
  //      e.g.
  //        ["reactjs", "vuejs"]
  //        ["reactjs"]
  //        "reactjs"
  //        "reactjs,vuejs,angularjs"
  //
  this.buildQueryString = function(tagArray) {
    // console.log(typeof tagArray);
    // console.log(tagArray);
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
        queryURL =
          "https://api.stackexchange.com/2.2/tags/%7B" +
          this.buildStringList(tagArray) +
          "%7D/synonyms?order=desc&sort=creation&site=stackoverflow";
        break;
      default:
        // if you've gotten here, watch out for dragons
        throw "- buildQueryString:unhandled exception - exiting";
    }
    // return the final query string
    return queryURL;
  };

  this.getJSON = async function(queryURL) {
    await $.ajax({
      url: queryURL,
      type: "GET",
      datatype: "json"
    }).then(function(data) {
      return data;
    });
  };

  this.rawJSON;
  this.parsedJSON;

  

  this.calcCount = function (tags) {
    console.log("Result set. -- stored in: this.result");
    this.rawJSON = this.getJSON(this.buildQueryString(tags));
     

  }

  this.result = {}
};



var stackOverflow = new GetStackOverflow();
var tag = "javascript ,react; angular ,  view,";
stackOverflow.calcCount(tag);
console.log(stackOverflow.rawJSON);
//stackOverflow.buildQueryString(["javascript", "reactjs"], "questions");

