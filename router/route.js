const express = require("express");
const controll = require("../controller/loginSignup");
const auth = require("../authorization/auth")
const route = new express.Router();

route.post("/signup",controll.signup);
route.post("/login",controll.login);
route.post("/createPost",controll.createPost);
route.get("/seePost",controll.seePost);
route.post("/LikeDislike",controll.LikeDislike);
route.get("/seeLikeDislike",controll.seeLikeDislike);
route.post("/post",auth,controll.post);


module.exports = route; 