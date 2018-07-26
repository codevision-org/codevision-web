var express = require("express"),
    router = express.Router({mergeParams: true}),
    Course = require("../models/course"),
    Section = require("../models/section"),
    middleware = require("../middleware");

// Show form for sections that are about to be created
router.get("/new", middleware.checkCourseOwnership, function(req, res){
    Course.findById(req.params.id, function(err, course){
        if(err){
            console.log(err);
            req.flash("error", "An error occured.");
            res.redirect("/courses");
        } else {
            res.render("sections/new", {course: course});
        }
    });
});

// Create section
router.post("/", middleware.checkCourseOwnership, function(req, res){
    Course.findById(req.params.id, function(err, course){
        if(err){
            console.log(err);
            req.flash("error", "An error occured.");
            res.redirect("/courses");
        } else {
            var section = req.body.section;
            section.meta = {
                author: {
                    id: req.user._id,
                    username: req.user.username,
                    avatar: req.user.avatar
                }
            }
            Section.create(section, function(err, section){
                if(err){
                    console.log(err);
                    req.flash("error", "An error occured.");
                    res.redirect("/courses");
                } else {
                    course.sections.push(section);
                    course.save();
                    req.flash("success", "Section added.");
                    res.redirect("/courses/" + course._id);
                }
            });
        }
    });
});

// Show more specific information about a certain section
router.get("/:section_id", function(req, res){
    Course.findById(req.params.id, function(err, course){
        if(err){
            console.log(err);
            req.flash("error", "An error occured.");
            res.redirect("/courses");
        } else {
            Section.findById(req.params.section_id, function(err, section){
                if(err || !section){
                    console.log(err);
                    req.flash("error", "An error occured.");
                    res.redirect("/courses");
                } else {
                    res.render("sections/show", {course: course, section: section});
                }
            });
        }
    });
});

// Show for sections that are about to get edited
router.get("/:section_id/edit", middleware.checkSectionOwnership, function(req, res){
    Course.findById(req.params.id, function(err, course){
        if(err || !course){
            req.flash("error", "An error occured.");
            return res.redirect("/courses");
        }
        Section.findById(req.params.section_id, function(err, section){
            if(err){
                console.log(err);
                req.flash("error", "An error occured.");
                res.redirect("/courses");
            } else {
                res.render("sections/edit", {course_id: req.params.id, section: section})
            }
        });
    });
});

// Edit section
router.put("/:section_id", middleware.checkSectionOwnership, function(req, res){
    Course.findById(req.params.id, function(err, course){
        if(err || !course){
            req.flash("error", "An error occured.");
            return res.redirect("/courses");
        }
        Section.findByIdAndUpdate(req.params.section_id, req.body.section, function(err, section){
            if(err){
                console.log(err);
                req.flash("error", "An error occured.");
                res.redirect("/courses");
            } else {
                req.flash("success", "Updated section.")
                res.redirect("/courses/" + req.params.id + "/sections/" + req.params.section_id);
            }
        });
    });
});

// Delete section
router.delete("/:section_id", middleware.checkSectionOwnership, function(req, res){
    Section.findByIdAndRemove(req.params.section_id, function(err){
        if(err){
            console.log(err);
            req.flash("error", "An error occured.");
            res.redirect("/courses");
        } else {
            req.flash("success", "Section deleted.");
            res.redirect("/courses/" + req.params.id);
        }
    });
});

module.exports = router;