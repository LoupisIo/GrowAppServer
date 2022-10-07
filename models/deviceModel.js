/** Device Data base model
 * @module models/device
 * @requires {@link https://www.npmjs.com/package/mongoose|mongoose}
 * @requires {@link https://www.npmjs.com/package/bcrypt|bcrypt}
 */

const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

/**
 * The sensor model
 * @typedef {Object} sensor
 * @property {String} address - The I2C adress of the sensor
 * @property {Array.<String>} measurementType - The measurment types the sensor takes
 */

const sensorSchema = new mongoose.Schema({
    address:{type: String},
    measurementType:{type: String}
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


deviceSchema.pre('save',async function (next){
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.key,salt)
        this.key = hashedPassword
        next()
    }catch(error){
        next(error);
    }
})

/**The Device Model - It respresent an arduino board, member of the system
 * @typedef {Object} device
 * @property {String} name - The name of the device
 * @property {String} owner - The owner's unique ID
 * @property {String} key - The device's secret key
 * @property {Array.<sensor>} sensors - A list of the availiable sensors on the device
 */
const device = mongoose.model('deviceModel',deviceSchema)

module.exports = {device}
