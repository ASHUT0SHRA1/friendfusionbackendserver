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

    }
}, 
{timestamps  : true }
)

module.exports = mongoose.model('User' , userSchema)