const express = require('express');
const authcontroller = require('../controllers/auth.controller')
const { checkUser } = require('../middlewares/middlewares');
const { isUserAuthenticated } = require('../validators/authenticate.user');
const { uploadSingleImage } = require('../config/cloud.config');

const userRoutes = express.Router();

userRoutes.post('/signup',checkUser, authcontroller.signup);
userRoutes.post('/signin',authcontroller.signin);
userRoutes.patch ('/', isUserAuthenticated, uploadSingleImage, authcontroller.updateUser);

module.exports = userRoutes