var JUB = {
  'utils': require('../utils')
};

/**
  * Creates a new OpenJUB client.
  * @class JUB.Client
  * @param {string} [server = "api.jacobs-cs.club"] - The full adress of the OpenJUB server. Has to include protocol, port and may not have a trailing slash.
  * @param {JUB.client~callback} callback - Called when the client is ready. Contains status information.
  */
JUB.Client = module.exports = function(server, callback){

  // take care of overloading.
  if(typeof server === 'function' || typeof server === 'undefined'){
    callback = server;
    server = 'api.jacobs-cs.club';
  }

  //make sure callback is a function
  callback = JUB.utils.makeFunction(callback);

  //self reference
  var me = this;

  /**
    * The server this JUB client is connected to.
    * @type {string}
    * @property JUB.Client#server
    */
  this.server = server;

  /**
    * The token used for authentication.
    * @type {string}
    * @property JUB.Client#token
    */
  this.token = JUB.utils.getCookie("JUB_token");

  /**
    * Name of the currently signed in user.
    * @type {string}
    * @property JUB.Client#user
    */
  this.user = undefined;

  /**
    * Indicates if this Client is ready.
    * @type {boolean}
    * @property JUB.Client#initialized
    */
  this.initialized = false;

  /**
    * Cache for autocompletion data.
    * @type {object}
    * @property JUB.Client#autocomplete_data
    */
  this.autocomplete_data = {
    'eid': '',
    'email': '',
    'username': '',
    'active': '',
    'firstName': '',
    'lastName': '',
    'fullName': '',
    'country': '',
    'college': '',
    'phone': '',
    'room': '',
    'isCampusPhone': '',
    'type': '',
    'isStudent': '',
    'isFaculty': '',
    'isStaff': '',
    'description': '',
    'status': '',
    'majorShort': '',
    'major': '',
    'year': ''
  };

  /**
    * Contains event handlers to call when ready.
    * @type {function[]}
    * @private
    * @property JUB.Client#_readyHandlers
    */
  this._readyHandlers = [];

  // register the callback handler.
  this.ready(callback);

  //check for the status to get a token.
  this.status(function(error, data){
    me.getAutoComplete(function(){
      for(var i=0;i<me._readyHandlers.length;i++){
        JUB.utils.setImmediate(me._readyHandlers[i]);
      }

      me.initialized = true;
    });
  });
};

/**
  * Calls a callback once this client is ready.
  * @param {function} callback - Function to call once ready.
  * @function JUB.Client#query
  * @instance
  */
JUB.Client.prototype.ready = function(callback){

  // make sure callback is a function
  callback = JUB.utils.makeFunction(callback);

  if(this.initialized){
    // if we are ready, run it now.
    JUB.utils.setImmediate(callback);
  } else {
    // else push it to the ready ones.
    this._readyHandlers.push(callback);
  }
};

/**
 * Callback for OpenJUB requests.
 * @callback JUB.client~callback
 * @param {string|undefined} error - An error message if something went wrong or undefined otherwise.
 * @param {object} data - Data sent back from OpenJUB.
 */


JUB.utils.extend(JUB.Client.prototype, require('./auth').prototype);
JUB.utils.extend(JUB.Client.prototype, require('./user').prototype);
JUB.utils.extend(JUB.Client.prototype, require('./query').prototype);
JUB.utils.extend(JUB.Client.prototype, require('./search').prototype);
JUB.utils.extend(JUB.Client.prototype, require('./autocomplete').prototype);
