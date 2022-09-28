const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type:String , required: true},
    fName: {type:String , required: true},
    lName:{type:String , required: true},
    email:{type:String , required: true},
    key:{type:String , required: true},
    sensors:[String],
},
    {collection : "Users"}
)


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


const users = mongoose.model('userModel',userSchema);
const sensors = mongoose.model('sensorModel',sersorSchema);

module.exports = {users,sensors}