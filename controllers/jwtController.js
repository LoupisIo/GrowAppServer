/** Json Web Tokens Controller
 * @module controllers/JWT
 * @requires jsonwebtoken
 * @requires models/JWT
 * @requires dotenv
 * 
 */

require('dotenv').config()

/**
 * json web token Module
 * @const
 */
const jwt = require('jsonwebtoken');

/**
 * jwt mongoose Model
 * @const
 */
const {jwtToken} = require('../dbModel/jwtModel.js');

/**
 * Generates a new access JWT token with the given payload.
 * @name generateAccessToken
 * @function
 * @memberof module:controllers/JWT
 * @inner
 * @param {object} payLaod
 * @return {string} accessToken - The generated JWT access Token
 */
module.exports.generateAccessToken =  function(payLoad){
    
    //Generate Access Token with the given payLoad
    const accessToken = jwt.sign(payLoad,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'10m'})
    //return the Access Token
    return accessToken

}
/**
 * Generates a new Refresh Token, saves it at the Database and passes it to the callback
 * @name generateRefressToken
 * @function
 * @memberof module:controllers/JWT
 * @param {Object} payLaod
 * @param {string} payLoad._id - The user's unique ID 
 * @param {function} callback - A callback Function
 * 
 */
module.exports.generateRefressToken = function(payLoad,callback){
    jwtToken.findOne({owner:payLoad._id},(err,result)=>{
        if(result){
            callback(result.key)
            return;
        }
        //Generate the refresh token with the given payLoad
        const refreshToken = jwt.sign(payLoad,process.env.REFRESH_TOKEN_SECRET)
        //create a new mongoose jtwToken document
        let newToken = new jwtToken({
            key:refreshToken,
            owner:payLoad._id
        })
        //Save it at the database
        newToken.save((error,savedToken)=>{
            if(error){
                console.log(error)
            }
            //Pass the refreshToken at the callback function
            callback(savedToken.key)
        })
    })
}

/**
 * Searches the Database for the given Refresh Token. If found it passes it to the callback
 * @name findRefreshToken
 * @function
 * @inner
 * @memberof module:controllers/JWT
 * @param {string} token - a JWT refresh Token
 * @param {function} callback - The callback function
 */
module.exports.findRefreshToken = (token,callback)=>{
    //Search the Data base for the token
    jwtToken.findOne({key:token},(err,result)=>{
        if(err){
            //if there is any error, pass null to the callback
            callback(null)
        };
        //else pass the found jwt document- If it find none => result = null
        callback(result)
    })
}

/**
 * Accepts a refresh token and verifies it
 * @name verifyRefreshToken
 * @function
 * @inner
 * @memberof module:controllers/JWT
 * @param {string} token - A JWT refresh token
 * @param {function} callback - A callback function
 */
module.exports.verifyRefreshToken = function(token,callback){
    //Verify the given token
    jwt.verify(token,process.env.REFRESH_TOKEN_SECRET,(error,user)=>{
        if(error){
            //On error callback null
            callback(null)
        }
        //else callback the decoded payLoad
        callback(user)
    })
}

/**
 * Accepts a access token and verifies it
 * @name verifyAccessToken
 * @function
 * @inner
 * @memberof module:controllers/JWT
 * @param {string} token - A JWT access token
 * @param {function} callback - A callback function
 */
module.exports.verifyAccessToken = function(token,callback){
    //Verify the given token
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(error,jwtPayLoad)=>{
        if(error){callback(error,null)}
        callback(null,jwtPayLoad)
    })
}

/**
 * Deletes the given token from the database if it exists
 * @name deleteRefreshToken
 * @function
 * @inner
 * @memberof module:controllers/JWT
 * @param {string} token - the refresh token to be deleted
 * @param {Function} callback - A callback function
 */
module.exports.deleteRefreshToken = async function (token,callback){
    //Find and delete the token form the Database
    jwtToken.findOneAndDelete({key : token},(err,result)=>{
        if(err){
            callback(err,null)
        }
        callback(null,result)
    })
}