const express = require("express")
const authController = require("../Controllers/authController");
const dataController = require("../Controllers/dataController");

//let {requestLogger,responseLogger} = require("../utils/logger.js")

const router = express.Router();
router.use(express.json())



router.get("/data",authController.verifyAccessToken,dataController.userVerification)





module.exports = router;