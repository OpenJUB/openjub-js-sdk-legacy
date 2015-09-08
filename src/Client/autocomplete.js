var JUB = {
  'utils': require('../utils'),
  'requests': require('../requests'),
  'Parser': require('../parser'), 
};
JUB.Client = module.exports = {'prototype': {}};

/**
  * Gets auto completion information from the server.
  * @function JUB.Client#getAutoComplete
  * @instance
  * @param {JUB.client~callback} [callback] - Callback
  */
var getAutoComplete = JUB.Client.prototype.getAutoComplete = function getAutoComplete(callback){

  //reference to this and a proper function
  var me = this;
  callback = JUB.utils.makeFunction(callback);

  //and make the request
  JUB.requests.get(JUB.requests.joinURL(this.server, '/autocomplete'), {
    'token': this.token
  }, function(code, data){
    //are we successfull?
    if(code === 200){
      me.autocomplete_data = data;
      callback(undefined, data);
    } else {

      //check the status if we had an error.
      me.status(function(){
        //we have an error
        callback(data['error']);
      });
    }
  });
};

/**
  * Autocompletes a query.
  * @param {string} str - String to autocomplete.
  * @param {number} maxCompletions - Maximum number of completions to return.
  * @return {JUB.Parser~completions}
  * @function JUB.Client#complete
  * @instance
  */
var complete = JUB.Client.prototype.complete = function complete(str, maxCompletions){
  return JUB.Parser.complete(str, this.autocomplete_data, maxCompletions);
};
