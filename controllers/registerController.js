const { hashPassword, comparePassword } = require("../helpers/authhelper");
const usermodel = require("../models/usermodel");
const JWT = require('jsonwebtoken');
var { expressjwt: jwt } = require("express-jwt");

const requireSignIn = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]

})
const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const exisitingUser = await usermodel.findOne({ email: email });
        if (exisitingUser) {
            res.status(500).send({
                success: false,
                message: "user already register with this email "

            })

        }
        const hashedPassword = await hashPassword(password);

        const newUser = await usermodel({ name, email, password: hashedPassword }).save();
        return res.status(201).send({
            newUser: newUser,
            success: true,
            message: 'Registration successful please login'
        })

    } catch (error) {
        res.status(500).send({
            message: ' error registering user ', error,
            error: false,
        });
        console.log(error)
    }
}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await usermodel.findOne({ email: email });
        if (!user) {
            console.log("User does not exist please register ")

            res.status(500).send({
                message: "user do not exist please sign up"
            });
        }
        else {
            const match = await comparePassword(password, user.password);
            if (!match) {
                res.status(500).send({
                    // user : user , 
                    success: false,
                    message: "Invalid username or password "
                })
            }
            else {
                const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                })
                user.password = undefined;

                res.status(200).send({
                    user: user,
                    success: true,
                    token: token,
                    message: "user logged in successfully"
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "problem occurred in logging in "
        })
        console.log('error in login ', error);
    }

}

const updateUserController = async (req, res) => {
    try {
        const { name, password, email } = req.body;
        const user = await usermodel.findOne({ email });

        //password validatet
        if (password && password.length < 6) {
            success: false;
            messgae: "password is required and should be 6 character long"
        }

        const hashedPassword = password ? await hashPassword(password) : undefined;
        // updated user 
        const updatedUser = await usermodel.findOneAndUpdate({ email },
            {
                name: name || user.name,
                password: hashedPassword || user.password,
            }, { new: true }
        )
        res.status(200).send({
            success: true,
            message: "update user successfully",
            updatedUser
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in user upadte api",
            error
        })
    }

}
module.exports = {
    registerController,
    loginController,
    updateUserController,
    requireSignIn
}