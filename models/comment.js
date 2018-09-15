var mongoose = require("mongoose");

var CommentSchema = mongoose.Schema({
    content: String,
    meta: {
        createdAt: {
            type: Date,
            default: Date.now
        },
        editedAt: Date,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
});

module.exports = mongoose.model("Comment", CommentSchema);