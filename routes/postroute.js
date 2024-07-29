const express = require('express');
const { requireSignIn } = require('../controllers/registerController');
const { createPost } = require('../controllers/postController');

const router = express.Router(); 

// create post route 
router.post('/create-post' , requireSignIn, createPost);

module.exports = router ; 