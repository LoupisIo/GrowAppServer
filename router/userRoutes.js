const express = require("express")
/** Express Router handling the Authendication related routes
 * @module routers/User
 * @requires {@link https://www.npmjs.com/package/express|Express}
 * @requires  {@link module:controllers/Authentication}
 * @requires  {@link module:controllers/user}
 */

/**
 * Authendication Controller Module
 * @const
 */
const authController = require("../Controllers/authController");
/**
 * user Controller Module
 * @const
 * 
 */
const userController = require("../Controllers/userController.js");

/**
 * Express Router
 * @const
 */
const router = express.Router();
router.use(express.json())


/**
 * Route serving a user delete request
 * 
 * @name delete/user
 * @function
 * @memberof module:routers/user
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 * @returns {Object}  response: The express Response Object
 * @returns {number} response.statusCode: The status code of the response 
 */
router.delete("/user",userController.deleteUser)
/**
 * Route serving a user delete request
 * 
 * @name patch/user/mail
 * @function
 * @memberof module:routers/user
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 * @returns {Object}  response: The express Response Object
 * @returns {number} response.statusCode: The status code of the response 
 */
router.patch("/user/mail",authController.verifyAccessToken,userController.updateUserMail)
/**
 * Route serving a user delete request
 * 
 * @name patch/user/password
 * @function
 * @memberof module:routers/user
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 * @returns {Object}  response: The express Response Object
 * @returns {number} response.statusCode: The status code of the response 
 */
router.patch("/user/password",authController.verifyAccessToken,userController.updateUserPassWord)





module.exports = router;