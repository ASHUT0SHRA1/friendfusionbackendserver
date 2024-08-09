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
            return res.status(500).send({
                success: false,
                message: "user already register with this email "

            })

        }
        const hashedPassword = await hashPassword(password);

        const newUser = await usermodel({ name, email, password: hashedPassword }).save();
        res.status(200).send({
            newUser: newUser,
            success: true,
            message: 'Registration successful please login'
        })

    } catch (error) {
        res.status(500).send({
            message: ' error registering user ', error,
            success : false 
        });
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
                    expiresIn: '12h'
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

const userList = async (req, res) => {
    try {
        const  id  = req.params.userid;
        const currentUser = await usermodel.findById(id);
        const usersentrequest = currentUser.sentFriendRequest;
        const userfriends = currentUser.friends ;
        const friendrequest = currentUser.friendRequest ; 
        const userslist = await usermodel.find({ 
            _id: { $ne: id ,$nin : [...usersentrequest , ...userfriends , ...friendrequest] } 
        
        });
        res.status(200).send({
            userslist ,
            successs  :true ,
            message : 'users list fetched '

        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error
        })
    }
}

const sentFriendRequest = async(req , res) => { 
    try {
        const {userid  , selectedUserid} = req.body; 
        const user = await usermodel.findById(userid);
        if ( user.sentFriendRequest.includes(selectedUserid)) {
            return res.status(400).send({
                success: false,
                message: 'Friend request already sent'
            });
        }
        else{
            await usermodel.findByIdAndUpdate(userid , {
                $push : {sentFriendRequest  : selectedUserid }
            }) 
        }

        await usermodel.findByIdAndUpdate(selectedUserid , {
            $push : { friendRequest: userid}, 
        })

        res.status(200).send({
            success : true , 
            message : 'sent friend request successfully',
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message : "error in sent friend request API ", 
            success : false,
            error 
        })
    }
}

const getfriendRequest = async(req ,res) => {
    try {
        const userId  = req.params.userid;
        //fetch the user document based on the User id
        const user = await usermodel.findById(userId).populate('friendRequest' ,"name email").lean();
        const getfriendrequest = user.friendRequest; 
        const user1 = await usermodel.findById(userId).populate('sentFriendRequest' ,"name email").lean();

        const sentfriendrequest = user1.sentFriendRequest ; 
        res.status(200).send({
            getfriendrequest, 
            sentfriendrequest, 
            success  : true , 
            message : "fetched it successfully"
        })
    
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success :false ,
            message : "error in getting friend request api",
            error
        })
    }
}

const acceptFriendRequest = async(req ,res)=>{
    try {
        const {senderId , recepientId} =  req.body ; 
        const sender = await usermodel.findById(senderId);
        const recepient = await usermodel.findById(recepientId);
        if(sender.friends.includes(recepientId)){
            return res.status(400).send({
                message : 'user already friend', 
                success : false 
            })
        }else{
            sender.friends.push(recepientId);
        }
        if(recepient.friends.includes(senderId)){
            return res.status(400).send({
                message : 'user already friend', 
                success : false 
            })
        }
        else{
            recepient.friends.push(senderId);
        }
        // Remove from sentFriendRequests of sender
        sender.sentFriendRequest.pop(recepientId);
        // sender.sentFriendRequest = sender.sentFriendRequest.filter(id => id !== recepientId);

        // Remove from friendRequests of recepient
        recepient.friendRequest.pop(senderId);


        // Save both users
        await sender.save();
        await recepient.save();

        res.status(200).send({
            message: "Friend request accepted successfully",
            success: true,
        });
        

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message : "Error in accepting friend request api",
            success : false ,
            error 
        })
    }
}

const userFriends = async(req, res)=>{
    try {
        const userid = req.params.userid ; 
        const user= await usermodel.findById(userid).populate('friends' , "name email");
        console.log(user);
        const userfriends = user.friends;
        res.status(200).send({
            success : true , 
            message : 'got user friends list', 
            userfriends 
        }) 
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false , 
            message : 'Error in fetching user friends',

        })
    }
}
module.exports = {
    registerController,
    loginController,
    updateUserController,
    requireSignIn,
    userList,
    getfriendRequest,
    sentFriendRequest,
    acceptFriendRequest, 
    userFriends
}