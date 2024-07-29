const postmodel = require("../models/postmodel");

const createPost = async(req, res) => {
    try {
        const {title , description }= req.body ;
        //validate 
        if(!title || !description){
            return res.status(500).send({

                success : false , 
                message : 'Please provide All field', 
                }, 
            )
        } 
        const post = await postmodel({
            title , 
            description , 
            postedBy : req.auth._id
        }).save() ; 

        res.status(201).send({
            success : true , 
            message  : "post created successfully", 
            post  , 
        })
        console.log(req);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success : true , 
            message : 'Error in create Post API', 
            error
        })
    }
}

module.exports = {
    createPost 
}