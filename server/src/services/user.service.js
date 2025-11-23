const User = require ("../models/user.model");
const bcrypt = require('bcrypt');

const createUser = async (data) => { 
    const response  = {};

    try {
        let user = await User.findOne ({ username: data.username });
        if (user) {
            response.error = "Username already exists";
            return response;
        }

        if (!data.email) {
            response.error = "Please start sign up again";
            return response;
        }
        const userObject = {
            image: {
                url: "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png",
                filename :""  
            },
            name :  data.name,
            username : data.username,
            email : data.email , 
            password  : data.password,
        }

        let res = await User.create (userObject);
        response.user = res;

        return response;
    } catch (error) {
        response.error = error.message;
        console.log (error.message);
        return response ; 
    }
};

const validateUser = async (data) => {
    const response = {};
    try {
        let res = await User.findOne({ email: data.email });
        if (!res) {
            response.error = "Invalid username or email";
            return response;
        }

        const result = bcrypt.compareSync(data.password, res.password);
        if (!result) {
            response.error = "Invalid password";
            return response;
        }

        response.userData = res;
        return response;
    } catch (error) {
        console.log (error.message)
        response.error = error.message;
        return response;
    }
};

const updateUser = async (data, path) => { 
    const response = {};
    try {
        console.log (data, path);
        const userData = await User.findById(data.userId);
        if (!userData) {
            response.error = "User not found!";
            return response;
        }

        if (path) data = {...data, image: {
            url: path,
            filename: "image"}};

        const updatedUser = await User.findByIdAndUpdate(
            data.userId, 
            data,
            {new : true}
        )
        response.user = updatedUser;
        return response;
    } catch (error) {
        response.error = error.message;
        return response
    }
};

module.exports = {
    createUser, validateUser, updateUser
}