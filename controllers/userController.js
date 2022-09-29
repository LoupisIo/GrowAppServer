/**User controller
 * @module controllers/user
 * @requires {@link https://www.npmjs.com/package/mongoose|mongoose}
 * @requires {@link https://www.npmjs.com/package/bcrypt|bcrypt}
 * @requires {@link https://www.npmjs.com/package/dotenv|dotenv}
 * @requires {@link module:models/user}
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {user} = require('../dbModel/user.js');

/**
 * Checks if the given credentials corresponds to an user. Handles the login's database query
 * @name verifyUser
 * @async
 * @function
 * @memberof module:controllers/user
 * @param {string} username - The user's username
 * @param {string} password - The user's password
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
          sensors:result.sensors
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
 * @async
 * @memberof module:controllers/user
 * @param {Object} req - Express Request Object
 * @param {string} req.body.username - The User's username
 * @param {string} req.body.password - The User's password
 * @param {Object} res - Express Response Object
 * @returns {Object} response  - An express Response Object
 * @returns {number} response.statusCode - The status of of the operation
 */

 async function deleteUser(req,res){
  
  try{
      //If thoses dont exist, respond with bad request
  const {username, password} = req.body || {function(){res.status(400).end();return;}}
  if(isValid = await verifyUser(username, password)){
      user.findOneAndDelete({username:username}).then(()=>{
          //If the user was deleted successfully, respond with 200:OK status Code
          res.status(200).end();
      }).catch(error=>{
          //Catch error
          console.log(error)
          //Respond with 500:Interna; Server Error
          res.status(500).send().end();
      })
  }else{
      //If there is no user with the same username respond with 400:bad Request Status code
      res.status(400).end();
  } 
  }catch (error){
      //Catch error
      console.log(error)
      //Respond with 500:Interna; Server Error
      res.status(500).send().end();
  }

}
/**
 * Handles the UPDATE /user/mail request
 * @name updateUserMail
 * @function
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
    if(result.modifiedCount){
      res.status(202).end()
      ;
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
      ;
    }
    if(result.modifiedCount){
      res.status(202).end()
      ;
    }
    res.status(400).end()
    ;
  })
  
}

module.exports = {verifyUser,deleteUser,updateUserMail,updateUserPassWord};