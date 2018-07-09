var mongoose = require("mongoose");

var PageSchema = mongoose.Schema({
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

module.exports = mongoose.model("Page", PageSchema);