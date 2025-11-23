const Blog = require("../models/blog.model");

const createBlog = async (data, path) => {
    const response = {};
    try {
        const blog = await Blog.create ({...data, cover_image: {url: path}});

        if (!blog) {
            response.error = "Blog not created";
        } else {
            response.success = true;
            response.blog = blog;
        }
    } catch (error) {
        response.error = error.message;
    }
    return response;  
};

const get_blog = async (data) => {
    const response = {};
    try {
        const blog = await Blog.findOne ({ slug: data.slug });

        if (!blog) {
            response.error = "Blog not created";
        } else {
            response.success = true;
            response.blog = blog;
        }
    } catch (error) {
        response.error = error.message;
    }
    return response;  
};

const getAllBlogs = async (data) => {
    const response = {};
    try {
        const blog = await Blog.find();

        if (!blog) {
            response.error = "Blog not not found";
        } else {
            response.success = true;
            response.blog = blog;
        }
    } catch (error) {
        response.error = error.message;
    }
    return response;  
};

const deleteBlog = async (data) => {
    const response = {};
    try {
        const blog = await Blog.findOneAndDelete ({slug: data.slug});

        if (!blog) {
            response.error = "Blog not deleted";
        } else {
            response.success = true;
            response.blog = blog;
        }
    } catch (error) {
        response.error = error.message;
    }
    return response;  
};

module.exports = {
    createBlog, get_blog, getAllBlogs, deleteBlog
}