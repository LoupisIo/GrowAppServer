const colors = require('colors');

function requestLogger(request){
    let timestamp = new Date(Date.now())
    let UtcString = timestamp.toUTCString();
    console.log(
        "["+UtcString.green+"]"+
        " - "+"REQUEST".brightMagenta+
        " - METHOD: "+request.method.bgGrey+
        " - PATH: "+request.url.red
    )
}

function responseLogger(response){
    let timestamp = new Date(Date.now())
    let UtcString = timestamp.toUTCString();
    if(response.statusCode==200){
        console.log(
        "["+UtcString.green+"]"+
        " - "+"RESPONSE".brightMagenta+
        " - STATUS: "+response.statusCode.toString().green
    )}else{
        console.log(
            "["+UtcString.green+"]"+
            " - "+"RESPONSE".brightMagenta+
            " - STATUS: "+response.statusCode.toString().brightRed
            )
    }  
}

function testerBasic(body){
    let timestamp = new Date(Date.now())
    let UtcString = timestamp.toUTCString();
    console.log(
        "["+UtcString.green+"]"+
        " - "+body
        )
}

function testMainLogger(arg1,n,arg2=""){
    let timestamp = new Date(Date.now())
    let UtcString = timestamp.toUTCString();
    console.log(
        "["+UtcString.green+"]"+
        " - "+arg1+
        " "+n+
        " "+arg2
        )
}

function routineLogger(arg1,n,status){
    let timestamp = new Date(Date.now())
    let UtcString = timestamp.toUTCString();
    if(status){
        console.log(
            "["+UtcString.green+"]"+
            " - "+arg1+
            " "+"SUCCESS".green+
            " "+n
            )
    }else{
        console.log(
            "["+UtcString.green+"]"+
            " - "+arg1+
            " "+"FAIL".red+
            " "+n
            )
    }
}

function inLineUpdate(arg1,arg2=null,arg3=null){
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    let timestamp = new Date(Date.now())
    let UtcString = timestamp.toUTCString();
    process.stdout.write(
        "["+UtcString.green+"]"+
        " - "+arg1+
        " - "+arg2+
        "/"+arg3
    )
}
module.exports= {requestLogger,responseLogger,testerBasic,testMainLogger,routineLogger,inLineUpdate};



