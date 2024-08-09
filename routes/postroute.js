const express = require('express');
const { requireSignIn } = require('../controllers/registerController');
const { createPost, getallpostcontroller, getuserPost, deletepostController, updatePostController } = require('../controllers/postController');

const router = express.Router(); 

// create post route 
router.post('/create-post' , requireSignIn, createPost);
router.get('/get-all-post' ,  getallpostcontroller );
router.get('/user-post/:id'  , requireSignIn ,  getuserPost);
router.delete('/delete-post/:id' , requireSignIn,  deletepostController);
router.put('/update-post/:id' ,requireSignIn ,  updatePostController )
module.exports = router ; 