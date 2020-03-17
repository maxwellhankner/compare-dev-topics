"use strict";

var GetStackOverflow = function() {
  this.buildStringList = function(array) {
    return array
      .toString()
      .split(",")
      .join(";");
  };

  //////////////////////////////////////////////////////////////////////////
  //set queryURL based on reponse type.
  //    - Accepts an array, single-item array, single sting, or stringfied array.
  this.buildQueryString = function(tagArray, type) {
    var queryURL;
    // a switch is used here to achieve the effect "if/else && always"
    // switch(true) is used here to allow each case to be processed as well as in this particular order.
    switch (true) {
      case typeof tagArray == undefined:
        return tagArray;
      // Always remove a trailing comma (,) or semicolon (;). No 'break' is used here
      // and positionally it is placed 'on-top' to achieve 'always' behavior.
      case tagArray[tagArray.length - 1] === "," ||
        tagArray[tagArray.length - 1] === ";":
        tagArray = tagArray.slice(0, -1);
      // if variable named 'array' is indeed an array of non-zero length
      // or, if it a string that includes a comma or semicolon:
      //   - stringify the input.
      case (Array.isArray(tagArray) === true && tagArray.length !== 0) ||
        (typeof tagArray === "string" &&
          (tagArray.includes(",") || tagArray.includes(";"))):
        var queryURL =
          "https://api.stackexchange.com/2.2/tags/%7B" +
          this.buildStringList(tagArray) +
          "%7D/synonyms?order=desc&sort=creation&site=stackoverflow";
        break;
      default:
    }

    //return queryURL;
  };
  this.buildQueryStringEmptyException = function(value) {
    this.value = value;
    this.message = "input cannot be empty";
    this.toString = function() {
      return this.value + this.message;
    };
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

console.log(stackOverflow.buildQueryString([], "tags"));
//stackOverflow.buildQueryString(["javascript", "reactjs"], "questions");
