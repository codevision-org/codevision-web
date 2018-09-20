var mongoose = require("mongoose");

var SectionSchema = mongoose.Schema({
    title: String,
    thumbnail: String,
    description: String,
    content: String,
    meta: {
        createdAt: {
            type: Date,
            default: Date.now
        },
        editedAt: Date,
        isPublic: {
            type: Boolean,
            default: false
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }
});

module.exports = mongoose.model("Section", SectionSchema);