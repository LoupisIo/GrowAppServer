const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    date:{Date},
    gTemp: {type:Number},
    aTemo:{type:Number},
    gHum:{type:Number},
    aHum:{type:Number},
    sunLight:{type:Number},


})

const sersorSchema = new mongoose.Schema({
    name:{type:String , required: true},
    data:[DataSchema]
},
    {collection : 'sensors'}
)




const sensor = mongoose.model('sensorModel',sersorSchema)

module.exports = {sensor}