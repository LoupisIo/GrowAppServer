/** User Data base model
 * @module models/user
 * @requires {@link https://www.npmjs.com/package/mongoose|mongoose}
 * @requires bcrypt
 * 
 */

//Import the node modules we will use
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Creating the user's schema
const userSchema = new mongoose.Schema({
    username: {type:String , required: true},
    fName: {type:String , required: true},
    lName:{type:String , required: true},
    email:{type:String , required: true},
    key:{type:String,required: true},
    devices:[String],
},
    {collection : "Users"}
)

/**
 * Pre user save function. It hashes the user's password before saving
 * @name presave
 * @function
 * @inner
 * @param {function} next
 */
userSchema.pre('save',async function (next){
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.key,salt)
        this.key = hashedPassword
        next()
    }catch(error){
        next(error);
    }
})

/**
 * The user model
 * @typedef {object} user
 * @property {string} username - The user's username
 * @property {string} fName - First name
 * @property {string} lName - Last name
 * @property {string} email - Email
 * @property {string} key - user's hashed passwrord
 * @property {Array.<string>} devices - a list of the user's devices
 */
const user = mongoose.model('userModel',userSchema);

module.exports = {user}