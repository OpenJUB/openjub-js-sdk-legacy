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

  //extract the parameters from the url itself.
  var parameters = JUB.requests.extractGetParams(url);

  //and remove them from the url
  url = url.split('?')[0];

  //the query string
  var query_string = '';


  //overwrite the parameters with the query
  for(var key in query){
    if(query.hasOwnProperty(key)){
      parameters[key] = query[key];
    }
  }

  //build the query string
  for(var key in parameters){
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

/**
  * Extracts GET parameters from a url.
  * @function JUB.requests.extractGetParams
  * @param {string} url - URL to extract parameters from.
  * @returns {object} - A JSON-style object for the parameters.
  */
JUB.requests.extractGetParams = function(url){
  var results = {};

  //we need to check that we have a questionmark.
  if(url.indexOf('?') !== -1){

    //so split by it.
    var params = url.split('?');

    //remove the normal url.
    params.shift();

    //join it back together and find the parameters.
    params = params.join('?');
    params = params.split('&');

    //go over them.
    for(var i=0; i<params.length;i++){

      //split this parameter by equality.
      var parameter = params[i].split('=');

      //get the name
      var name = unescape(parameter.shift());

      //get the value
      var value = unescape(parameter.join('='));

      //only store the first instance.
      if(!results.hasOwnProperty(name)){
          results[name] = value;
      }
    }
  }

  //and return the results.
  return results;

}
