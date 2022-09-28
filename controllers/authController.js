/** Authendication Controller handling all the authendication functions.
 * @module controllers/Authendication
 * @requires {@link module:controllers/DataBase}
 * @requires {@link module:controllers/User}
 * @requires {@link module:controllers/JWT}
 * @requires responseLogger {@link module:logger}
 * @requires requestLogger {@link module:logger}
 */

const userController = require("../Controllers/userController.js")
const jwtController = require("../Controllers/jwtController.js")
let {responseLogger,requestLogger} = require("../utils/logger.js")

/**
 *  Handles the /login POST request.
 *  Responses with an Access Token on successs
 * @name loginPost
 * @function
 * @memberof module:controllers/Authendication
 * @inner
 * @param {Object} req - Express Request Object
 * @param {string} req.body.username - The User's username
 * @param {string} req.body.password - The User's password
 * @param {Object} res - Express Response Object
 * @returns {Object} response  - An express Response Object
 * @returns {string} response.body.accessToken - The access Token for the user
 * @returns {string} response.body.refreshToken - The refresh Token for the user
 */
module.exports.loginPost = (req,res)=>{
  //Loggin the request at the server terminal
    requestLogger(req);
    //extracting the parametres from the request Body
    const { username, password } = req.body;
    //Search the Database for a match
    userController.verifyUser(username,password,(result)=>{
      if (result){
        //If the user is found in the dataBase, create the JWT tokens and send them
        let jwtPayLoad = {
          _id:result._id,
          username:result.username
        }
        let accessToken= jwtController.generateAccessToken(jwtPayLoad);
        jwtController.generateRefressToken(jwtPayLoad,(refreshToken)=>{
          res.json({
            accessToken:accessToken,
            refreshToken:refreshToken 
         })
         //Logging the response at the server terminal
         responseLogger(res)
        })
      }else{
        //If the Authendication fails at any point, return a 401:Bad Request Status
        res.status(400).end()
        //Logging the response at the server terminal
        responseLogger(res)
      }
    })
  }
/**
 *  Handles the /register POST request.
 *  Send the server a new user's Data in the request body to create a new user in the data base
 * @name registerPost
 * @function
 * @memberof module:controllers/Authendication
 * @inner
 * @param {Object} req - The http request Object
 * @param {string} req.body.fName - The first name of the new user
 * @param {string} req.body.lName - The last name of the new user
 * @param {string} req.body.username - The username of the new user
 * @param {string} req.body.email - The email of the new user
 * @param {string} req.body.password - The password of the new user 
 * @param {Object} res - Express Response Object
 * @returns {Object} response  - An express Response Object
 * @returns {number} response.statusCode - The status of of the operation
 * 
 */
module.exports.registerPost = (req,res)=>{
  //Loggin the request at the server terminal
  requestLogger(req);
  //Extracting the user's data from the request Body
    const  {fName,lName,username,email,password} = req.body;
    //Try to add the user in the Data Base
    userController.addUser(fName,lName,username,email,password,(savedUser)=>{
      if(savedUser){
        //If the operation was succssefull return a 200 status code
        res.status(200).end();
      }else{
        //If the operation fails return a 400:Bad reuest status code
        res.status(400)
      }
    })
    //Logging the response at the server terminal
    responseLogger(res);    
}

/**
 * Handles the /logout GET request.
 * Logs out an user by deleting his refresh token from the Data Base
 * @name logoutGet
 * @function
 * @memberof module:controllers/Authendication
 * @param {Object} req - Express Request Object
 * @param {string} req.body.token - The refresh Token of the user
 * @param {Object} res - Express Response Object
 * @returns {Object} response - An express Respose Object
 * @returns {number} statusCode - The status code of the operation. 200 if successfull
 */
module.exports.logoutGet = (req,res)=>{
  //Loggin the request at the server terminal
  requestLogger(req)
  //Extraction the refresh token from the body
  const {token} = req.body;
  //Deleting the refresh Token from the server
  jwtController.deleteRefreshToken(token,(error,result)=>{
    //If we get an error or no token was deleted, return 400:Bad Request 
    if(error || !result){
      res.status(400).end()
      //Logging the response at the server terminal
      responseLogger(res)
    }else if(!error && result){
      //Else if we dont get an error or we get an result return  200:OK
      res.status(200).end()
      //Logging the response at the server terminal
      responseLogger(res)
    }
  })
}

/**
 * Handles the /token POST request.
 * Generates a new Access Token for the user 
 * @name refreshToken
 * @function
 * @memberof module:controllers/Authendication
 * @inner
 * @param {Object} req - The express Request Object
 * @param {string} req.body.refreshToken - The refresh token of the user
 * @param {Object} res - Express Response Object
 * @returns {Object} response - The express Response Object
 * @return {string} response.body.accessToken - The new access Token for the user
 */
module.exports.refreshToken=(req,res)=>{
  //Loggin the request at the server terminal
  requestLogger(req)
  //Extraction the refresh token form he request Body
  const {refreshToken} = req.body;
  if(refreshToken==null){
    //If there is no token, return status code 400:Bad Request
    res.status(400).send({error:"no token send"}).end()
    //Log the response
    responseLogger(res)
  }
  //If there is a token at the request, search the database for it
  jwtController.findRefreshToken(refreshToken,(result)=>{
    //If the findRefreshToken, returns a result, it means the Refresh Token was found
    if(result){
      //Verify the recieved RefreshToken token
      jwtController.verifyRefreshToken(refreshToken,(result)=>{
        //If the verification iss successfull, create a new JWT payLaod, generate a new Access Token
        //And send it back.
        if(result){
          let jwtPayLoad={
            _id:result._id,
            username:result.username,
          }
          //Generate new Access Token
          let newAccessToken = jwtController.generateAccessToken(jwtPayLoad)
          //Respond with a 200:OK status code and the new access token inside the body
          res.status(200).json({accessToken:newAccessToken}).end()
          //Log the response
          responseLogger(res)
        }else{
          //result = null. Therefore the verification process failed.
          //respond with a 401:Unauthorized status code
          res.status(401).end()
          responseLogger(res)
        }
      })

    }else{
      //We didnt find the refreshToken in the Data Base
      //Responds with a 400:Bad Request Status Code
      res.status(400).send({error:"Invalid Token"}).end()
      //Log the response
      responseLogger(res)
    }
  })
}

/**
 * Handles the Authorization check at any route that needs it
 * @name verifyAccessToken
 * @function
 * @middleware
 * @memberof module:controllers/Authendication
 * @inner
 * @param {Object} req - Express Request Object
 * @param {string} req.headers.authorization - The accessToken is inside this string after the bearer keyword
 * @param {Object} res - Express Response Object
 * @param {Function} next - The next function
 * @returns {Object} response - An express Respose Object
 * @returns {number} response.statusCode - The status code of the operation. 200 if successfull
 */
module.exports.verifyAccessToken=(req,res,next)=>{
  //Log the request at the server terminal
  //requestLogger(req)
  //Extract the Access Token from the request headers
  const authHeader = req.headers['authorization']
  const token =authHeader && authHeader.split(' ')[1]
  if(token == null){
    //If there is no token respond with 401:Unauthorized
    res.status(401).end()
    //log the response at the server terminal
    responseLogger(res)
    return;
  }
  //Verrify the Access Token
  jwtController.verifyAccessToken(token,(error,user)=>{
    if(error){
      //if there is an error respond with 403:Forbidden status
      res.status(403).send().end();
      //log The response at the server terminal
      responseLogger(res)
      return;
    }else if(res.statusCode == 200){
      //else, if no change was make to the status code, call the next function
      next()
    }
  })
}