const express = require('express'); 
const {registerController, loginController, updateUserController, requireSignIn, friendList, userList, sentFriendRequest, getfriendRequest, acceptFriendRequest, userFriends} = require('../controllers/registerController');

const router = express.Router(); 


router.post('/register' , registerController) 
router.post('/login', loginController)
router.put('/update' , requireSignIn ,  updateUserController);
router.get('/userlist/:userid'   , userList);
router.post('/friend-request'  , sentFriendRequest );
router.get('/getfriend-request/:userid' , getfriendRequest)
router.post('/accept-friend-request', acceptFriendRequest); 
router.get('/user/user-friends/:userid' , userFriends)
module.exports = router ; 