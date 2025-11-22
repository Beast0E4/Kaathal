const express = require('express');
const authcontroller = require('../controllers/auth.controller')
const { checkUser } = require('../middlewares/middlewares')

const userRoutes = express.Router();

userRoutes.post('/signup',checkUser, authcontroller.signup);
userRoutes.post('/signin',authcontroller.signin);

module.exports = userRoutes