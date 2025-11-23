const { StatusCodes } = require ("http-status-codes");
const userService = require ('../services/user.service');
const jwt = require ('jsonwebtoken')

const signup = async(req,res) =>  {
        const response  = await userService.createUser(req.body);

        if(response.error){
            return res.status(StatusCodes.BAD_REQUEST).send({
                message : "Signup failed",
                error : response.error
            })
        }
        return res.status(StatusCodes.CREATED).send({
            message : "Successfully created the account",
            userData: response
        })
};

const signin = async(req,res) => {
    const response = await userService.validateUser(req.body);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message:"Login failed",
            error : response.error
        })
    }

    const token = jwt.sign({email : req.body.email} , process.env.SECRET_KEY);

    return res.status(StatusCodes.ACCEPTED).json({
        message : "Successfully Login",
        userData : response.userData,
        token : token,
    })
}

const updateUser = async (req,res) =>  {
        const response  = await userService.updateUser(req.body, req.file?.path);

        if(response.error){
            return res.status(StatusCodes.BAD_REQUEST).send({
                message : "Signup failed",
                error : response.error
            })
        }
        return res.status(StatusCodes.CREATED).send({
            message : "Successfully created the account",
            userData: response
        })
};

module.exports = {
    signup, signin, updateUser
}