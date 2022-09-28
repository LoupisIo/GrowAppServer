const mongoose = require('mongoose');
require('dotenv').config()
//const {users} = require('../dbModel/model.js');
//const user = model.users;
//const sensor = require('../dbModel/sensor.js');

const {user} = require('../dbModel/user.js');



const uri = "mongodb+srv://"+process.env.DbUser+":"+process.env.DbKey+"@cluster0.ravkk.mongodb.net/Thesis?retryWrites=true&w=majority";

mongoose.connect(uri)






async function verifyUser(username,password,callback) {
  console.log(username, password)

  user.findOne({username: username, key: password},(err,result)=>{
    if(err){
      throw err;
    };
    console.log("***--Inside the dbcontroller\n"+result)
    if(result){
      callback(result);
    }
    callback(null);
  })
   
}

async function getDataDefault(id,callback) {
    
}

  module.exports = {verifyUser,getDataDefault};