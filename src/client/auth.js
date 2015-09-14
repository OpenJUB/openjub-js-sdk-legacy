var JUB = {
  'utils': require('../utils'),
  'requests': require('../requests')
};
JUB.Client = module.exports = {'prototype': {}};

/**
  * Signs in using the specefied credentials.
  * @function JUB.Client#signin
  * @instance
  * @param {string} username - Username to authenticate with.
  * @param {string} passsword - Password to authenticate with.
  * @param {JUB.client~callback} callback - Callback once signed in.
  */
var signin = JUB.Client.prototype.signin = function signin(username, password, callback){

  //reference to this and a proper function
  var me = this;
  callback = JUB.utils.makeFunction(callback);

  JUB.requests.post(JUB.requests.joinURL(this.server, '/auth/signin'), {}, {
    "username": username,
    "password": password
  }, function(code, data){
    //are we successfull.
    if(code === 200){
      //store the token.
      me.token = data.token;
      JUB.utils.setCookie("JUB_token", me.token);

      // and reload autocomplete
      me.getAutoComplete();

      callback(undefined, data);
    } else {
      //we have an error
      callback(data['error']);
    }
  });
}

/**
  * Signs out of a session.
  * @function JUB.Client#signout
  * @instance
  * @param {JUB.client~callback} callback - Callback once signed out.
  */
var signout = JUB.Client.prototype.signout = function signout(callback){

  //reference to this and a proper function
  var me = this;
  callback = JUB.utils.makeFunction(callback);

  JUB.requests.get(JUB.requests.joinURL(this.server, '/auth/signout'), {
    'token': this.token
  }, function(code, data){
    //are we successfull?
    if(code === 200){
      //clear token and user.
      me.token = undefined;
      me.user = undefined;
      JUB.utils.deleteCookie("JUB_token");

      callback(undefined, data);
    } else {
      //we have an error
      callback(data['error']);
    }
  });
}

/**
  * Gets the current status.
  * @function JUB.Client#status
  * @instance
  * @param {JUB.client~callback} callback - Status callback.
  */
var status = JUB.Client.prototype.status = function status(callback){

  //reference to this and a proper function
  var me = this;
  callback = JUB.utils.makeFunction(callback);

  JUB.requests.get(JUB.requests.joinURL(this.server, '/auth/status'), {
    'token': this.token
  }, function(code, data){
    //are we successfull?
    if(code === 200){

      if(!data.user){
        //clear token and user
        me.token = undefined;
        me.user = undefined;
        JUB.utils.deleteCookie("JUB_token");

        //and here goes the callback
        //so soon because we do not have a user.
        callback(undefined, data);

        return;
      }

      //store the token if we got it.
      if(data.token){
        me.token = data.token;
        me.user = data.user;
        JUB.utils.setCookie("JUB_token", me.token);
      }

      //and here goes the callback
      callback(undefined, data);
    } else {
      //we have an error
      callback(data['error']);
    }
  });
}

/**
  * Checks if the client is on campus.
  * @function JUB.Client#isOnCampus
  * @instance
  * @param {JUB.client~callback} callback - Status callback.
  */
var isOnCampus = JUB.Client.prototype.isOnCampus = function isOnCampus(callback){

  //reference to this and a proper function
  var me = this;
  callback = JUB.utils.makeFunction(callback);

  JUB.requests.get(JUB.requests.joinURL(this.server, '/auth/isoncampus'), {},
  function(code, data){
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
  * Opens a new window to allow for authentication of the user.
  * Not supported in node.
  * @function JUB.Client#authenticate
  * @instance
  * @param {JUB.client~callback} callback - Callback once token is ready.
  */
var authenticate = JUB.Client.prototype.authenticate = function authenticate(callback){

  if(!process.browser){ return; } // browser only

  // reference to self.
  var me = this;

  // generate a guid to use as the ID of the request.
  var id = JUB.utils.guid();

  // create a listener.
  var listener = {'name': 'message'};

  // and add an event handler to it.
  listener['handleEvent'] = function(e){
    if(e.origin !== me.server){ return; } // we only want the right server.

    // decode the data
    var data = (typeof e.data === 'string'?JSON.parse(e.data):e.data);

    // if we have a wrong id, return immediatly.
    if(typeof data.id === 'string' && data.id !== id){return; }

    // we can now remove the listener.
    window.removeEventListener('message', listener);

    // store the token.
    var token = data.token;
    me.token = token;

    // update the status.
    me.status(callback);

    // reload auto-complete
    me.getAutoComplete();
  }

  // open an event listener
  window.addEventListener('message', listener, true); // add an event listener

  var url = JUB.requests.buildGETUrl(
    JUB.requests.joinURL(this.server, '/view/login'),
    {'id': id, 'token': this.token}
  );

  // and open a window
  window.open(
    url,
    '_blank',
    'width=400, height=700, resizeable=no, toolbar=no, scrollbar=no, location=no'
  );
}
