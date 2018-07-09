var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    async = require("async"),
    nodemailer = require("nodemailer"),
    crypto = require("crypto");

// Root route
router.get("/", function(req, res){
    res.render("landing");
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

module.exports = router;