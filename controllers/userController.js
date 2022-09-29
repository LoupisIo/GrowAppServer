/**User controller
 * @module controllers/user
 * @requires {@link https://www.npmjs.com/package/mongoose|mongoose}
 * @requires {@link https://www.npmjs.com/package/bcrypt|bcrypt}
 * @requires {@link https://www.npmjs.com/package/dotenv|dotenv}
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
//mongoose.connect(uri);


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

 async function verifyUser(username,password){

  //Search the database for a user with matching username
  try{
    var result;
    if(result = await user.findOne({username: username})){
      let verfication = await bcrypt.compare(password,result.key)
      if(verfication){
        return {
          _id:result._id,
          username:result.username,
          sensors:result.sensors,
        }
      }
    }else{
      return null;
    }
  }catch(error){
    throw new Error(error);
  }
};

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
/**
 * Handles the UPDATE /user/mail request
 * @name updateUserMail
 * @function
 * @async
 * @memberof module:controllers/user
 * @param {Object} req - Express Request Object
 * @param {string} req.body._id - The _id of the user to be upated
 * @param {string} res.body.email
 * @param {Object} res.jwtPayLoad - The decoded jwt 
 * @param {string} res.jwtPayLoad._id - User's ID
 * @param {string} res.username - User's username
 * @returns {Object} response  - An express Response Object
 * @returns {number} response.statusCode - The status of of the operation
 */

function updateUserMail(req,res){
  let {id,email} = req.body;
  if(id!=req.jwtPayLoad._id){
    res.status(401).end()
  }
  user.updateOne({_id:id},{email:email},(err,result)=>{
    console.log(result)
    if(result.modifiedCount){
      res.status(202).end()
      responseLogger(res);
    }
    res.status(400).end()
  })
  
}

/**
 * Handles the POST /user/password request
 * @name updateUserPassWord
 * @function
 * @async
 * @memberof module:controllers/user
 * @param {Object} req - Express Request Object
 * @param {string} req.body._id - The _id of the user to be upated
 * @param {string} res.body.password
 * @param {Object} res.jwtPayLoad - The decoded jwt 
 * @param {string} res.jwtPayLoad._id - User's ID
 * @param {string} res.username - User's username
 * @returns {Object} response  - An express Response Object
 * @returns {number} response.statusCode - The status of of the operation
 */

 async function updateUserPassWord(req,res){
  let {id,password} = req.body;
  if(id!=req.jwtPayLoad._id){
    res.status(401).end()
  }
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password,salt)
  
  user.updateOne({_id:id},{key:hashedPassword},(err,result)=>{
    if(err){
      res.status(500).end()
      responseLogger(res);
    }
    if(result.modifiedCount){
      res.status(202).end()
      responseLogger(res);
    }
    res.status(400).end()
    responseLogger(res);
  })
  
}





module.exports = {verifyUser,deleteUser,updateUserMail,updateUserPassWord};