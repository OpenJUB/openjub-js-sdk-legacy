/**
  * Helper namespace for Request functions.
  * @namespace JUB.requests
  */
JUB.requests = {}

/**
 * Calback for requests.
 * @callback JUB.requests~callback
 * @param {number} status_code - The status code returned by the server.
 * @param {object} content - The JSON content of the message.
 */

/**
  * Makes a JSONP GET request.
  * @function JUB.requests.get
  * @param {string} url - URL to send request to.
  * @param {object} query - GET Query parameters to send along with the request.
  * @param {JUB.requests~callback} callback - Callback once the request finishes.
  */
JUB.requests.get = function(url, query, callback){
  if(isBrowser){
    return JUB.requests.browser.get(url, query, callback);
  } else {
    return JUB.requests.node.get(url, query, callback);
  }
}

/**
  * Makes a JSONP POST request.
  * @function JUB.requests.post
  * @param {string} url - URL to send request to.
  * @param {object} query - GET Query parameters to send along with the request.
  * @param {object} post_query - POST parameters to send along with the request.
  * @param {JUB.requests~callback} callback - Callback once the request finishes.
  */
JUB.requests.post = function(url, query, post_query, callback){
  if(isBrowser){
    return JUB.requests.browser.post(url, query, post_query, callback);
  } else {
    return JUB.requests.node.post(url, query, post_query, callback);
  }
}

/**
  * Joins a hostname and a url.
  * @function JUB.requests.joinURL
  * @param {string} base - Base url to start with.
  * @param {string} url - URL on the server.
  * @returns {string} - The full url.
  */
JUB.requests.joinURL = function(base, url){

  //http base
  var base_http = 'http://';

  //the base url for https
  var base_https = 'https://';


  //if we do not start, default to https.
  if(base.substring(0, base_https.length) !== base_https && base.substring(0, base_http.length) !== base_http){
    base = base_https + base;
  }

  //do not end the base with a slash
  if(base[base.length - 1] === '/'){
    base = base.substring(0, base.length - 1);
  }

  //the url should start with a /
  if(url[0] !== '/'){
    url = '/' + url;
  }

  //return the base + url.
  return base + url;
}

/**
  * Build the full GET URL given a query and a url.
  * @function JUB.requests.buildGETUrl
  * @param {string} url - Base url to start with.
  * @param {object[]} query - GET query parameters.
  * @returns {string} - The full URL
  */
JUB.requests.buildGETUrl = function(url, query){
  //the query string
  var query_string = '';

  //build the query string
  for(var key in query){
    if(query.hasOwnProperty(key)){
      if(typeof query[key] !== 'undefined'){
        //encode this component
        query_string += encodeURIComponent(key)+'='+encodeURIComponent(query[key])+'&';
      }
    }
  }

  //prepend the question mark
  //and remove the last character if we need it.
  if(query_string !== ''){
    query_string = '?'+query_string.substring(0, query_string.length - 1);
  }

  //return the full query string.
  return url + query_string;
}
