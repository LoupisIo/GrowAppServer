/** Json Web Tokens Controller
 * @module controllers/JWT
 * @requires {@link module:models/JWT}
 * @requires {@link https://www.npmjs.com/package/jsonwebtoken|jsonwebtoken}
 * @requires {@link https://www.npmjs.com/package/dotenv|dotenv}
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
const {jwtToken} = require('../models/jwtModel.js');

/**
 * The json web token payload
 * @typedef {Object} payLoad
 * @property {string} _id - The user's ID
 * @property {string} username - The user's username
 */

/**
 * Generates a new access JWT token with the given payload.
 * @name generateAccessToken
 * @function
 * @memberof module:controllers/JWT
 * @inner
 * @param {payLoad} payLoad - A {@link payLoad} Object
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
 * @param {payLoad} payLoad - A {@link payLoad} Object
 * @return {string} A refresh token
 */
 module.exports.generateRefreshToken = async function(payLoad){
    try{
        //Check if the user already has an Refresh Token
        if(result = await jwtToken.findOne({owner:payLoad._id})){
            return result.key;
        }else{
            //Generate the refresh token with the given payLoad
            const refreshToken = jwt.sign(payLoad,process.env.REFRESH_TOKEN_SECRET)
            //create a new mongoose jtwToken document
            let newToken = new jwtToken({
                key:refreshToken,
                owner:payLoad._id
            })
            //Save it at the database and return it
            newToken = await newToken.save()
            return await newToken.key;
        }
    }catch(error){
        //On error throw it
        throw new Error(error);
    }
}
/**
 * Deletes the given token from the database if it exists
 * @name deleteRefreshToken
 * @function
 * @async
 * @memberof module:controllers/JWT
 * @param {string} token - the refresh token to be deleted
 * @return {jwtToken}
 */
module.exports.deleteRefreshToken = async function (token){
    try{
        //Find and delete the token form the Database
        if(result = await jwtToken.findOneAndDelete({key : token})){
            return result
        }else{
            return null
        }
    }  
    catch (error){
        console.log(error)
        return null
    }
}