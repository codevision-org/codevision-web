var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    Course = require("../models/course"),
    middleware = require("../middleware"),
    async = require("async"),
    nodemailer = require("nodemailer"),
    crypto = require("crypto");

// Root route
router.get("/", function(req, res){
    res.render("landing");
});

router.get("/about-us", function(req, res){
    res.render("about-us");
});

router.get("/events", function(req, res){
    res.render("events");
});

router.get("/members", function(req, res){
    User.find({}, function(err, users){
        if(err){
            console.log(err);
            req.flash("error", "An error occured.");
            res.redirect("/courses");
        } else {
            res.render("members", {users: users});
        }
    });
});

// Show register page
router.get("/register", function(req, res){
    res.render("authentication/register");
});

router.post("/register", function(req, res){

    var newUser = new User({
        username: req.body.username,
        email: req.body.email,
        avatar: req.body.avatar,
        biography: req.body.biography,
    });

    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            if(err.code === 11000){
                req.flash("error", "Email address already in use.");
                return res.redirect("/register");
            }
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Nice to see you, " + user.username);
            res.redirect("/");
        });
    })
});

router.get("/login", function(req, res){
    res.render("authentication/login");
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    }), function(req, res){
});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged out.");
    res.redirect("/");
});

router.get("/users/:user_id", function(req, res){
    User.findById(req.params.user_id, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", "An error occured.");
            return res.redirect("/courses");
        }
        if(!user){
            req.flash("error", "An error occured.");
            return res.redirect("/courses");
        }
        Course.find().where("meta.author").equals(user._id).populate("meta.author").exec(function(err, courses){
            if(err){
                console.log(err);
                req.flash("error", "An error occured.");
                return res.redirect("/courses");
            }
            res.render("users/show", {user: user, courses: courses});
        });
    });
});

// Edit profile form
router.get("/users/:user_id/edit", middleware.checkUserOwnership, function(req, res){
    User.findById(req.params.user_id, function(err, user){
        if(err || !user){
            req.flash("error", "An error occured.");
            return res.redirect("/courses");
        }
        res.render("users/edit", {user: user})
    });
});

// Edit profile
router.put("/users/:user_id", middleware.checkUserOwnership, function(req, res){
    User.findById(req.params.user_id, function(err, user){
        if(err || !user){
            req.flash("error", "An error occured.");
            return res.redirect("/courses");
        }
        User.findByIdAndUpdate(req.params.user_id, req.body.user, function(err, section){
            if(err){
                console.log(err);
                req.flash("error", "An error occured.");
                res.redirect("/courses");
            } else {
                req.flash("success", "Updated profile details.")
                res.redirect("/users/" + req.params.user_id);
            }
        });
    });
});

module.exports = router;