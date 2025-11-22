const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const {Mongo_DB_URL, PORT} = require('./src/config/db.config');
const mongoose = require('mongoose');

const userRoutes = require ('./src/routes/user.route');
// server instance
const http = require("http");
// const setupSocket = require("../server/socket/socket");
const server = http.createServer(app);

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, x-access-token");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.use('/auth',userRoutes);



// Error handling middleware
app.use((err,req,res,next) => {
    const {statusCode = 500 , message = "Something went wrong"} = err;
    res.status(statusCode).send({
        msg : message
    })
})

app.use(cors());

async function ConnectToDb(){

    try {
      await mongoose.connect(Mongo_DB_URL);
      console.log("Connected to DB");
    } catch (error) {
        console.log("Connection to DB failed");
        console.log(error);
    }

}

ConnectToDb();


server.listen(PORT, () => {
    console.log(`listning to port ${PORT}!`);
})