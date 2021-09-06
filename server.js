const express = require("express");
const controll = require("../Express-Mysql-BlogApp/controller/loginSignup")
const knexFile = require("../Express-Mysql-BlogApp/knexfile");
const route = require("../Express-Mysql-BlogApp/router/route")

var app = express();
app.use(express.json());
app.use(route);

app.listen(2000,function(){
    console.log("running.....")
})

