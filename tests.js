const userController = require("./Controllers/userController.js")
const jwtController = require("./Controllers/jwtController.js")
let {responseLogger,requestLogger} = require("./utils/logger.js")


const {jwtToken} = require('./dbModel/jwtModel.js');
const {user} = require('./dbModel/user.js');
const mongoose = require('mongoose');
const { refreshToken } = require("./controllers/authController.js");
const uri = "mongodb+srv://"+process.env.DbUser+":"+process.env.DbKey+"@cluster0.ravkk.mongodb.net/Thesis?retryWrites=true&w=majority";
mongoose.connect(uri);



module.exports.registerPost2 = async function (req,res){
    try{
        //Loggin the request at the server terminal
        requestLogger(req);
        //Extracting the user's data from the request Body
        const  {fName,lName,username,email,password} = req.body;
        if(await user.findOne({$or:[{username:username},{email:email}]})){
            //A user with the same user name or password allready exists in the database
            //Respond with 403 Forbidden Eror
            res.status(403).end();
            responseLogger(res)
        }
        //Create a new user document with the given data
        let newUser = new user({
            username:username,
            fName:fName,
            lName:lName,
            email:email,
            key:password,
            sensors:[]
          })
        newUser = await newUser.save()
        //Else if we dont get an error or we get an result return  200:OK
        res.status(200).end()
        //Logging the response at the server terminal
        responseLogger(res)
    }catch(error){
        //Catch error
        console.log(error)
        //Respond with 500:Interna; Server Error
        res.status(500).send().end();
        //log The response at the server terminal
        responseLogger(res)
    }
}




async function hello(){
    try{
        //Check if the user already has an Refresh Token
        if(!(result = await jwtToken.findOne({owner:"334d4f6e311f3c4ac941625"}))){
            console.log("no result")
        }else{
            console.log(result.key)
            return result.key;
        }
        console.log("Hello")



    }catch(error){
        throw new Error(error);

    }

}
hello()


module.exports.generateRefressToken2 = async function(payLoad){
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
        return await newToken.save(savedToken).key;
        }
    }catch(error){
        //On error throw it
        throw new Error(error);
    }
}
  
async function verifyUser(username,password) {
    //Search the database for a user with matching username
    try{
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

  

  module.exports.loginPost2 = async function (req,res){
    //Loggin the request at the server terminal
    requestLogger(req);
    try {
        //extracting the parametres from the request Body
        const { username, password } = req.body ? req.body : res.status(400).end()
         //Search the Database for a match
         if(isValid= await userController.verifyUser(username, password)){
            res.status(200).json({
                accessToken:jwtController.generateAccessToken(jwtPayLoad),
                refreshToken: await jwtController.generateRefreshToken(jwtPayLoad)
            }).end();
         }else{
            //If the Authendication fails at any point, return a 401:Bad Request Status
      res.status(400).end()
      //Logging the response at the server terminal
      responseLogger(res)
         }
        
    }catch(error) {
        //Catch error
        console.log(error)
        //Respond with 500:Interna; Server Error
        res.status(500).send().end();
        //log The response at the server terminal
        responseLogger(res)
    }
  }
