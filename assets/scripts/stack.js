//////////////////////////////////////////////////////////////////////////
//   Object for interacting with the tag api of stackoverflow
//      - Accepts an array, single-item array, single sting, or stringfied array.
//        e.g.
//          ["reactjs", "vuejs"]
//          ["reactjs"]
//          "reactjs"
//          "reactjs,vuejs,angularjs"
//
// - Usage:

var GetStackOverflow = function() {
  "use strict";

  this.buildQueryString = function(tagArray) {
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

  this.buildStringList = function(array) {
    //////////////////////////////////////////////////////////////////////////
    // A beep beep bop utility for this.buildQueryString() that helpfully
    // removes spaces and replace commas with semi-colons for this.queryURL
    return array
      .toString()
      .split(" ")
      .join("")
      .split(",")
      .join(";");
  };

  //////////////////////////////////////////////////////////////////////////
  // a jazzy request utility to get a json response and store it as a
  // property in this object.
  this.getJSON = async function(queryURL) {
    await $.ajax({
      url: queryURL,
      type: "GET",
      context: this,
      datatype: "json"
    }).then(function(data) {
      this.parsedJSON = data;
    });
  };
  
  this.calcCount = async function() {
    await this.getJSON(this.queryURL);
    var count = this.parsedJSON.items.reduce(function(total, element) {
      //console.log("calc-Count - ",total + element.applied_count);
      return total + element.applied_count;
    }, 0);

    //console.log("calcCount - ", count, typeof count);
    return count;
  };
  
  //////////////////////////////////////////////////////////////////////////
  // actually call and build the query string  /////////////////////////////
  //////////////////////////////////////////////////////////////////////////
  this.count;
  this.getCount = async function (tags) {
    this.queryURL = this.buildQueryString(tags);
    this.count = await this.calcCount()



    //console.log("getCount - ", this.count, typeof this.count);

    return this.count;
  };
};

//main.js
/////////////////////////////////////////////


// async function dummy() {
//   var tag = "javascript";
//   var stackOverflow = new GetStackOverflow();

//   // call
//   var countTotal = await stackOverflow.getCount(tag);

//   //console.log("dummy - ",countTotal);

//   return countTotal;
// }

// var countTotal2 = dummy();

// console.log("countTotal2 - ", countTotal2);