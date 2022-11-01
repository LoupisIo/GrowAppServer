/**
 * Device Model Controller
 * @module controllers/device
 * @require {@link module:models/device}
 * @require {@link module:models/user}
 * @require {@link module:controllers/user}
 * @requires {@link https://www.npmjs.com/package/bcrypt|bcrypt}
 */
//Import bcrypt
const bcrypt = require('bcrypt');
//Import DB Models
const {device} = require("../models/deviceModel");
const {user} = require('../models/userModel.js');

//Import userController
const userController = require("../Controllers/userController.js")



/**
 * Handles the GET request at /device.
 * Called by the {@link module:routers/device.getDevices| GET /device} route
 * @name getDevices
 * @function
 * @async
 * @memberof module:controllers/device
 * @param {Object} req - An Express request Object
 * @param {Object} res - An Express responce Object
 * @returns {Array.<Object>} A list of the devices
 */
module.exports.getDevices = async function(req, res){
    try{
        let devices = await device.find().select('name');
        res.status(200).json(devices).end();
    }catch(error){
        console.log(error)
        res.status(500).end();
    }
}

/**
 * Handles the GET request at /device/name/:name.
 * Called by the {@link module:routers/device.getDeviceByName| GET /device/name/:name} route
 *
 * @name getDeviceByName
 * @function
 * @async
 * @memberof module:controllers/device
 * @param {Object} req - An Express request Object
 * @param {Object} res - An Express responce Object
 * @returns {Array.<Object>} A list of the devices
 */
module.exports.getDeviceByName = async function(req, res){
    try{
        const {name} = req.params ||{function(){res.status(400).end();return;}};
        var result = await device.find({name:name}).select('name sensors')
        if(result.length>0){
            console.log(result)
            res.status(200).json(result).end();
        }else{
            res.status(400).end();
        }
    }catch(error){
        console.log(error)
        res.status(500).end();
    }
}
/**
 * Handles the GET request at /device/name/:name.
 * Called by the {@link module:routers/device.getDeviceByOwner| GET /device/owner/:owner} route
 *
 * @name getDevicesByOwner
 * @function
 * @async
 * @memberof module:controllers/device
 * @param {Object} req - An Express request Object
 * @param {Object} res - An Express responce Object
 * @returns {Array.<Object>} A list of the devices
 */
module.exports.getDevicesByOwner = async function (req,res){
    try{
        const {owner} = req.params ||{function(){res.status(400).end();return;}};
        var result = await device.find({owner:owner}).select('name sensors')
        if(result.length>0){
            console.log(result)
            res.status(200).json(result).end();
        }else{
            res.status(400).end();
        }
    }catch(error){
        console.log(error)
        res.status(500).end();
    }
}


/**
 * Handles the POST request at /device.
 * Called by the {@link module:routers/device.postDevice|POST /device} route
 * @name addDevice
 * @function
 * @async
 * @memberof module:controllers/device
 * @param {Object} req - An Express request Object
 * @param {Object} res - An Express responce Object
 * @returns {Object} A response Object
 * @returns {String} The status Code of the operation
 */
module.exports.addDevice = async function(req, res){
    try{
        const {name,key} = req.body||{function(){res.status(400).end();return;}};
        console.log(name,key)
        if(exists = await device.findOne({name:name})){
            console.log(exists);
            res.status(400).send({error:'Device with the same name allready exists'}).end();
            
        }else{
            let newDevice = new device({
                name:name,
                key:key,
                sensors:[]
            })
            newDevice = await newDevice.save();
            res.status(201).end();
        }
    }catch(error){
        console.log(error);
        res.status(500).end()
    }
}

/**
 * Handles the DELETE request at /device.
 * Called by the {@link module:router/device.deleteDevice|DELETE /device} route
 * @name deleteDevice
 * @memberof module:controllers/device
 * @function
 * @async
 * @param {Object} req - An Express request Object
 * @param {Object} res - An Express responce Object
 * @returns {Object} A response Object
 * @returns {String} The status Code of the operation
 */
module.exports.deleteDevice = async function(req, res){
    try{
        const {name,key} = req.body||{function(){res.status(400).end();return;}};
        let exists = await device.findOne({name:name})
        if(!exists){
            res.status(400).send({error:'Name or Key are wrong'}).end();
        }else if(await verifyDevice(key,exists.key)){
            if(exists.owner){
                await user.findOneAndUpdate({username:exists.owner},{$pull:{devices:name}})
            }
            await device.findOneAndDelete({name:name});
            res.status(202).send({message:'Device Deleted'})
        }else{
            res.status(400).send({error:'Name or Key are wrong'}).end();
        }
    }catch(error){
        console.log(error);
        res.status(500).end()
    }
}


/**
 * Handles the PATCH request at /device.
 * Called by the {@link module:routers/device.updateOwner|PATCH /device} route
 * @name updateOwner
 * @memberof module:controllers/device
 * @function
 * @async
 * @param {Object} req - An Express request Object
 * @param {Object} res - An Express responce Object
 * @returns {Object} A response Object
 * @returns {String} The status Code of the operation
 */

module.exports.updateOwner = async function(req, res){
    const {ownerName,name,key} = req.body||{function(){res.status(400).end();return;}};
    let userExists = await user.findOne({username:ownerName}).select('username devices');
    let deviceExists = await device.findOne({name:name});
    if(userExists && deviceExists){
        if(userExists.devices.includes(deviceExists.name)){
            res.status(400).end();
        }else if(await verifyDevice(key,deviceExists.key)){
            userExists = await user.findByIdAndUpdate(userExists._id,{$push:{devices:name}},{returnDocument:'after'})
            deviceExists = await device.findByIdAndUpdate(deviceExists._id,{$set:{owner:ownerName}})
            res.status(202).send(userExists.devices)
        }
    } 
}

/**
 * Handles the POST request at /device/sensor.
 * Called by the {@link module:routers/device.addSensor|POST /device/sensro} route
 * 
 * @name addSensor
 * @memberof module:controllers/device
 * @function
 * @async
 * @param {Object} req - An Express request Object
 * @param {Object} res - An Express responce Object
 * @returns {Object} A response Object
 * @returns {String} The status Code of the operation
 */
module.exports.addSensor = async function(req, res){
    try{
        const {deviceName,deviceKey, address, type} = req.body ||{function(){res.status(400).end();return;}};
        let exists = await device.findOne({name:deviceName})
        if(!exists){
            res.status(400).send({error:'Name or Key are wrong'}).end();
        }else if(await verifyDevice(deviceKey,exists.key)){
            //Check if a sernsor with the same address already exists
            exists.sensors.forEach((sensor)=>{
                if(sensor.address == address){
                    throw new Error('A sensor with that address already exists')
                }
           })
           exists = await device.findByIdAndUpdate(exists._id,{$push:{sensors:{address:address,measurementType:type}}})
           res.status(202).end();
        }else{
            res.status(401).end();
        }
    }catch(error){
        console.log(error)

        if(error.message == "A sensor with that address already exists"){
            res.status(400).send({Error:error.message}).end();
        }else{
            res.status(500).end()
        }
    }
}

/**
 * Handles the DELETE requust at /device/sensor.
 * Called by the {@link module:routers/device.removeSensor|DELETE device/sensor} route
 * 
 * @name removeSensor
 * @memberof module:controllers/device
 * @function
 * @async
 * @param {Object} req - An Express request Object
 * @param {Object} res - An Express responce Object
 * @returns {Object} A response Object
 * @returns {String} The status Code of the operation
 */
module.exports.removeSensor = async function(req, res){
    try{
        const {deviceName,deviceKey, address} = req.body ||{function(){res.status(400).end();return;}};
        let exists = await device.findOne({name:deviceName})
        if(!exists){
            res.status(400).send({error:'Name or Key are wrong'}).end();
        }else if(await verifyDevice(deviceKey,exists.key)){
           exists = await device.findByIdAndUpdate(exists._id,{$pull:{sensors:{address:address}}})
           res.status(202).end();
        }else{
            res.status(401).end();
        }
    }catch(error){
        console.log(error);
        res.status(500).end()
    }
}
    


async function verifyDevice(plainText,hashedText){
    console.log(plainText,hashedText)
    try{
        return await bcrypt.compare(plainText,hashedText)
    }catch(error){
        throw new Error(error)
    }

}