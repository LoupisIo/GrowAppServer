/**User controller
 * @module controllers/user
 * @requires mongoose
 * @requires bcrypt
 * @requires dotenv
 * @requires responseLogger {@link module:logger}
 * @requires requestLogger {@link module:logger}
 * @requires {@link module:models/user}
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {user} = require('../dbModel/user.js');
let {responseLogger,requestLogger} = require("../utils/logger.js");


//Create a connetion to the database
const uri = "mongodb+srv://"+process.env.DbUser+":"+process.env.DbKey+"@cluster0.ravkk.mongodb.net/Thesis?retryWrites=true&w=majority";
mongoose.connect(uri);




/**
 * Checks if the given credentials corresponds to an user. Handles the login's database query
 * @name verifyUser
 * @async
 * @function
 * @memberof module:controllers/user
 * @param {string} username - The user's username
 * @param {string} password - The user's password
 * @param {function} callback - A callback function
 */

async function verifyUser(username,password,callback) {
  //Search the database for a user with matching username
  user.findOne({username: username},async function(err,result){
    if(err){
      //On error pass null to the callback
      callback(null);
    };
    if(result){
      //On result, compare the given password with the saved hashed
      if(await bcrypt.compare(password,result.key)){
        //The password matched, pass the found user to the callback
        callback(result);
      }else{
        callback(null);
      }
    }else{
      callback(null);
    };
  }) 
};

/**
 * Adds an user to the database
 * @name addUser
 * @async
 * @function
 * @memberof module:controllers/user
 * @param {string} fName - The first name of the new user
 * @param {string} lName - The last name of the new user
 * @param {string} username - The username of the new user
 * @param {string} email - The email of the new user
 * @param {string} password - The password of the new user 
 * @param {function} callback - A callback function that handles the result
 */
async function addUser(fName,lName,username,email,password,callback){
  //Create a new user document with the given data
  let newUser = new user({
    username:username,
    fName:fName,
    lName:lName,
    email:email,
    key:password,
    sensors:[]
  })
  //Check if a user with the same username of email exists
  user.findOne({$or:[{username:username},{email:email}]},async function(err,result){
    //Pass null at the callback on error or if a user is found
    if(err){
      callback(null)
    };
    if(result){
      callback(null)
    }
  })
  //Now we know that there is not a user with the same username or email
  //So we save the user to the database
  newUser.save((error,savedUser)=>{
    //On error pass null to the cal;back
    if(error){
      callback(null)
    }
    //else the new user
    callback(savedUser)
  })
}


// REQUEST HANDLERS

/**
 * Handles the DELETE /user request
 * @name deleteUser
 * @function
 * @memberof module:controllers/user
 * 
 * @param {Object} req - Express Request Object
 * @param {string} req.body.username - The User's username
 * @param {string} req.body.password - The User's password
 * @param {Object} res - Express Response Object
 * @returns {Object} response  - An express Response Object
 * @returns {number} response.statusCode - The status of of the operation
 */

function deleteUser(req,res){
  //Log the request at the server terminal
  requestLogger(req)
  
  //Extract the user's username and password from the request body
  let {username,password}=req.body;
  user.findOne({username:username},async function (err,result){
    if(err){
      //On error send 500:Internal Server Error
      res.status(500).end();
      //Log the response
      responseLogger(res);
    }else if(!result){
      //If there is no user with the same username respond with 400:bad Request Status code
      res.status(400).end();
      //Log the response
      responseLogger(res);
    }
    //Check is the password is correct
    bcrypt.compare(password,result.key,(err,flag)=>{
      //The type of flag is Boolean. On true the passwords match
      if(flag){
        //Find and delete the user
        user.findOneAndDelete({username:username},(err,x)=>{
          if(err){
            //On error send 500:Internal Server Error
            res.status(500).end();
            //Log the response
            responseLogger(res);
          }else if(x){
            //If the user was deleted successfully, respond with 200:OK status Code
            res.status(200).end();
            //Log the 
            responseLogger(res);
          }else{
            //If for some reason the user isn't in the DB for the deletion
            //send 401:Bad request status code
            res.status(401).end();
            //Log the response at the server terminal
            responseLogger(res);
          }
        })
      }else{
        //The password was incorrect. Respond with 401:Unauthorized status code
        res.status(401).end();
        //Log the response at the server terminal
        responseLogger(res);
      }
    });
  })

}



module.exports = {verifyUser,addUser,deleteUser};