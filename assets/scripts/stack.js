"use strict";

var GetStackOverflow = function() {
  this.buildStringList = function(array) {
    //replace commas with semi-colons for queryString
    return array
      .toString()
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
  this.buildQueryString = function(tagArray, type) {
    var queryURL;
    console.log(typeof tagArray, tagArray);
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
      // and positionally it is placed 'on-top' to achieve 'always' behavior.
      case tagArray[tagArray.length - 1] === "," ||
        tagArray[tagArray.length - 1] === ";":
        tagArray = tagArray.slice(0, -1);
        console.log(tagArray);

      // if variable named 'array' is indeed an array of non-zero length
      // or, if it a string that includes a comma or semicolon:
      //   - stringify the input.
      case (Array.isArray(tagArray) === true) ||
        (typeof tagArray === "string"):
        queryURL =
          "https://api.stackexchange.com/2.2/tags/%7B" +
          this.buildStringList(tagArray) +
          "%7D/synonyms?order=desc&sort=creation&site=stackoverflow";
        break;
      default:
    }
    console.log("result: ",queryURL);
    return queryURL;
  };


  this.tags = function(array) {
    // $.ajax({
    //   url: queryURL,
    //   type: "GET",
    //   datatype: 'json'
    // }).then(function (data) {
    //   console.log(data);
    // });
  };
};
var stackOverflow = new GetStackOverflow();
var tag = "hello,goodbye;fairwell;";
stackOverflow.buildQueryString(tag, "tags");
//stackOverflow.buildQueryString(["javascript", "reactjs"], "questions");
