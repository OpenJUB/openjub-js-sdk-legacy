var JUB = {
  'utils': require('../utils'),
  'requests': require('../requests')
};
JUB.Client = module.exports = {'prototype': {}};

/**
  * Gets info about the current user.
  * @param {string[]} fields - Fields to return.
  * @function JUB.Client#getMe
  * @instance
  * @param {JUB.client~callback} [callback] - Callback
  */
var getMe = JUB.Client.prototype.getMe = function getMe(fields, callback){

  //reference to this and a proper function
  var me = this;
  callback = JUB.utils.makeFunction(callback);

  //if we do not have fields, reset them.
  if(fields && fields.length == 0){
    fields = undefined;
  }

  //and make the request
  JUB.requests.get(JUB.requests.joinURL(this.server, '/user/me'), {
    'token': this.token,
    'fields': fields,
  }, function(code, data){
    //are we successfull?
    if(code === 200){
      callback(undefined, data);
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
  * Checks if the current user is a goat.
  * @function JUB.Client#amIAGoat
  * @instance
  * @param {JUB.client~callback} [callback] - Callback
  */
var amIAGoat = JUB.Client.prototype.amIAGoat = function amIAGoat(callback){

  var me = this;
  callback = JUB.utils.makeFunction(callback);

  JUB.requests.get(JUB.requests.joinURL(this.server, '/user/me/isagoat'), {},
  function(code, data){
    //are we successfull?
    if(code === 200){
      callback(undefined, data);
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
  * Gets a user by id.
  * @param {string} id - Id of user to find.
  * @param {string[]} fields - Fields to return.
  * @function JUB.Client#getUserById
  * @instance
  * @param {JUB.client~callback} [callback] - Callback
  */
var getUserById = JUB.Client.prototype.getUserById = function getUserById(id, fields, callback){

  var me = this;

  //if we do not have fields, reset them.
  if(fields && fields.length == 0){
    fields = undefined;
  }

  //and make the request
  JUB.requests.get(JUB.requests.joinURL(this.server, '/user/id/'+id), {
    'token': this.token,
    'fields': fields,
  }, function(code, data){
    //are we successfull?
    if(code === 200){
      callback(undefined, data);
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
  * Gets a user by name.
  * @param {string} username - Username of user to find.
  * @param {string[]} fields - Fields to return.
  * @function JUB.Client#getUserByName
  * @instance
  * @param {JUB.client~callback} [callback] - Callback
  */
var getUserByName = JUB.Client.prototype.getUserByName = function getUserByName(username, fields, callback){

  var me = this;

  //if we do not have fields, reset them.
  if(fields && fields.length == 0){
    fields = undefined;
  }

  //and make the request
  JUB.requests.get(JUB.requests.joinURL(this.server, '/user/name/'+username), {
    'token': this.token,
    'fields': fields,
  }, function(code, data){
    //are we successfull?
    if(code === 200){
      callback(undefined, data);
    } else {
      //check the status if we had an error.
      me.status(function(){
        //we have an error
        callback(data['error']);
      });
    }
  });
}
