var JUB = {
  'utils': require('../utils'),
  'result': require('../result'),
  'requests': require('../requests')
};
JUB.Client = module.exports = {'prototype': {}};

/**
  * Looks up users using a search
  * @param {string[]} fields - Fields to return.
  * @param {number} [limit] - Limit of results to send.
  * @param {number} [skip] - Skip of results to send.
  * @param {JUB.client~requestCallback} [callback] - Callback
  * @function JUB.Client#search
  * @instance
  */
var search = JUB.Client.prototype.search = function search(search, fields, limit, skip, callback){

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

  JUB.requests.get(JUB.requests.joinURL(this.server, 'search/'+search), {
    'fields': fields,
    'limit': limit,
    'skip': skip,
    'token': this.token
  },
  function(code, data){
    //are we successfull?
    if(code === 200){
      //Make a new search result.
      callback(undefined, new JUB.result(data, search, me));
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
 * @param {JUB.result} result - search result sent back from OpenJUB.
 */
