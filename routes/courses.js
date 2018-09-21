var express = require("express"),
    router = express.Router();
    Course = require("../models/course"),
    User = require("../models/user"),
    middleware = require("../middleware");

// Show all courses
router.get("/", function(req, res){
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Course.find({title: regex})
        .populate("meta.author")
        .exec(function(err, courses){
            if(err){
                console.log(err);
                req.flash("error", "An error occured.");
                res.redirect("/courses");
            } else {
                if(courses.length < 1){
                    req.flash("error", "No results found. Maybe try another search term?");
                    res.redirect("/courses");
                } else {
                    res.render("courses/index", {courses: courses});
                }
            }
        });
    } else {
        Course.find({})
        .populate("meta.author")
        .exec(function(err, courses){
            if(err){
                console.log(err);
                req.flash("error", "An error occured.");
                res.redirect("/courses");
            } else {
                res.render("courses/index", {courses: courses})
            }
        });
    }
});

// Show form for courses that are about to be created
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("courses/new");
});

// Create new course
router.post("/", middleware.isLoggedIn, function(req, res){
    var course = req.body.course;
    course.meta = {
        author: req.user._id
    };

    Course.create(course, function(err, newCourse){
        if(err){
            console.log(err);
            req.flash("error", "An error occured.");
            res.redirect("/courses");
        } else {
            req.flash("success", "Course created. Now add some sections with content inside. When you're finished, make your course public.");
            res.redirect("/courses/" + newCourse._id);
        }
    });
});

// Show more specific information about a certain course
router.get("/:id", function(req, res){
    Course.findById(req.params.id)
    .populate({
        path: "sections",
        populate: {path: "meta.author"}
    })
    .populate({
        path: "comments",
        populate: {path: "meta.author"}
    })
    .populate("meta.author")
    .exec(function(err, course){
        if(err || !course){
            console.log(err);
            req.flash("error", "An error occured.");
            res.redirect("/courses");
        } else {
            res.render("courses/show", {course: course});
        }
    });
});

// Show form for courses that are about to get edited
router.get("/:id/edit", middleware.checkCourseOwnership, function(req, res){
    Course.findById(req.params.id, function(err, course){
        if(err){
            console.log(err);
            req.flash("error", "An error occured.");
            res.redirect("/courses");
        } else {
            res.render("courses/edit", {course: course});
        }
    });
});

// Edit course
router.put("/:id", middleware.checkCourseOwnership, function(req, res){
    Course.findByIdAndUpdate(req.params.id, req.body.course, function(err, course){
        if(err){
            console.log(err);
            req.flash("error", "An error occured.");
            res.redirect("/courses");
        } else {
            req.flash("success", "Course edited.");
            res.redirect("/courses/" + req.params.id);
        }
    });
});

// Destroy course
router.delete("/:id", middleware.checkCourseOwnership, function(req, res){
    Course.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            req.flash("error", "An error occured.");
            res.redirect("/courses");
        } else {
            req.flash("success", "Course deleted.");
            res.redirect("/courses");
        }
    })
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;