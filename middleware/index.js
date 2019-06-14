var Campground = require("../models/campground");
var Comment = require("../models/comment");

//all the middleware 
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        }
        else {
            //does user own the campground?
            // console.log(foundCampground.author.id); //It's a mongoose object
            // console.log(req.user._id);              //It's a string
            if(foundCampground.author.id.equals(req.user._id)){
                next();
            }
            else{
                req.flash("error", "Access denied");
                res.redirect("back");
            }
        }
    });    
    }
    else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back")
    }
        //does user own the campground
        //if not owns, then otherwise redirect
    //if not, redirect
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err || !foundComment){
            req.flash("error", "Comment not found");
            res.redirect("back");
        }
        else {
            //does user own the comment?
            if(foundComment.author.id.equals(req.user._id)){
                next();
            }
            else {
                req.flash("error", "Access denied");
                res.redirect("back");
            }
        }
    });    
    }
    else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back")
    }
        //does user own that comment
        //if not owns, then otherwise redirect
    //if not, redirect
}

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;