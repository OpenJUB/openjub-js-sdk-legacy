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

  //if we are node, exit
  if(!process.browser){
    return;
  }

  //have a reference to me
  var me = this;


  var _handleMessage = function(e){
    //return unless it is the right message
    if(e.origin !== me.server){
      return;
    }

    //remove the event handler.
    window.removeEventListener(_handleMessage);

    //read the data correctly
    var token = (typeof e.data === 'string'?JSON.parse(e.data):e.data).token;

    //store the token
    me.token = token;

    //and call the status
    me.status(callback);

    // and reaload autocomplete
    me.getAutoComplete();
  }



  //listen to events.
  window.addEventListener('message', _handleMessage);

  //open the window for authentication.
  window.open(
    JUB.requests.joinURL(this.server, '/view/login'),
    '_blank',
    'width=500, height=400, resizeable=no, toolbar=no, scrollbar=no, location=no'
  );
}
