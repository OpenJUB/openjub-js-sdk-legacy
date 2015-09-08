var JUB = {
  'requests': require('./requests')
};

/**
  * Represents a query result.
  * @param {object} data - raw json data result.
  * @param {string} query - The original query.
  * @param {JUB.Client} client - Client the result was originally made with.
  * @function JUB.result
  * @class
  */
JUB.result = module.exports = function result(data, query, client){
 /**
   * Client the result was originally made with.
   * @type {JUB.client}
   * @property JUB.result#client
   */
 this.client = client;

 /**
   * The original query.
   * @type {string}
   * @property JUB.result#query
   */
 this.query = query;

 /**
   * raw json data result.
   * @type {object}
   * @property JUB.result#_data
   */
 this._data = data;

 /**
   * JSON-style results of the query.
   * @type {object[]}
   * @property JUB.result#data
   */
 this.data = data.data;
}

/**
 * Gets the next page of the result.
 * @param {JUB.client~requestCallback} [callback] - Callback
 * @function JUB.result#next
 * @instance
 */
var next = JUB.result.prototype.next = function next(callback){
 var params = JUB.requests.extractGetParams(this._data.next);

 //extract the parameters
 params.fields = params.fields?params.fields.split(","):undefined;
 params.limit = parseInt(params.limit) || undefined;
 params.skip = parseInt(params.skip) || undefined;

 //and send the next result.
 return this.client.query(this.query, params.fields, params.limit, params.skip, callback);
}

/**
 * Checks if this client has another result.
 * @function JUB.result#hasNext
 * @returns boolean
 * @instance
 */
var hasNext = JUB.result.prototype.hasNext = function hasNext(){
  return this._data.next !== false;
}; 

/**
 * Gets the previous page of the result.
 * @param {JUB.client~requestCallback} [callback] - Callback
 * @function JUB.result#prev
 * @instance
 */
var prev = JUB.result.prototype.prev = function prev(callback){
 var params = JUB.requests.extractGetParams(this._data.prev);

 //extract the parameters
 params.fields = params.fields?params.fields.split(","):undefined;
 params.limit = parseInt(params.limit) || undefined;
 params.skip = parseInt(params.skip) || undefined;

 //and send the prev result.
 return this.client.query(this.query, params.fields, params.limit, params.skip, callback);
};

/**
 * Checks if this client has another result.
 * @function JUB.result#hasNext
 * @returns boolean
 * @instance
 */
var hasPrev = JUB.result.prototype.hasPrev = function hasPrev(){
  return this._data.prev !== false;
};
