const express = require('express');
const { getmessage, sendmessage } = require('../controllers/messageController');
const router = express.Router(); 

router.post('/getmessage/:userid/:selecteduserid' , getmessage);
router.post('/getmessage/:userid/:selecteduserid/message' , sendmessage);


module.exports = router ; 