require('dotenv').config()

/** Express Router handling the Authendication related routes
 * @module routers/Authendication
 * @requires express
 * @requires  {@link module:controllers/Authendication}
 */

/**
 * Authendication Controller Module
 * @const
 * 
 */
const authController = require("../controllers/authController.js")
/**
 * Express Module
 * @const
 */

const express = require("express")
/**
 * Express Router
 * @const
 */
const router = express.Router();

router.use(express.json())

/**
 * Route serving register form - It creates a new user at the Database
 * 
 * @name post/register
 * @function
 * @memberof module:routers/Authendication
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 * @returns {Object}  response: The express Response Object
 * @returns {number} response.statusCode: The status code of the response 
 */
router.post("/register",authController.registerPost)

/**
 * Route serving login form
 * @name post/login
 * @function
 * @memberof module:routers/Authendication 
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 * @returns {Object}  response: The express Response Object
 * @returns {number} response.statusCode: The status code of the response 
 */
router.post("/login",authController.loginPost)

/**
 * Route serving the log out path
 * @name post/logout
 * @function
 * @memberof module:routers/Authendication 
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 * @returns {Object}  response: The express Response Object
 * @returns {number} response.statusCode: The status code of the response 
 */
router.get("/logout",authController.logoutGet)

/**
 * Route serving the refresh token
 * @name post/token
 * @function
 * @memberof module:routers/Authendication
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 * @returns {Object}  response: The express Response Object
 * @returns {number} response.statusCode: The status code of the response 
 */
router.post("/token",authController.refreshToken)


module.exports = router

