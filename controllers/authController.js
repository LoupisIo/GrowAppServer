/** Authendication Controller handling all the authendication functions.
 * @module controllers/Authentication
 * @requires {@link module:controllers/user}
 * @requires {@link module:controllers/JWT}
 * @require  {@link module:models/user}
 * @requires {@link module:models/JWT}
 * @requires {@link https://www.npmjs.com/package/dotenv|dotenv}
 * @requires {@link https://www.npmjs.com/package/jsonwebtoken|jsonwebtoken}
 */
const jwt = require('jsonwebtoken');
require('dotenv').config()

const userController = require("../Controllers/userController.js")
const jwtController = require("../Controllers/jwtController.js")
const {user} = require('../models/userModel.js');
const {jwtToken} = require('../models/jwtModel.js');

/**
 *  Handles the /login POST request.
 *  Responses with an Access Token on successs
 * @name loginPost
 * @function
 * @async
 * @memberof module:controllers/Authentication
 * @inner
 * @param {Object} req - Express Request Object
 * @param {string} req.body.username - The User's username
 * @param {string} req.body.password - The User's password
 * @param {Object} res - Express Response Object
 * @returns {Object} response  - An express Response Object
 * @returns {string} response.body.accessToken - The access Token for the user
 * @returns {string} response.body.refreshToken - The refresh Token for the user
 */
 module.exports.loginPost = async function (req,res){
  try {
    //extracting the parametres from the request Body
    //If thoses dont exist, respond with bad request
    const {username, password} = req.body || {function(){res.status(400).end();return;}}
    //Search the Database for a match
    if(isValid= await userController.verifyUser(username, password)){
      let jwtPayLoad = {
        _id:isValid._id,
        username:isValid.username
      }
      let refreshToken =  await jwtController.generateRefreshToken(jwtPayLoad)
      res.status(200).json({
        accessToken:jwtController.generateAccessToken(jwtPayLoad),
        refreshToken: refreshToken
      }).end();
    }else{
      //If the Authendication fails at any point, return a 401:Bad Request Status
      res.status(400).end();
    }
  }catch(error){
    //Catch error
    console.log(error)
    //Respond with 500:Interna; Server Error
    res.status(500).send().end();
  }
}

/**
 *  Handles the /register POST request.
 *  Send the server a new user's Data in the request body to create a new user in the data base
 * @name registerPost
 * @function
 * @async
 * @memberof module:controllers/Authentication
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
module.exports.registerPost = async function (req,res){
  try{
    //Extracting the user's data from the request Body
    const  {fName,lName,username,email,password} = req.body;
    if(await user.findOne({$or:[{username:username},{email:email}]})){
      //A user with the same user name or password allready exists in the database
      //Respond with 403 Forbidden Eror
      res.status(403).end();
      
      return;
    }
    //Create a new user document with the given data
    let newUser = new user({
      username:username,
      fName:fName,
      lName:lName,
      email:email,
      key:password
    })
    newUser = await newUser.save()
    //Else if we dont get an error or we get an result return  200:OK
    res.status(200).end();
  }catch(error){
      //Catch error
      console.log(error)
      //Respond with 500:Interna; Server Error
      res.status(500).send().end();
  }
}

/**
 * Handles the /logout GET request.
 * Logs out an user by deleting his refresh token from the Data Base
 * @name logoutGet
 * @function
 * @async
 * @memberof module:controllers/Authentication
 * @param {Object} req - Express Request Object
 * @param {string} req.body.token - The refresh Token of the user
 * @param {Object} res - Express Response Object
 * @returns {Object} response - An express Respose Object
 * @returns {number} statusCode - The status code of the operation. 200 if successfull
 */
 module.exports.logoutGet = async (req,res)=>{
  try{
      //Extraction the refresh token from the body
      const {token} = req.body || function(){res.status(400).end();return;}
      let deleted
      if(deleted = await jwtController.deleteRefreshToken(token)){
        //Else if we dont get an error or we get an result return  200:OK
        res.status(200).end()
      }else{
        res.status(400).end();
        return;
      }
  }catch(error){
    //Catch error
    console.log(error)
    //Respond with 500:Interna; Server Error
    res.status(500).send().end();
  }
}

/**
 * Handles the /token POST request.
 * Generates a new Access Token for the user 
 * @name refreshToken
 * @function
 * @memberof module:controllers/Authentication
 * @inner
 * @param {Object} req - The express Request Object
 * @param {string} req.body.refreshToken - The refresh token of the user
 * @param {Object} res - Express Response Object
 * @returns {Object} response - The express Response Object
 * @return {string} response.body.accessToken - The new access Token for the user
 */
 module.exports.refreshToken= async (req,res)=>{
  try {
      const {refreshToken} = req.body ||function(){res.status(400).json({error:"no token send"});}
      jwtPayLoad = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
      if(jwtToken.findOne({key:refreshToken,owner:jwtPayLoad._id})){
        //Generate new Access Token
        let newAccessToken = jwtController.generateAccessToken(jwtPayLoad)
        //Respond with a 200:OK status code and the new access token inside the body
        res.status(200).json({accessToken:newAccessToken}).end();
      }else{
          res.status(400).end();
      }
  } catch(error) {
       //Catch error
  if(error.message.startsWith("jwt")){
      res.status(401).json({error:'invalid jwt'})
    }else{
      console.log(error)
      //Respond with 500:Interna; Server Error
      res.status(500).send().end();
    }
  }
}

/**
 * Handles the Authorization check at any route that needs it
 * @name verifyAccessToken
 * @function
 * @async
 * @middleware
 * @memberof module:test/Authentication
 * @param {Object} req - Express Request Object
 * @param {string} req.headers.authorization - The accessToken is inside this string after the bearer keyword
 * @param {Object} res - Express Response Object
 * @param {Function} next - The next function
 * @returns {Object} response - An express Respose Object
 * @returns {number} response.statusCode - The status code of the operation. 200 if successfull
 */
 module.exports.verifyAccessToken = async function (req,res,next){
  //Extract the Access Token from the request headers
  const authHeader = req.headers['authorization']
  const token = (authHeader && authHeader.split(' ')[1]) || function(){res.status(401).end();}
  try{
    let payLoad = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    if(payLoad){
      req.jwtPayLoad =payLoad;
      next();
    }else{
      //if token isn't verified respond with  with 403: Forbidden status Status
      res.status(403).send().end();
    }
  }catch(error){
    //Catch error
    if(error.message="jwt expired"){
      res.status(401).json({error:'jwt expired'})
    }else{
      console.log(error)
      //Respond with 500:Interna; Server Error
      res.status(500).send().end();
    }
  }
}

