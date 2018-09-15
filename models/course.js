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
            }
        }
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    sections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section"
        }
    ]
});

module.exports = mongoose.model("Course", CourseSchema);