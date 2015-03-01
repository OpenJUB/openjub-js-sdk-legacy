/**
  * Gets info about the current user.
  * @param {string[]} fields - Fields to return.
  * @function JUB.Client#getMe
  * @instance
  * @param {JUB.client~callback} callback - Callback
  */
JUB.Client.prototype.getMe = function(id, fields, callback){

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
      //we have an error
      callback(data['error']);
    }
  });
}


/**
  * Gets a user by id.
  * @param {string} id - Id of user to find.
  * @param {string[]} fields - Fields to return.
  * @function JUB.Client#getUserById
  * @instance
  * @param {JUB.client~callback} callback - Callback
  */
JUB.Client.prototype.getUserById = function(id, fields, callback){

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
      //we have an error
      callback(data['error']);
    }
  });
}

/**
  * Gets a user by name.
  * @param {string} username - Username of user to find.
  * @param {string[]} fields - Fields to return.
  * @function JUB.Client#getUserByName
  * @instance
  * @param {JUB.client~callback} callback - Callback
  */
JUB.Client.prototype.getUserByName = function(username, fields, callback){

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
      //we have an error
      callback(data['error']);
    }
  });
}
