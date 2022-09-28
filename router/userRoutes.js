const express = require("express")
const authController = require("../Controllers/authController");
const dataController = require("../Controllers/dataController");
const userController = require("../Controllers/userController.js")

//let {requestLogger,responseLogger} = require("../utils/logger.js")

const router = express.Router();
router.use(express.json())



router.delete("/user",authController.verifyAccessToken,userController.deleteUser)

router.patch("/user/mail",authController.verifyAccessToken,userController.updateUserMail)

router.patch("/user/password",authController.verifyAccessToken,userController.updateUserPassWord)





module.exports = router;