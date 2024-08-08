const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type : String , 
        require : [true , 'please add name'], 
    }, 
    email : {
        type : String , 
        require : [true, 'please add email' ], 
        unique : true , 
    }, 
    password : {
        type : String , 
        require : [true , 'please add password']

    },
    image: {
        type: String,
        // required: true,
    },
    friendRequest: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

    ],
    sentFriendRequest: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
}, 
{timestamps  : true }
)

module.exports = mongoose.model('User' , userSchema)