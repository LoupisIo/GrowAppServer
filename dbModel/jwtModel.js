/** JWT Data Base model
 * @module models/JWT
 * @requires mongoose
 */

//Importing mongoose
const mongoose = require('mongoose');

//Creating the JWT schema
const jwtSchema = mongoose.Schema({
    key:{type:String,required:true},
    owner:{type:String,required:true}
},
{collection:"jwtTokens"}
)

/** 
 * A JWT document
 * @typedef {Object} jwtToken
 * @property {string} key - the Token Value
 * @property {string} owner = The owner's _id
*/
const jwtToken = mongoose.model("jwtModel",jwtSchema)

module.exports = {jwtToken}