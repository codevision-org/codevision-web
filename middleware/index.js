var Course = require("../models/course"),
    Comment = require("../models/comment");

var middlewareObject = {
    checkCourseOwnership: function(req, res, next){
        if(req.isAuthenticated()){
            Course.findById(req.params.id, function(err, course){
                if(err || !course){
                    req.flash("error", "An error occured.");
                    req.redirect("/courses");
                } else {
                    if(course.meta.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash("error", "Oh crap! You do not have permission to do that.");
                        res.redirect("/courses");
                    }
                }
            });
        } else {
            req.flash("error", "Oh crap! You need to be logged in to do that.");
            res.redirect("/courses");
        }
    },

    checkCommentOwnership: function(req, res, next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, comment){
                if(err || !comment){
                    req.flash("error", "An error occured.");
                    req.redirect("/courses");
                } else {
                    if(comment.meta.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash("error", "Oh crap! You do not have permission to do that.");
                        res.redirect("/courses");
                    }
                }
            });
        } else {
            req.flash("error", "Oh crap! You need to be logged in to do that.");
            res.redirect("/courses");
        }
    },
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("/login");
    }    
};

module.exports = middlewareObject;