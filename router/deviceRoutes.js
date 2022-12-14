/**
 * Express Router for the Device routes
 * @module routers/device
 * @requires {@link https://www.npmjs.com/package/express|Express}
 * @requires  {@link module:controllers/device}
 * 
 */


const deviceController = require("../controllers/deviceController.js")

const express = require("express")

const router = express.Router();

router.use(express.json())

/**
 * Get all devices.
 * Calls {@link module:controllers/device.getDevices|deviceController.getDevices}
 * 
 * @name getDevices
 * @memberof module:routers/device
 * @route {GET} /devices
 */
router.get("/device",deviceController.getDevices)

/**
 * Get Device by Name.
 * Calls {@link module:controllers/device.getDeviceByName|deviceController.getDeviceByName}
 * 
 * @name getDeviceByName
 * @memberof module:routers/device
 * @route {GET} /device/name/:name
 * @routeparam {String} :name is the name of the device
 */
router.get("/device/name/:name",deviceController.getDeviceByName)

/**
 * Get Devices by Owner.
 * Calls {@link module:controllers/device.getDevicesByOwner|deviceController.getDeviceByOnwer}
 * @name getDeviceByOwner
 * @memberof module:routers/device
 * @route {GET} /device/name/:owner
 * @routeparam {String} :owner is the username of the owner of the device
 */
router.get("/device/owner/:owner",deviceController.getDevicesByOwner)

/**
 * Add a new device.
 * Calls {@link module:controllers/device.addDevice|deviceController.addDevice}
 * 
 * @name postDevice
 * @memberof module:routers/device
 * @route {POST} /device
 * @bodyparam {String} name is the name of the new device
 * @bodyparam {String} key The password of the new device
 */
router.post("/device",deviceController.addDevice)

/**
 * Deletes a device from the database.
 * Calls {@link module:controllers/device.deleteDevice|deviceController.deleteDevice}
 * 
 * @name deleteDevice
 * @memberof module:routers/device
 * @route {DELETE} /device
 * @bodyparam {String} name is the name of the new device
 * @bodyparam {String} key The password of the new device
 */
router.delete("/device",deviceController.deleteDevice)

/**
 * Updates the owner of a device.
 * Calls {@link module:controllers/device.updateOwner|deviceController.updateOwner}
 * @name updateOwner
 * @memberof module:routers/device
 * @route {PATCH} /device
 * @bodyparam {String} owner is the name of the new owner
 * @bodyparam {String} name is the name of the device
 * @bodyparam {String} key The password of the device
 */
router.patch("/device",deviceController.updateOwner)
/**
 * Adds a sensor to a device.
 * Calls {@link module:controllers/device.addSensor}
 * 
 * @name addSensor
 * @memberof module:routers/device
 * @route {POST} /device/sensor
 * @bodyparam {String} deviceName is the name of the device
 * @bodyparam {String} deviceKey is the key of the device
 * @bodyparam {String} address is the I2C address of the device
 * @bodyparam {String} type is the type of the measurment the sensor takes
 */
router.post('/device/sensor',deviceController.addSensor)

/**
 * Removes a sensor from a device.
 * Calls {@link module:controllers/device.removeSensor}
 * 
 * @name removeSensor
 * @memberof module:routers/device
 * @route {DELETE} /device/sensor
 * @bodyparam {String} deviceName is the name of the device
 * @bodyparam {String} deviceKey is the key of the device
 * @bodyparam {String} address is the I2C address of the device
 */
router.delete('/device/sensor',deviceController.removeSensor)

module.exports = router