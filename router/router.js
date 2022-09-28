const express = require('express');
const session = require('express-session');
const router = express.Router();
const dbControler= require("../dbControler/dbControler.js")

/**
*varrTest test2
*@type {string} 
*/

const tessstvar = "helloWorld"



router.use(express.json())
// router.use(session({
//   name: 'sid',
//   resave: false,
//   saveUninitialized: true,
//   secret: 'randomstring',
//   cookie: {
//     path:'/',
//     maxAge: 60000,
    
//     secure: true,
// }
// }))


//TESTING GROUNDS
router.get('/',(req,res)=>{
    hum = Math.floor(Math.random() * 1001);

    res.send('ok'); 
})
router.get('/end',(req,res)=>{
    console.log('Ooh!')
    res.send('BOOM-you lost')
})

// ACTUAL THING
// POST REQUEST HANDLERS


// Login Post Request Handler
router.post('/login',(req,res)=>{
  let { username, password } = req.body;
  // Do the DB querries here
  //Or call a DB handler or something
  dbControler.verifyUser(username,password,(result)=>{
    //Call Back Hell Begins
    if (result){
      console.log(result._id)
      req.session.user = result
      res.send(result)
      //That means the dbControler did find a username-password match
      //Now we will ask the db for the user's data
      

    }else{
      res.end(null)
    }
  
  })

  
})




//GET REQUEST HANDLERS
router.get('/userData',(req,res)=>{
  //If the user is Auth then search the DB for his data
  console.log('I got the GET request')
  console.log(req.session)
  if (req.session.user){
    console.log('User is authendicated')
    console.log('Calling Db controler')
    dbControler.getDataDefault(req.session.user._id,(data)=>{
      console.log(data)
      res.send(data)

    })

  }

})







module.exports = router;