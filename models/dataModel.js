/** Data Model
 *  @module models/Data
 *  @requires {@link https://www.npmjs.com/package/mongoose|mongoose}
 */

const mongoose = require("mongoose");

/**
 * Measurment model
 * @typedef {Object} measurment
 * @memberof module:models/Data
 * @property {string} address - The I2C address of the sensor
 * @property {string} measurementType - The type of the measurment
 * @property {number} value - The value of the measurment
 */

const measurmentSchema = new mongoose.Schema({
    address:{type: String},
    measurmentType:{type: String},
    value:{type: Number}
})



/**
 * Data Model
 * @typedef {Object} data
 * @memberof module:models/Data
 * @property {Date} time - The timestamp when the measurment was taken
 * @property {string} source - The Device name from which the measurments were taken
 * @property {Array.measurment} measurments - An array of the measurments taken
 */
const dataSchema = new mongoose.Schema({
    time:{type: Date, required: true},
    source:{type: String, required: true},
    measurments:[measurmentSchema]

},{collection:'WeatherData'}
)

const data = mongoose.model('dataModel',dataSchema)

module.exports = {data}