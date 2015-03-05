/**
  * Namespace for Utility functions.
  * @namespace JUB.utils
  */

JUB.utils = {};

/** Turns the argument into a function.
  * @function JUB.utils.makeFunction
  * @static
  * @param {object} obj - Object to turn into a function.
  * @returns {function}
  */
JUB.utils.makeFunction = function(obj){

  //if it is already a function, return it.
  if(typeof obj === 'function'){
    return obj;
  }

  //else return a lambda style function that just returns obj
  return function(){
    return obj;
  };
}

/** Sets a cookie (if possible).
  * @function JUB.utils.setCookie
  * @static
  * @param {string} name - Name of cookie to get.
  * @param {string} value - Value to set cookie to.
  * @returns {string} the value of the cookie.
  */
JUB.utils.setCookie = function(name, value){

  //we only need to do things if we are in the browser.
  if(isBrowser){
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
JUB.utils.deleteCookie = function(name){

  //we only need to do things if we are in the browser.
  if(isBrowser){
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
JUB.utils.getCookie = function(name){

  //if we are the browser, we should search
  if(isBrowser){
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
