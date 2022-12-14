/** Express Router halndling the Data related requests
 *  @module routers/Data
 *  @requires {@link https://www.npmjs.com/package/express|Express}
 * 
 */

const express = require("express")

const dataController = require("../Controllers/dataController");

//let {requestLogger,responseLogger} = require("../utils/logger.js")

const router = express.Router();
router.use(express.json())

/**
 * Route serving the measurments of a specific device. If no endDate is given, returns up the last saved Data. 
 * @name Get Data
 * @memberof module:routers/Data
 * @route {GET} /data/:deviceName/:startDate/:endDate
 * @authendication This route requires JWT Authendication
 * @headerparam authorization is the access JWT token ofthe user. must be in the following format 'bearer {token}'
 * @routeparam {String} :deviceName is the unique name of the device
 * @routeparam {Date} :startDate The start Date of the querry. Must be in the format MM-DD-YYYY
 * @routeparam {Date} ?endDate The end Date of the querry. Must be in the format MM-DD-YYYY
 */

router.get('/data/:deviceName/:startDate',dataController.getData)

/**
 * Route serving the mean values of a device's mesurment for a specific period.
 * @name Get Mean Data
 * @memberof module:routers/Data
 * @route {GET} /data/mean/:period/:deviceName/:startDate
 * @authendication This route requires JWT Authendication
 * @headerparam authorization is the access JWT token ofthe user. must be in the following format 'bearer {token}'
 * @routeparam {String} :period is the period in which the mean values are calculated. Accepts [YEAR,MONTH,DAY]
 * @routeparam {String} :deviceName is the unique name of the device
 * @routeparam {Date} :startDate The start Date of the querry. Must be in the format MM-DD-YYYY
 * @queryparam {Date} :endDate The end Date of the querry. Must be in the format MM-DD-YYYY
 * 
 */

router.get('/data/mean/:period/:deviceName/:startDate',dataController.getMean)

/**
 * Route for data from a specific sensor of a device
 * @name Get sensor measurments
 * @memberof module:routers/Data
 * @route {GET} /data/:deviceName/sensor/:address/:startDate
 * @authendication This route requires JWT Authendication
 * @headerparam authorization is the access JWT token ofthe user. must be in the following format 'bearer {token}'
 * @routeparam {String} :deviceName is the unique name of the device
 * @routeparam {String} :address is the I2C address of the sensor that collected the data.
 * @routeparam {Date} :startDate The start Date of the querry. Must be in the format MM-DD-YYYY
 * @queryparam {Date} :endDate The end Date of the querry. Must be in the format MM-DD-YYYY
 */
router.get('/data/:deviceName/sensor/:address/:startDate',dataController.getSensorData)


/**
 * Route for the mean values of a specific sensor of a device
 * @name Get sensor mean
 * @memberof module:routers/Data
 * @route {GET} /data/mean/:period/:deviceName/sensor/:address/:startDate
 * @authendication This route requires JWT Authendication
 * @headerparam authorization is the access JWT token ofthe user. must be in the following format 'bearer {token}'
 * @routeparam {String} :period is the period in which the mean values are calculated. Accepts [YEAR,MONTH,DAY]
 * @routeparam {String} :deviceName is the unique name of the device
 * @routeparam {String} :address is the I2C address of the sensor that collected the data.
 * @routeparam {Date} :startDate The start Date of the querry. Must be in the format MM-DD-YYYY
 * @queryparam {Date} :endDate The end Date of the querry. Must be in the format MM-DD-YYYY
 * 
 */
router.get('/data/mean/:period/:deviceName/sensor/:address/:startDate',dataController.getMeanSensorData)

/**
 * Route that handles saving the data from a device to the DataBase
 * @name Data Upload
 * @memberof module:routers/Data
 * @route {POST} data/:deviceName
 * @authendication This route requires JWT Authendication
 * @headerparam authorization is the access JWT token ofthe user. must be in the following format 'bearer {token}'
 * @routeparam {String} :deviceName is the unique name of the device
 * @bodyparam {data} payLoad - A {@link module:models/Data.data|Data} Object
 * 
 * 
 */

router.post('/data/:deviceName',dataController.postData)








module.exports = router;