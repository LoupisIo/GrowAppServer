
//Import npm node modules
require('dotenv').config()
const express = require('express');
const session = require("express-session");
var bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Import custom modules
const router = require("./router/router.js")
const authRoutes = require("./router/authRoutes.js");
const dataRoutes = require("./router/dataRoutes.js");
const userRoutes = require("./router/userRoutes.js");
const {verifyAccessToken} = require("./controllers/authController.js");

//Create the server
const server = express();

server.use(express.json())
server.use(bodyParser.urlencoded({ extended: true }))

//Add constants in .env
const  {
  NODE_ENV = 'development',
  TWO_HOURS = 1000 * 60 * 60 * 2,
  SESS_LIFETIME = TWO_HOURS
  
} = process.env

//Set enviroment
const IN_PROD = NODE_ENV === 'production'

//User and init sessions
server.use(session({
  name: process.env.SESS_NAME,
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESS_SECRET,
  cookie: {
    maxAge: SESS_LIFETIME,
    secure: IN_PROD,
  }
}))

//Mount the rouer to the app
server.use('/',authRoutes);
server.use('/',dataRoutes);
server.use('/',userRoutes);

//Server Start
server.listen(process.env.PORT,()=>{
  console.log('Server is up');
  console.log(
`
                      ██████                              
                    ██▒▒▒▒████                            
              ████  ██▒▒██▒▒██         Grow App Server                    
            ██░░░░██▒▒██▒▒▒▒██                            
          ██░░██░░░░██▒▒████                              
        ██░░░░░░██░░░░██                                  
      ██░░░░░░░░░░░░░░░░██                                
    ██░░░░░░░░░░░░░░░░░░██                                
    ██░░░░██░░░░░░░░░░██                                  
  ██░░░░░░░░██░░░░░░██                                    
  ██░░░░██░░░░██░░██                                      
██░░░░░░░░██░░████                                        
██░░░░░░░░████                                            
  ████████ 
`
    )
})


