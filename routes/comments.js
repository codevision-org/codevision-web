var express = require("express"),
    router = express.Router({mergeParams: true}),
    Course = require("../models/course"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");

// Show form for comments that are about to be created
// router.get("/new", middleware.isLoggedIn, function(req, res){
//     Course.findById(req.params.id, function(err, course){
//         if(err){
//             console.log(err);
//             req.flash("error", "An error occured.");
//             res.redirect("/courses");
//         } else {
//             res.render("comments/new", {course: course});
//         }
//     });
// });

// Create comment
router.post("/", middleware.isLoggedIn, function(req, res){
    Course.findById(req.params.id, function(err, course){
        if(err){
            console.log(err);
            req.flash("error", "An error occured.");
            res.redirect("/courses");
        } else {

            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                    req.flash("error", "An error occured.");
                    res.redirect("/courses");
                } else {
                    comment.meta = {
                        author: req.user._id,
                        createdAt: Date.now()
                    }
                    comment.save();
                    course.comments.push(comment);
                    course.save();
                    req.flash("success", "Comment added.");
                    res.redirect("/courses/" + course._id);
                }
            });
        }
    });
});

// Show for comments that are about to get edited
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Course.findById(req.params.id, function(err, course){
        if(err || !course){
            req.flash("error", "An error occured.");
            return res.redirect("/courses");
        }
        Comment.findById(req.params.comment_id, function(err, comment){
            if(err){
                console.log(err);
                req.flash("error", "An error occured.");
                res.redirect("/courses");
            } else {
                res.render("comments/edit", {course_id: req.params.id, comment: comment})
            }
        });
    });
});

// Edit comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Course.findById(req.params.id, function(err, course){
        if(err || !course){
            req.flash("error", "An error occured.");
            return res.redirect("/courses");
        }
        Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
            if(err){
                console.log(err);
                req.flash("error", "An error occured.");
                res.redirect("/courses");
            } else {
                req.flash("success", "Updated comment.")
                res.redirect("/courses/" + req.params.id);
            }
        });
    });
});

// Delete comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            req.flash("error", "An error occured.");
            res.redirect("/courses");
        } else {
            req.flash("success", "Comment deleted.");
            res.redirect("/courses/" + req.params.id);
        }
    });
});

module.exports = router;