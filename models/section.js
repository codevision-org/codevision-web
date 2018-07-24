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
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
        }
    }
});

module.exports = mongoose.model("Section", SectionSchema);