
/**
  * Namespace for all OpenJUB related functions.
  * @namespace JUB
  */

/**
  * Creates a new OpenJUB client.
  * @class JUB.Client
  * @param {string} server - The full adress of the OpenJUB server.
  */
JUB.Client = function(server){

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
  this.token = undefined;
}

/**
 * Callback for OpenJUB requests.
 * @callback JUB.client~callback
 * @param {string|undefined} error - An error message if something went wrong or undefined otherwise.
 * @param {object} data - Data sent back from OpenJUB.
 */


//Test function. TODO: Remove me.

JUB.test = function(error, data){console.log("error", error, "data", data); }
