var mongoose = require("mongoose");

var CommentSchema = mongoose.Schema({
    content: String,
    meta: {
        createdAt: Date,
        editedAt: Date,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
});

module.exports = mongoose.model("Comment", CommentSchema);