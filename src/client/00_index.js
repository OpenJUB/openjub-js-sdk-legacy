/**
  * Creates a new OpenJUB client.
  * @class JUB.Client
  * @param {string} server - The full adress of the OpenJUB server. Has to include protocol, port and may not have a trailing slash.
  * @param {JUB.client~callback} callback - Called when the client is ready. Contains status information.
  */
JUB.Client = function(server, callback){

  //make sure callback is a function
  callback = JUB.utils.makeFunction(callback);

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

  //check for the status to get a token.
  this.status(function(error, data){
    callback();
  });
}

/**
 * Callback for OpenJUB requests.
 * @callback JUB.client~callback
 * @param {string|undefined} error - An error message if something went wrong or undefined otherwise.
 * @param {object} data - Data sent back from OpenJUB.
 */


//Test function. TODO: Remove me.

JUB.test = function(error, data){console.log("error", error, "data", data); }
