const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');

dotenv.config(); 
const app = express() ;

connectDB() ; 


app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 8080 ; 
app.get('/', (req , res)=> {
    res.status(200).json({
        message : "Welcome to ful"
    }).send('Hi')
})


//register
app.use('/api/v1/auth'  , require('./routes/userroute'))
app.use('/api/v1/post' , require('./routes/postroute'))
app.use('/api/v1/message' , require('./routes/messageroute'))
// //login
// app.use('api/v1/auth', require('./routes/userroute'))


app.use('api/v1'  ,require('./routes/userroute'))
app.listen(PORT, ()=> { 
    console.log("server working fine")
})
