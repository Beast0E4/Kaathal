const { StatusCodes } = require('http-status-codes');
const blogService = require('../services/blog.service');

const createBlog = async(req, res) => {
    const response = await blogService.createBlog (req.body, req.file.path);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message : "Could not create the blog",
            error : response.error
        })
    }
    return res.status(StatusCodes.CREATED).send({
        message : "Successfully created the blog",
        blogsData: response
    })
}

const get_blog = async(req, res) => {
    const response = await blogService.get_blog (req.params);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message : "Could not create the blog",
            error : response.error
        })
    }
    return res.status(StatusCodes.CREATED).send({
        message : "Successfully created the blog",
        blogsData: response
    })
}

const getAllBlogs = async(req, res) => {
    const response = await blogService.getAllBlogs ();
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message : "Could not create the blog",
            error : response.error
        })
    }
    return res.status(StatusCodes.CREATED).send({
        message : "Successfully created the blog",
        blogsData: response
    })
}

const deleteBlog = async(req, res) => {
    const response = await blogService.deleteBlog (req.params);
    console.log (response);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message : "Could not create the blog",
            error : response.error
        })
    }
    return res.status(StatusCodes.CREATED).send({
        message : "Successfully created the blog",
        blogsData: response
    })
}

const uploadImage = async(req, res) => {
    if(!req.file.path){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message : "Could not create the blog",
            error : "Error"
        })
    }
    return res.status(StatusCodes.CREATED).send({
        message : "Successfully created the blog",
        imagePath: req.file.path
    })
}

module.exports = { createBlog, get_blog, getAllBlogs, deleteBlog, uploadImage }