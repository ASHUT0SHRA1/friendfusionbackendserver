const postmodel = require("../models/postmodel");

const createPost = async (req, res) => {
    try {
        const { title, description } = req.body;
        //validate 
        if (!title || !description) {
            return res.status(500).send({

                success: false,
                message: 'Please provide All field',
            },
            )
        }
        const post = await postmodel({
            title,
            description,
            postedBy: req.auth._id
        }).save();

        res.status(201).send({
            success: true,
            message: "post created successfully",
            post,
        })
        console.log(req);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: true,
            message: 'Error in create Post API',
            error
        })
    }
}

const getallpostcontroller = async (req, res) => {
    try {
        const posts = await postmodel.find()
            .populate("postedBy", "_id name")
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            message: "Got all the post ",
            posts

        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "didnot get post",
            success: false,
            error
        })
    }
}

const getuserPost = async (req, res) => {
    try {
        // fill it 
        const userposts = await postmodel.find({ postedBy: req.auth._id }).populate("postedBy", "_id name")
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            message: "Got user posts",
            userposts,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "failed to get user post",
            error
        })
    }
}
const deletepostController = async (req, res) => {
    try {
        const { id } = req.params;
        await postmodel.findByIdAndDelete({ _id: id });
        res.status(200).send({
            success: true,
            message: "post deleted successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in delete post api",
            error
        })
    }
}

const updatePostController = async (req, res) => {
    try {
    
        const { title, description } = req.body;
        const updatedPost = await postmodel.findByIdAndUpdate(
          {  _id : req.params.id},
            { title , description },{
                new: true ,
            }
        );
        if (!updatedPost) {
            return res.status(404).send({ message: 'Post not found' });
        }

        res.status(200).send({success : true , message : "updated the post " ,updatedPost});

    } catch (error) {
        console.log(error);
          res.status(500).send({
            success  : false,
            message : "error in update post api ",
            error ,
          });
    }
}


module.exports = {
    createPost,
    getallpostcontroller,
    getuserPost,
    deletepostController,
    updatePostController, 
}