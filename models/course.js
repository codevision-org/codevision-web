var mongoose = require("mongoose");

var CourseSchema = mongoose.Schema({
    title: String,
    thumbnail: String,
    description: String,
    content: String,
    meta: {
        createdAt: {
            type: Date,
            default: Date.now
        },
        publishedAt: Date,
        editedAt: Date,
        isPublic: {
            type: Boolean,
            default: false
        },
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
        }
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    pages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Page"
        }
    ]
});

module.exports = mongoose.model("Course", CourseSchema);