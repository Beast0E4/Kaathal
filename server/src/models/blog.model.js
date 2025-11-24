const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    cover_image: {
        url: { type: String },
    },
    title: {
        type: String,
        required: [true, 'Name cannot be empty']
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true
    },
    tags: [{
        type: String, required: true 
    }],
    content: {
        type: String,
        required: [true, 'Blog cannot be empty'],
    },
    slug: {
        type: String,
        required: [true, 'Slug cannot be empty'],
    },
    theme: {
        type: String,
        required: [true, 'Theme cannot be empty'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;