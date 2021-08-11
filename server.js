const express = require("express");
const controll = require("../blog-app-express-mysql/controller/loginSignup")
const knexFile = require("../blog-app-express-mysql/knexfile");
const route = require("../blog-app-express-mysql/router/route")

var app = express();
app.use(express.json());
app.use(route);

app.listen(2000,function(){
    console.log("running.....")
})

