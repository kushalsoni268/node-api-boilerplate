const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');

router.post('/register', userController.userRegister);
router.post('/login', userController.userLogin);
router.post('/logout', userController.userAuthenticate, userController.userLogout);
router.post('/get-user', userController.userAuthenticate, userController.getUserDetails);
router.post('/update-language', userController.userAuthenticate, userController.updateLanguage);

module.exports = router;
