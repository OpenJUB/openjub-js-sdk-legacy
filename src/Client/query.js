var JUB = {
  'utils': require('../utils'),
  'requests': require('../requests'),
  'result': require('../result')
};
JUB.Client = module.exports = {'prototype': {}};

/**
  * Looks up users using a machine-readable query.
  * @param {string[]} fields - Fields to return.
  * @param {number} [limit] - Limit of results to send.
  * @param {number} [skip] - Skip of results to send.
  * @param {JUB.client~requestCallback} [callback] - Callback
  * @function JUB.Client#query
  * @instance
  */
var query = JUB.Client.prototype.query = function query(query, fields, limit, skip, callback){

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

  JUB.requests.get(JUB.requests.joinURL(this.server, 'query/'+query), {
    'fields': fields,
    'limit': limit,
    'skip': skip,
    'token': this.token
  },
  function(code, data){
    //are we successfull?
    if(code === 200){
      //Make a new query result.
      callback(undefined, new JUB.result(data, query, me));
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
 * @param {JUB.queryResult} result - Query result sent back from OpenJUB.
 */
