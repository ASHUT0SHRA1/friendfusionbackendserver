const express = require('express'); 
const {registerController, loginController, updateUserController, requireSignIn} = require('../controllers/registerController');

const router = express.Router(); 


router.post('/register' , registerController) 
router.post('/login', loginController)
router.put('/update' , requireSignIn ,  updateUserController);

module.exports = router ; 