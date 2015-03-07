/**
  * Looks up users using a machine-readable query. 
  * @param {string[]} fields - Fields to return.
  * @param {number} [limit] - Limit of results to send.
  * @param {number} [skip] - Skip of results to send.
  * @param {JUB.client~requestCallback} [callback] - Callback
  * @function JUB.Client#query
  * @instance
  */
JUB.Client.prototype.query = function(query, fields, limit, skip, callback){

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

  JUB.requests.get(JUB.requests.joinURL(this.server, 'query/'+escape(query)), {
    'fields': fields,
    'limit': limit,
    'skip': skip,
    'token': this.token
  },
  function(code, data){
    //are we successfull?
    if(code === 200){
      //Make a new query result.
      callback(undefined, new JUB.queryResult(data, me));
    } else {
      //we have an error
      callback(data['error']);
    }
  });
}

/**
 * Callback for OpenJUB requests.
 * @callback JUB.client~requestCallback
 * @param {string|undefined} error - An error message if something went wrong or undefined otherwise.
 * @param {JUB.queryResult} result - Query result sent back from OpenJUB.
 */

 /**
   * Represents a query result.
   * @param {object} data - raw json data result.
   * @param {JUB.Client} client - Client the result was originally made with.
   * @function JUB.queryResult
   * @class
   */
JUB.queryResult = function(data, client){
  /**
    * Client the result was originally made with.
    * @type {JUB.client}
    * @property JUB.queryResult#client
    */
  this.client = client;

  /**
    * raw json data result.
    * @type {object}
    * @property JUB.queryResult#_data
    */
  this._data = data;

  /**
    * JSON-style results of the query.
    * @type {object[]}
    * @property JUB.queryResult#data
    */
  this.data = data.data;
}

/**
  * Gets the next page of the result.
  * @param {JUB.client~requestCallback} [callback] - Callback
  * @function JUB.queryResult#next
  * @instance
  */
JUB.queryResult.prototype.next = function(callback){
  var params = JUB.requests.extractGetParams(this._data.next);

  //extract the parameters
  params.fields = params.fields?params.fields.split(","):undefined;
  params.limit = parseInt(params.limit) || undefined;
  params.skip = parseInt(params.skip) || undefined;

  //and send the next result.
  return this.query(params, params.fields, params.limit, params.skip, callback);
}

/**
  * Gets the previous page of the result.
  * @param {JUB.client~requestCallback} [callback] - Callback
  * @function JUB.queryResult#prev
  * @instance
  */
JUB.queryResult.prototype.prev = function(callback){
  var params = JUB.requests.extractGetParams(this._data.prev);

  //extract the parameters
  params.fields = params.fields?params.fields.split(","):undefined;
  params.limit = parseInt(params.limit) || undefined;
  params.skip = parseInt(params.skip) || undefined;

  //and send the prev result.
  return this.query(params, params.fields, params.limit, params.skip, callback);
}
