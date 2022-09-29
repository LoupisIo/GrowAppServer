/**
 * @namespace AutomationTesting
 */
let bcrypt = require('bcrypt');
var randomstring = require("randomstring");
const axios = require('axios').default;
let {testerBasic,testMainLogger,routineLogger,responseLogger,inLineUpdate} = require("./utils/logger.js")

 /** 
     * A list of first names for the test cases
     * @memberof AutomationTesting
     * @type {Array<string>} 
     * */
var fNames=[];    
/** 
   * A list of last names for the test cases
   * @memberof AutomationTesting
   * @type {Array<string>} 
   * */
var lNames =[];
/** 
   * A list of user names for the test cases
   * @memberof AutomationTesting
   * @type {Array<string>} 
   * */
var userNames=[];
/** 
   * A list of mails for the test cases
   * @memberof AutomationTesting
   * @type {Array<string>} 
   * */
var mails = [];
/** 
   * A list of passwords for the test cases
   * @memberof AutomationTesting
   * @type {Array<string>} 
   * */
var passWords = [];
/** 
  * A list of Refresh Tokens for the test cases
  * @memberof AutomationTesting
  * @type {Array<string>} 
  * */   
var refreshTokens=[]
/** 
  * A list of Access Tokens for the test cases
  * @memberof AutomationTesting
  * @type {Array<string>} 
  * */
var accessTokens=[]
/**
 * @function
 * @name autoTestMain
 * @description The main Process of the auto-testing
 * @memberof AutomationTesting
 * 
 * 
/** @type {*} */
var autoTestMain= function(){
    n=10
    testerBasic("Server Automated Tests");
    testMainLogger("Starting Test Sequencies for",n,"users")
    userCaseAlpha(n)
}();

function userCaseAlpha(n){
    
    testerBasic("Starting User Case Alpha");
    let start = Date.now();
    testerBasic("Description: This is the first User Case made. This case registers n new users to the server")
    testerBasic("Then retrieves the Access Tokens via the /login POST route")
    testerBasic("Using the Access Tokens it access an AuthPath on the server")
    testerBasic("Continues with Generating new Access Tokens with the refresh Tokens")
    testerBasic("Then is Logs Out from all the users thus deleting the refresh Tokens from the Server")

    generateRandomUsers(n,()=>{
        signUpUsers(n,()=>{
            singInUsers(n,()=>{
                accessAuth(n,()=>{
                    tokenRefresh(n,()=>{
                        testerBasic("Trying auth Route with the new Access Tokens")
                        accessAuth(n,()=>{
                            tokenLogout(n,()=>{
                                deleteUser(n,()=>{
                                    let timer= Date.now() - start;
                                    testerBasic("User Case Alpha Completed with Sucess in "+ timer+"ms")
                                    
                                })
                            })
                        })
                    })
                })
            })
        })
    });
}


function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function generateRandomUsers(n,callback){
    testMainLogger("Generating",n,"random users")
    for (let i=0;i<n;i++){
        let hosts =["gmail","yahoo","rocketmail"]
        let regions = [".gr",".com",".uk.co",".net"]
        let fNameLength = getRandomArbitrary(2,10);
        let lNameLength = getRandomArbitrary(2,12);
        let userNameLength = getRandomArbitrary(512);
        let mailLength = getRandomArbitrary(5,12);
        
        fNames.push(randomstring.generate({length: fNameLength,charset: 'alphabetic'}));
        lNames.push(randomstring.generate({length:lNameLength,charset:'alphabetic'}));
        passWords.push(randomstring.generate({length:15,charset: 'alphanumeric'}));
        let mail = randomstring.generate({length:mailLength,charset: 'alphanumeric'});
        mail +="@"+hosts[getRandomArbitrary(0,2)] + regions[getRandomArbitrary(0,3)];
        mails.push(mail);
        userNames.push(randomstring.generate({length:userNameLength,charset: 'alphanumeric'}));
     };
     callback()
}

function signUpUsers(n,callback){
    
    testMainLogger("Posting user data as",n,"new users at the server")
    let promiseList =[];
    for (var i=0;i<n;i++){
    promiseList.push(registerPost(i))
}
Promise.all(promiseList).then(function(){
    let payload=i.toString() + "/"+ i.toString();
    routineLogger("Posting User Data finished:",payload,1)
    callback()
}) 
}

function singInUsers(n,callback){
    testMainLogger("Starting Log in Sequence for ",n," users at the server")
    let promiseList =[];
    let count=n;
    for (var i=0;i<n;i++){
    promiseList.push(loginPost(i))
    }
    
    Promise.all(promiseList)
        .then(function(resultList){
            let payload=count.toString() + "/"+ i.toString();
            routineLogger("Log In sequence finished:",payload,1)
            resultList.forEach((result)=>{
                accessTokens.push(result.data.accessToken)
                refreshTokens.push(result.data.refreshToken)
            })
            testMainLogger("Recieved a total of",accessTokens.length+" Access Tokens")
            testMainLogger("Recieved a total of",refreshTokens.length+" Refresh Tokens")
            callback()
        })   
}

function accessAuth(n,callback){
    testMainLogger("Trying to access Auth protected data from the server for each of the ",n,"test users")
    let promiseList =[];
    for (var i=0;i<n;i++){
    promiseList.push(authGet(i))
}
Promise.all(promiseList).then(function(){
    let payload=i.toString() + "/"+ i.toString();
    routineLogger("Auth Access Test finished:",payload,1)
    callback() 
})
}

function tokenRefresh(index,callback){
    testMainLogger("Trying refresh the access token using the refresh Token for each of the ",n,"test users")
    let promiseList =[];
    for (var i=0;i<n;i++){
    promiseList.push(tokenPost(i))
}
Promise.all(promiseList).then(function(resultList){
    resultList.forEach((result)=>{
        accessTokens[index]= result.data.accessToken;
    })
    let payload=i.toString() + "/"+ i.toString();
    routineLogger("Refresh Test finished:",payload,1)
    callback()
}) 
}

function tokenLogout(index,callback){
    testMainLogger("Loggin Out for each of the ",n,"test users")
    let promiseList =[];
    for (var i=0;i<n;i++){
    promiseList.push(tokenDelete(i))
}
Promise.all(promiseList).then(function(){
    let payload=i.toString() + "/"+ i.toString();
    routineLogger("LogOut Test finished:",payload,1)
    callback()
}) 
}

function deleteUser(index,callback){
    testMainLogger("Deleting each of the ",n,"test users")
    let promiseList =[];
    for (var i=0;i<n;i++){
    promiseList.push(userDelete(i))
    }
    Promise.all(promiseList).then(function(resultList){
        let payload=i.toString() + "/"+ i.toString();
        routineLogger("Delete Users Test finished:",payload,1)
        callback()
    }) 
}

function registerPost(index){ 
     return axios({
        method:'post',
        baseURL:'http://localhost:3000',
        url:'/register',
        data : {
            fName: fNames[index],
            lName: lNames[index],
            username: userNames[index],
            email: mails[index],
            password: passWords[index]
            }
        })
};

function loginPost(index){
    return axios({
        method:'post',
        baseURL:'http://localhost:3000',
        url:'/login',
        data : {
            username: userNames[index],
            password: passWords[index]
            }
        })
}

function authGet(index){
    return axios({
        method:'get',
        baseURL:'http://localhost:3000',
        url:'/data',
        headers : {
            authorization: "bearer "+accessTokens[index]
            }
        })
}

function tokenPost(index){
    return axios({
        method:'post',
        baseURL:'http://localhost:3000',
        url:'/token',
        data : {
            refreshToken: refreshTokens[index]
            }
        })
};

function tokenDelete(index){
    return axios({
        method:'get',
        baseURL:'http://localhost:3000',
        url:'/logout',
        data : {
            token: refreshTokens[index]
            }
        })

}

function userDelete(index){
    return axios({
        method:'delete',
        baseURL:'http://localhost:3000',
        url:'/user',
        headers : {
            authorization: "bearer "+accessTokens[index]
            },
        data: {
            username: userNames[index],
            password: passWords[index]
        }
        })
}