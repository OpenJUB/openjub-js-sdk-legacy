var JUB = {};
JUB.utils = module.exports = {};

var util = require('util');
var timers = require('timers');

/**
  * Namespace for Utility functions.
  * @namespace JUB.utils
  */

  /** Runs a function asyncronously.
    * @function JUB.utils.setImmediate
    * @static
    * @param {function} f - Function to run.
    */
var setImmediate = JUB.utils.setImmediate = function setImmediate(f){
  return timers.setImmediate.apply(timers, arguments);
}

/** Makes sure a function runs at most every delay seconds.
  * @function JUB.utils.debounce
  * @static
  * @param {function} f - Function to run.
  * @param {number} delay - Delay to wait.
  * @returns {function}
  */
var debounce = JUB.utils.debounce = function debounce(f, delay){
  var timerId;
  return function(){
    var me = this;
    var args = arguments;
    clearTimeout(timerId);
    timerId = setTimeout(function(){return f.apply(me, args); }, delay);
  };
}

/** Turns the argument into a function.
  * @function JUB.utils.makeFunction
  * @static
  * @param {object} obj - Object to turn into a function.
  * @returns {function}
  */
var makeFunction = JUB.utils.makeFunction = function makeFunction(obj){

  //if it is already a function, return it.
  if(typeof obj === 'function'){
    return obj;
  }

  //else return a lambda style function that just returns obj
  return function(){
    return obj;
  };
}

/** Extends an object by properties.
  * @function JUB.utils.extend
  * @static
  * @param {object} origin - Original object to extend
  * @param {object} add - Object to extend with.
  * @returns {object} The extended origin
  */
var extend = JUB.utils.extend = util._extend;

/** Generates a GUID. 
  * @function JUB.utils.guid
  * @static
  * @returns {string} A GUID
  */
var guid = JUB.utils.guid = function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

/** Sets a cookie (if possible).
  * @function JUB.utils.setCookie
  * @static
  * @param {string} name - Name of cookie to get.
  * @param {string} value - Value to set cookie to.
  * @returns {string} the value of the cookie.
  */
var setCookie = JUB.utils.setCookie = function setCookie(name, value){

  //we only need to do things if we are in the browser.
  if(process.browser){
    //adapted from http://www.w3schools.com/js/js_cookies.asp

    //the cookie should expire in one day.
    var d = new Date();
    d.setTime(d.getTime() + (1*24*60*60*1000));

    //build the cookie string.
    var expires = 'expires='+d.toUTCString();
    document.cookie = name + '=' + value + '; ' + expires;

    //return the set value.
    return value;
  } else {
    return undefined;
  }

}

/** Deletes a cookie (if possible).
  * @function JUB.utils.deleteCookie
  * @static
  * @param {string} name - Name of cookie to delete.
  */
var deleteCookie = JUB.utils.deleteCookie = function deleteCookie(name){

  //we only need to do things if we are in the browser.
  if(process.browser){
    //adapted from http://www.w3schools.com/js/js_cookies.asp

    //just set the cookie to expire a long time ago.
    document.cookie = name + '=' + '; expires=Thu, 01 Jan 1970 00:00:00 UTC';

    return undefined;
  } else {
    return undefined;
  }

}

/** Gets a cookie (if available).
  * @function JUB.utils.getCookie
  * @static
  * @param {string} name - Name of cookie to get.
  * @returns {string} the value of the cookie.
  */
var getCookie = JUB.utils.getCookie = function getCookie(name){

  //if we are the browser, we should search
  if(process.browser){
    //adapted from http://www.w3schools.com/js/js_cookies.asp

    //we want to search for something.
    name = name + '=';

    //so split the document cookie
    var ca = document.cookie.split(';');

    //and go through it.
    for(var i=0; i<ca.length; i++) {
      //until we find the cookie.
      var c = ca[i];
      while (c.charAt(0)===' '){
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0){
        return c.substring(name.length,c.length);
      }
    }

    return undefined;
  } else {
    //we do not have that functionality
    return undefined;
  }
}
