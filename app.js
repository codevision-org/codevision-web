var express = require("express"),
    app = express();
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local");

// Models
var Tutorial = require("./models/tutorial"),
    Comment = require("./models/comment"),
    User = require("./models/user");

// Routes
var indexRoutes = require("./routes/index"),
    tutorialsRoutes = require("./routes/tutorials"),
    commentRoutes = require("./routes/comments");

// Mongoose configuration
mongoose.connect(process.env.DATABASEURL);

// Express configuration
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

// Passport configuration
app.use(require("express-session")({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Publish user and flash messages to all templates.
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
});

// Expose all routes
app.use(indexRoutes);
app.use("/tutorials", tutorialsRoutes);
app.use("/tutorials/:id/comments", commentRoutes)

// Start the server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started.");
});