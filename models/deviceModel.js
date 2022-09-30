/** Device Data base model
 * @module models/device
 * @requires {@link https://www.npmjs.com/package/mongoose|mongoose}
 */

const mongoose = require(mongoose);

/**
 * The sensor model
 * @typedef {Object} sensor
 * @property {String} address - The I2C adress of the sensor
 * @property {Array.<String>} measurementType - The measurment types the sensor takes
 */

const sensorSchema = new mongoose.Schema({
    address:{type: String},
    measurementType:[String]
})

const deviceSchema = new mongoose.Schema({
    name :{
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: String
    },
    key:{
        type: String,
        required: true
    },
    sensors:[sensorSchema]
},
    {collection:'devices'}
)

/**The Device Model - It respresent an arduino board, member of the system
 * @typedef {Object} device
 * @property {String} name - The name of the device
 * @property {String} owner - The owner's unique ID
 * @property {String} key - The device's secret key
 * @property {Array.<sensor>} sensors - A list of the availiable sensors on the device
 */
const device = mongoose.model('deviceModel',deviceSchema)

module.exports = {device}
