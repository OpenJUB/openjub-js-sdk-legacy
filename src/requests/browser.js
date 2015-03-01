/**
  * Browser implementations of request functions.
  * @namespace JUB.requests.browser
  */
JUB.requests.browser = {}

/**
  * Makes a JSONP GET request from within the browser.
  * @function JUB.requests.browser.get
  * @param {string} url - URL to send request to.
  * @param {object} query - GET Query parameters to send along with the request.
  * @param {JUB.requests~callback} callback - Callback once the request finishes.
  */
JUB.requests.browser.get = function(url, query, callback){

  //build the full url.
  url = JUB.requests.buildGETUrl(url, query);

  //send the request for jsonp
  jQuery.ajax(url, {
    dataType: 'json'
  })
  .always(function(data, statusText, xhr){
    //make sure we have everything
    if(statusText !== 'success'){
      xhr = data;
    }

    //call the callback
    callback(xhr.status, xhr.responseJSON);
  });
}

/**
  * Makes a JSONP POST request from within the browser.
  * @function JUB.requests.browser.post
  * @param {string} url - URL to send request to.
  * @param {object} query - GET Query parameters to send along with the request.
  * @param {object} post_query - POST parameters to send along with the request.
  * @param {JUB.requests~callback} callback - Callback once the request finishes.
  */
JUB.requests.browser.post = function(url, query, post_query, callback){

  //build the full url.
  url = JUB.requests.buildGETUrl(url, query);

  //send the POST request
  jQuery.ajax(url, {
    type: 'POST',
    data: post_query,
    dataType: 'json'
  })
  .always(function(data, statusText, xhr){
    //make sure we have everything
    if(statusText !== 'success'){
      xhr = data;
    }

    //call the callback
    callback(xhr.status, xhr.responseJSON);
  });
}
