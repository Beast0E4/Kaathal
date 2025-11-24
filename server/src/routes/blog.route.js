const express = require('express');
const blogController = require ('../controllers/blog.controller')
const { isUserAuthenticated } = require('../validators/authenticate.user');
const { uploadSingleImage } = require('../config/cloud.config');

const blogRoutes = express.Router();

blogRoutes.post('/create', isUserAuthenticated, uploadSingleImage, blogController.createBlog);
blogRoutes.get('/:slug', blogController.get_blog);
blogRoutes.get('/', blogController.getAllBlogs);
blogRoutes.delete('/:slug', isUserAuthenticated, blogController.deleteBlog);
blogRoutes.post('/uploadImage', isUserAuthenticated, uploadSingleImage, blogController.uploadImage);
blogRoutes.patch ('/', isUserAuthenticated, uploadSingleImage, blogController.updateBlog);

module.exports = blogRoutes