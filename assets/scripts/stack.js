"use strict";

var GetStackOverflow = function() {
  this.buildStringList = function(array) {
    return array
      .toString()
      .split(",")
      .join(";");
  };
  this.buildQueryString = function(array, type) {
    //////////////////////////////////////////////////////////////////////////
    //set queryURL based on input type.
    //    - Accepts an array, single-item array,
    var queryURL;
    // a switch is used here to achieve the effect "if/else && always"
    switch (true) {
      // Always remove a trailing comma (,) or semicolon (;). No 'break' and 'on-top' for 'always' behavior.
      case array[array.length - 1] === "," || array[array.length - 1] === ";":
        array = array.slice(0, -1);
      // if variable named 'array' is indeed an array of non-zero length
      // or, if it a string that includes a comma or semicolon:
      //   -
      case (Array.isArray(array) === true && array.length !== 0) ||
        (typeof array === "string" &&
          (array.includes(",") || array.includes(";"))):
        var queryURL =
          "https://api.stackexchange.com/2.2/tags/%7B" +
          this.buildStringList(array) +
          "%7D/synonyms?order=desc&sort=creation&site=stackoverflow";
        break;
      default:
    }

    return queryURL;
  };
  this.tags = function(array) {
    console.log(queryURL);
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

console.log(stackOverflow.buildQueryString(["javascript","reactjs"], "tags"));
stackOverflow.buildQueryString(["javascript", "reactjs"], "questions");
