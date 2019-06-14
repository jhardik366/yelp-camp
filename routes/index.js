var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/", function(req,res){
    res.render("landing"); 
});

//Show register form
router.get("/register", function(req, res) {
    res.render("register", {page: 'register'});
});

// //HANDLE SIGN UP LOGIC               //in this middleware, storing username and password, into db with hashing and salting
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            // req.flash("error", err.message);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Yelp Camp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//SHOW LOGIN FORM
router.get("/login", function(req, res) {
    res.render("login", {page: 'login'});
});

//HANDLING LOGIN form LOGIC              //in this middleware, retrieving the username and password from the db
router.post("/login", passport.authenticate("local",           //app.post("/login", middleware, callback())
    {successRedirect: "/campgrounds",
    failureRedirect: "/login",
    }), function(req, res){
    
});

//Logout Route
router.get("/logout", function(req, res) {
    req.logout();                   //already built-in function in passport
    req.flash("success", "Logged out, successfully!");
    res.redirect("/campgrounds");
});

module.exports = router;