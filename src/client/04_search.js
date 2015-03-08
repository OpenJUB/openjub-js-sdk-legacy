/**
  * Looks up users using a search
  * @param {string[]} fields - Fields to return.
  * @param {number} [limit] - Limit of results to send.
  * @param {number} [skip] - Skip of results to send.
  * @param {JUB.client~requestCallback} [callback] - Callback
  * @function JUB.Client#search
  * @instance
  */
JUB.Client.prototype.search = function(search, fields, limit, skip, callback){

  //this is me.
  var me = this;

  //if we skipped limit, skip
  if(typeof limit === 'function'){
    callback = limit;
    limit = undefined;
    skip = undefined;
  }

  //Make sure its a function.
  callback = JUB.utils.makeFunction(callback);

  //if we do not have fields, reset them.
  if(fields && fields.length == 0){
    fields = undefined;
  }

  JUB.requests.get(JUB.requests.joinURL(this.server, 'search/'+escape(search)), {
    'fields': fields,
    'limit': limit,
    'skip': skip,
    'token': this.token
  },
  function(code, data){
    //are we successfull?
    if(code === 200){
      //Make a new search result.
      callback(undefined, new JUB.searchResult(data, search, me));
    } else {
      //check the status if we had an error.
      me.status(function(){
        //we have an error
        callback(data['error']);
      });
    }
  });
}

/**
 * Callback for OpenJUB requests.
 * @callback JUB.client~requestCallback
 * @param {string|undefined} error - An error message if something went wrong or undefined otherwise.
 * @param {JUB.searchResult} result - search result sent back from OpenJUB.
 */

 /**
   * Represents a search result.
   * @param {object} data - raw json data result.
   * @param {string} search - The original search.
   * @param {JUB.Client} client - Client the result was originally made with.
   * @function JUB.searchResult
   * @class
   */
JUB.searchResult = function(data, search, client){
  /**
    * Client the result was originally made with.
    * @type {JUB.client}
    * @property JUB.searchResult#client
    */
  this.client = client;

  /**
    * The original search.
    * @type {string}
    * @property JUB.searchResult#search
    */
  this.search = search;

  /**
    * raw json data result.
    * @type {object}
    * @property JUB.searchResult#_data
    */
  this._data = data;

  /**
    * JSON-style results of the search.
    * @type {object[]}
    * @property JUB.searchResult#data
    */
  this.data = data.data;
}

/**
  * Gets the next page of the result.
  * @param {JUB.client~requestCallback} [callback] - Callback
  * @function JUB.searchResult#next
  * @instance
  */
JUB.searchResult.prototype.next = function(callback){
  var params = JUB.requests.extractGetParams(this._data.next);

  //extract the parameters
  params.fields = params.fields?params.fields.split(","):undefined;
  params.limit = parseInt(params.limit) || undefined;
  params.skip = parseInt(params.skip) || undefined;

  //and send the next result.
  return this.search(this.search, params.fields, params.limit, params.skip, callback);
}

/**
  * Gets the previous page of the result.
  * @param {JUB.client~requestCallback} [callback] - Callback
  * @function JUB.searchResult#prev
  * @instance
  */
JUB.searchResult.prototype.prev = function(callback){
  var params = JUB.requests.extractGetParams(this._data.prev);

  //extract the parameters
  params.fields = params.fields?params.fields.split(","):undefined;
  params.limit = parseInt(params.limit) || undefined;
  params.skip = parseInt(params.skip) || undefined;

  //and send the prev result.
  return this.search(this.search, params.fields, params.limit, params.skip, callback);
}
