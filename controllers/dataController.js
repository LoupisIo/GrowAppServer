let {responseLogger,requestLogger} = require("../utils/logger.js")


async function userVerification(request,response){
    requestLogger(request)
    response.status(200).end();
    responseLogger(response);

}


module.exports = {userVerification}