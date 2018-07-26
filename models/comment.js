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
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String,
            avatar: String
        }
    },
});

module.exports = mongoose.model("Comment", CommentSchema);