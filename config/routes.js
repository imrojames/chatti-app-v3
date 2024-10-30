/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  // Pages
  "/": {
    controller: "PagesController",
    action: "index",
    policy: "isAuthenticated",
  },
  "/login": {
    controller: "PagesController",
    action: "loginPage",
    policy: "isNotAuthenticated",
  },
  "/register": {
    controller: "PagesController",
    action: "registerPage",
    policy: "isNotAuthenticated",
  },
  "GET /:recieverName/:recieverID": {
    controller: "PagesController",
    action: "chatPage",
    policy: "isAuthenticated",
  },

  // API
  "POST /api/user/register": {
    controller: "UserController",
    action: "register",
  },
  "POST /api/user/login": {
    controller: "UserController",
    action: "login",
  },
  "GET /api/user/active": {
    controller: "UserController",
    action: "getActiveUsers",
  },
  "GET /api/user/join": {
    controller: "UserController",
    action: "join",
  },
  "POST /api/user/logout": {
    controller: "UserController",
    action: "logout",
  },
  "PATCH /api/user/updateIsActive/:id": {
    controller: "UserController",
    action: "updateIsActive",
  },
  // Chat API
  "POST /api/chat/sendMessage": {
    controller: "MessageController",
    action: "sendMessage",
  },
  "GET /api/chat/startChat/:userId2": {
    controller: "MessageController",
    action: "startChat",
  },

  "GET /api/chat/messages/:test": {
    controller: "MessageController",
    action: "getAllMessages",
  },

  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/
};
