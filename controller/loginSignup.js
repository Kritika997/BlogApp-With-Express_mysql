const express = require("express");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const bodyParser = require("body-parser");
const knex = require('knex')
const connection = require("../knexfile")
const knexcon = knex(connection["development"])

var app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cookie());

exports.signup = (req, res) => {
    const Myuser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };
    knexcon("userDetails").insert([
        { user_name: Myuser.name, user_email: Myuser.email, user_password: Myuser.password }
    ]).then(table => {
        if (table) {
            var email = Myuser.email;
            var password = Myuser.password;
            var reg_token = jwt.sign({ email, password }, "Key", {
                expiresIn: "2h"
            });
            res.cookie("jwt", reg_token).json({ 
                message: "user found",
                reg_token: reg_token
            });
        } else {
            res.status(400).json({
                message: "failed"
            });
        };
    }).catch(err => {
        res.send(err);
    });
};
exports.login = (req, res) => {
    knexcon.select('user_email', 'user_password').
        from('userDetails').where('user_email', req.body.email)
        .then(data => {
            if (data.length !== 0) {
                var email = req.body.email;
                var password = req.body.password;
                var log_token = jwt.sign({ email, password }, "Key", {
                    expiresIn: "2h"
                });
                res.cookie("jwt", log_token).json({
                    message: "user_found",
                    log_user: log_token
                });
            } else {
                res.status(400).json({
                    message: "failed"
                });
            };
        })
        .catch(err => res.send(err));
};
exports.createPost = (req, res) => {
    knexcon('post').insert([
        {
            Imange: req.body.imange,

            like: 0,

            dislike: 0
        }
    ])
        .then((result) => {
            console.log(result)
            if (result !== 0) {
                res.status(200).send("post created");
            }
            else {
                res.send("not created");
            };
        })
        .catch((err) => { 
            res.send(err)
        });
};

exports.seePost = (req, res) => {
    knexcon.select('imange')
        .from('post').where('imange', req.body.imange)
        .then(result => {
            res.send(result);
        }).catch(err => {
            res.send(err);
        });
};

exports.LikeDislike = (req, res) => {
    var userOfemail = req.body.email;
    knexcon.select("*")
        .from('post').where({ imange: req.body.imange })
        .then((First_result) => {
            User_like = req.body.like 
            user_dislike = req.body.dislike
            if (First_result.length != 0) {
                if (User_like == "like") {
                    like = First_result[0]["like"] + 1
                    knexcon.select('user_email').from('postDetails')
                        .where({user_email:req.body.email})

                        .then((sec_result) => {
                            // console.log(sec_result.length)
                            if (sec_result.length !== 0) {
                                if (sec_result[0]["user_email"] != req.body.email) {
                                    knexcon('post').where({ imange: req.body.imange })
                                        .update({
                                            like: like
                                        })
                                        .then((third_result) => {
                                            knexcon('postDetails').insert([
                                                {
                                                    user_email: req.body.email,
                                                    imange: req.body.imange,
                                                    like_or_dislike: like
                                                }
                                            ])
                                                .then((for_result) => {
                                                    if (for_result !== 0) {
                                                        res.send("thanks for like! ");
                                                    } else {
                                                        console.log('error! ');
                                                    };
                                                })
                                                .catch((err) => {
                                                    res.status(200).send(err);
                                                })
                                                .catch((err) => {
                                                    res.status(201).send(err);
                                                })
                                        });
                                } else {
                                    console.log("you have already like/dislike this post so now you can't like again! ")
                                };
                            }
                            else {
                                knexcon('post').where({ imange: req.body.imange })
                                    .update({
                                        like: like
                                    })

                                    .then((five_result) => {
                                        knexcon("postDetails").insert([
                                            {
                                                user_email: req.body.email,
                                                imange: req.body.imange,
                                                like_or_dislike: like
                                            }
                                        ])
                                            .then((six_result) => {
                                                res.send("thank for like this post! ")
                                            })
                                            .catch((err) => {
                                                res.status(202).send(err);
                                            })
                                    })
                                    .catch((err) => {
                                        res.status(203).send(err)
                                    });
                            };
                        })
                        .catch((err) => {
                            res.status(204).send(err);
                            console.log(err);
                        });
                }
                else if(user_dislike == "dislike") {  
                    Dislike = First_result[0]["Dislike"] + 1;
                    knexcon.select("user_email").from('postDetails')
                        .where({user_email: req.body.email})
                        .then((reso)=>{
                            console.log(reso)
                            if (reso.length !== 0){
                                if (reso[0]["user_email"] !== req.body.email) {
                                    knexcon('post').where({ imange: req.body.imange })
                                        .update({
                                            Dislike: dislike
                                        })
                                        .then((result_sec) => {
                                            knexcon('postDetails').insert([
                                                {
                                                    user_email: req.body.email,
                                                    imange: req.body.imange,
                                                    like_or_dislike: Dislike
                                                }
                                            ])
                                                .then((result) => {
                                                    res.send("thanks for dislike! ")
                                                })
                                                .catch(err => {
                                                    res.status(205).send(err);
                                                });
                                        })
                                        .catch((err) => {
                                            res.status(206).send(err);
                                        })
                                } else {
                                    console.log("you have already like/dislike now you can't do dislike! ")
                                };
                            } else {
                                knexcon("post").where({ imange: req.body.imange })
                                    .update({
                                        Dislike: Dislike
                                    })
                                    .then((result) => {
                                        knexcon("postDetails").insert([
                                            {
                                                user_email: req.body.email,
                                                imange: req.body.imange,
                                                like_or_dislike: user_dislike
                                            }
                                        ])
                                            .then((result) => {
                                                res.send("you dislike this post! ");
                                            })
                                            .catch(err => {
                                                res.status(207).send(err);
                                            })
                                    })
                                    .catch((err) => {
                                        res.status(208).send(err)
                                    });
                            };
                        })
                        .catch((err) => {
                            res.status(209).send(err)
                        })
                } 
                else {
                    console.log("you can not like and dislike: ");
                };
            } else {
                console.log("this data is not there: ")
            };
        })
        .catch((err) => {
            res.status(210).send(err)
        })
};

exports.seeLikeDislike = (req, res) => {
    knexcon.from("post").select("*")
        .then((result) => {
            res.send(result);
        }).catch((err) => {
            res.status(211).send(err);
        });
};

exports.post = (req, res) => {
    console.log(req.user);
};
