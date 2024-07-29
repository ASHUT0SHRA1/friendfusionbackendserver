const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title : {
        type : String , 
        require : [true  , 'please add post title'], 
    }, 
    description : {
        type : String , 
        require : [true , 'Please add post description'], 
    }, 
    postedBy : {
        type : mongoose.Schema.ObjectId, 
        ref : 'User', 
        require : true 
    }
}, {timestamps : true })

module.exports  =   mongoose.model('Post' , PostSchema)