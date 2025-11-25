const Blog = require("../models/blog.model");
const { deleteImages } = require('../config/cloud.config');

const createBlog = async (data, file) => {
    const response = {};
    try {
        if (!file) {
            response.error = "Cover image is required"; return response;
        }

        const blog = await Blog.create ({...data, cover_image: {url: file?.path, filename: file?.filename}});

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
        const blog = await Blog.findOne ({ slug: data.slug }).populate("userId", "id username image");

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

const getAllBlogs = async () => {
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
            try {
                console.log (blog);
                if (blog.cover_image?.filename) await deleteImages ([blog.cover_image?.filename]);
            } catch (cloudError) {
                console.log("Error deleting media:", cloudError);
            }

            response.success = true;
            response.blog = blog;
        }
    } catch (error) {
        response.error = error.message;
    }
    return response;  
};

const updateBlog = async (data, path) => { 
    const response = {};
    try {
        const blogData = await Blog.find({slug: data.slug});
        if (!blogData) {
            response.error = "Blog not found!";
            return response;
        }

        if (path) data = {...data, cover_image: {
            url: path,
            filename: "image"}};

        const updatedBlog = await Blog.findOneAndUpdate(
            {slug: data.slug}, 
            data,
            {new : true}
        )
        response.blog = updatedBlog;
        return response;
    } catch (error) {
        response.error = error.message;
        return response
    }
};

module.exports = {
    createBlog, get_blog, getAllBlogs, deleteBlog, updateBlog
}