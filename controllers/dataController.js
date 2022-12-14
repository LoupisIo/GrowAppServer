/**
 * Data Model Controller
 * @module controllers/Data
 * @require {@link module:models/data}
 * 
 */
const {data} = require('../models/dataModel');
/**
 * 
 */
const periods = ['YEAR','MONTH','DAY'];

/**
 * Handles the GET request at /data/:deviceName/:startDate/:endDate
 * @name getData
 * @memberof module:controllers/Data
 * @function
 * @async
 * @param {Object} request An Express request Object
 * @param {String} request.params.deviceName The name of the device
 * @param {Date} request.params.startDate The oldest date
 * @param {Date} request.query.endDate The last day (Optional)
 * @param {Object} response An Express responce Object
 */

async function getData(request,response){
    try{
        let {deviceName,startDate} = request.params||{function(){response.status(400).end();return;}};
        let {endDate} = request.query;
        startDate = new Date(startDate)
        startDate.setHours(3);
        let query = [
            {time:{$gte: startDate}},
            {source:deviceName}
        ];
        if(endDate){
            endDate = new Date(endDate)
            endDate.setHours(3)
            query.push({time:{$lte: endDate}})
        };
        let result = await data.find(
            {$and:query} 
        );
        response.status(200).send(result).end();
}catch(err){
    response.status(400).end();
    console.log(err);
}

}
/**
 * Handles the GET request at /data/mean/:period/:deviceName/:startDate
 * @name getMean
 * @memberof module:controllers/Data
 * @function
 * @async
 * @param {Object} request An Express request Object
 * @param {String} request.params.period The time period
 * @param {String} request.params.deviceName The name of the device
 * @param {Date} request.params.startDate The oldest date
 * @param {Date} request.query.endDate The last day (Optional)
 * @param {Object} response An Express responce Object
 */

async function getMean(request,response){
    try{
        let {deviceName,startDate,period} = request.params||{function(){response.status(400).end();return;}};
        let {endDate} = request.query;
        if(!periods.includes(period)){
            response.status(400).end();
            return;
        };
        startDate = new Date(startDate);
        startDate.setHours(3);
        let query = [
            {time:{$gte: startDate}},
            {source:deviceName}
        ];
        if(endDate){
            endDate = new Date(endDate)
            endDate.setHours(3)
            query.push({time:{$lte: endDate}})
        };
        let result;
        switch(period){
            case 'YEAR':
                result = await calculateYearMean(query);
                response.status(200).send(result).end();
                break;
            case 'MONTH':
                result = await calculateMonthMean(query);
                response.status(200).send(result).end();
                break;
            case 'DAY':
                result = await calculateDayMean(query);
                response.status(200).send(result).end();
                break;
        };

}catch(err){
    console.log(err)
    response.status(400).end();
}

}

/**
 * Handles the GET request at /data/:deviceName/sensor/:address/:startDate
 * @name getSensorData
 * @memberof module:controllers/Data
 * @function
 * @async
 * @param {Object} request An Express request Object
 * @param {String} request.params.deviceName The name of the device
 * @param {Date} request.params.startDate The oldest date
 * @param {Date} request.query.endDate The last day (Optional)
 * @param {Object} response An Express responce Object
 */
async function getSensorData(request,response){
    try{
        let {deviceName,address,startDate} = request.params||{function(){response.status(400).end();return;}};
        let {endDate} = request.query;
        startDate = new Date(startDate);
        startDate.setHours(3);
        let query = [
            {time:{$gte: startDate}},
            {source:deviceName},
            {"measurments.address":address}
        ];
        if(endDate){
            endDate = new Date(endDate)
            endDate.setHours(3)
            query.push({time:{$lte: endDate}})
        };
        let result = await getSensorDataQuerry(query);
        response.status(200).send(result);
}catch(err){
    response.status(400).end();
    console.log(err);
}
}

/**
 * Handles the GET request at /data/mean/:period/:deviceName/sensor/:address/:startDate
 * @name getMeanSensorData
 * @memberof module:controllers/Data
 * @function
 * @async
 * @param {Object} request An Express request Object
 * @param {String} request.params.period The time period
 * @param {String} request.params.deviceName The name of the device
 * @param {Date} request.params.startDate The oldest date
 * @param {Date} request.query.endDate The last day (Optional)
 * @param {Object} response An Express responce Object
 */
async function getMeanSensorData(request,response){
    try{
        let {deviceName,address,period,startDate} = request.params||{function(){response.status(400).end();return;}};
        console.log(deviceName,address,startDate);
        if(!periods.includes(period)){
            response.status(400).end();
            return;
        }
        let {endDate} = request.query;
        startDate = new Date(startDate);
        startDate.setHours(3);
        let query = [
            {time:{$gte: startDate}},
            {source:deviceName},
            {"measurments.address":address}
        ];
        if(endDate){
            endDate = new Date(endDate)
            endDate.setHours(3)
            query.push({time:{$lte: endDate}})
        };
        let result;
        switch(period){
            case 'YEAR':
                result = await calculateYearMean(query);
                response.status(200).send(result).end();
                break;
            case 'MONTH':
                result = await calculateMonthMean(query);
                response.status(200).send(result).end();
                break;
            case 'DAY':
                result = await calculateDayMean(query);
                response.status(200).send(result).end();
                break;
        }
}catch(err){
    response.status(400).end();
    console.log(err);
}

}

/**
 * Handles the POST request at data/:deviceNam
 * @name postData
 * @memberof module:controllers/Data
 * @function
 * @async
 * @param {Object} request An Express request Object
 * @param {Date} request.body.time The time stamp of the measurment
 * @param {String} request.body.source The name of the source device
 * @param {measument} request.body.measurments An array of measurments
 * @param {Object} response An Express responce Object
 */
async function postData(request,response){
    try{
        const {time,source,measurments} = request.body
        if(time ==undefined || source ==undefined || measurments==undefined){
            response.status(401).end();
            throw new Error('Bad Request')  
        }
        let newEntry = new data({
            time:time,
            source:source,
            measurments:measurments
        })
        newEntry = await newEntry.save();
        response.status(200).end()
    }catch(error){
    if(error.message == 'Bad Request'){
        response.status(401).end();}
    else{
        response.status(401).end();
    }
    }
}

module.exports = {getData,getMean,getSensorData,getMeanSensorData,postData}


async function calculateYearMean(query){
    return await data.aggregate([
        //Un-wind the measuments from the documents
        {
            $unwind:'$measurments'
        },
        //Select the entries only from the device we want
        {
            $match:{$and:query}
        },
        {
            //Create the necessary fields for the next pipeline stage
            $project:
            {
                year:{
                    $year:"$time"
                },
                source:'$source',
                address:"$measurments.address",
                measurmentType:'$measurments.measurmentType',
                value:'$measurments.value'

            }
        },
        {
            //Group the documents by Address, Year and measurment Type 
            //and calculate the mean value for each
            $group:
            {
                _id:{
                    address:"$address",
                    year:"$year",
                    measurmentType:'$measurmentType'},
                avgValue:{ $avg:'$value'}
            }
        }
    ]);

}

async function calculateMonthMean(query){
    return await data.aggregate([
        //Un-wind the measuments from the documents
        {
            $unwind:'$measurments'
        },
        //Select the entries only from the device we want
        {
            $match:{$and:query}
        },
        {
            //Create the necessary fields for the next pipeline stage
            $project:
            {
                year:{
                    $year:"$time"
                },
                month:{
                    $month:"$time"
                },
                source:'$source',
                address:"$measurments.address",
                measurmentType:'$measurments.measurmentType',
                value:'$measurments.value'

            }
        },
        {
            //Group the documents by Address, Year and measurment Type 
            //and calculate the mean value for each
            $group:
            {
                _id:{
                    address:"$address",
                    year:"$year",
                    month:"$month",
                    measurmentType:'$measurmentType'},
                avgValue:{ $avg:'$value'}
            }
        }
    ]);
}

async function calculateDayMean(query){
    return await data.aggregate([
        //Un-wind the measuments from the documents
        {
            $unwind:'$measurments'
        },
        //Select the entries only from the device we want
        {
            $match:{$and:query}
        },
        {
            //Create the necessary fields for the next pipeline stage
            $project:
            {
                year:{
                    $year:"$time"
                },
                month:{
                    $month:"$time"
                },
                day:{
                    $dayOfMonth:"$time"
                },
                source:'$source',
                address:"$measurments.address",
                measurmentType:'$measurments.measurmentType',
                value:'$measurments.value'

            }
        },
        {
            //Group the documents by Address, Year and measurment Type 
            //and calculate the mean value for each
            $group:
            {
                _id:{
                    address:"$address",
                    year:"$year",
                    month:"$month",
                    day:"$day",
                    measurmentType:'$measurmentType'},
                avgValue:{ $avg:'$value'}
            }
        }
    ]);
}


async function getSensorDataQuerry(query){
    return await data.aggregate([
        //Un-wind the measuments from the documents
        {
            $unwind:'$measurments'
        },
        //Select the entries only from the device we want
        {
            $match:{$and:query}
        },
        {
            //Create the necessary fields for the next pipeline stage
            $project:
            {
                time:'$time',
                source:'$source',
                measurments:'$measurments'

            }
        }
    ]);
}

