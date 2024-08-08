const messageModel = require('../models/message');
const usermodel = require('../models/usermodel');

const getmessage = async(req, res)=>{
    console.log("I am coming here or not")
    try {
        const {userid, selecteduserid} = req.params;
        const recepientId = await usermodel.findById(selecteduserid);
        const senderId = await usermodel.findById(userid);
        const messages = await messageModel.find({
            $or : [
                {senderId : senderId , recepientId : recepientId},
                { senderId: recepientId, recepientId: senderId },

            ]
                }).populate("senderId" , "_id name" )
        res.status(200).send({
            recepientId , 
            senderId , 
            messages , 
            message : 'successfully getting user id and selecteduser id ',
            success : false ,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success : false , 
            message : "error in getting message api",
            error
        })
    }
}
const sendmessage = async(req, res)=>{
    try {
        const {userid, selecteduserid} = req.params;
        const {messageType , messageText}  = req.body ; 
        const newmessage = new messageModel({
            senderId : userid, 
            recepientId : selecteduserid , 
            messageType, 
            message : messageText , 
            timestamp : new Date() , 
            imageUrl: messageType === "image" ? req.file.path : null,
        })
        await newmessage.save();
        res.status(200).send({
            message  : "Message sent successfully", 
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error, 
            success : false , 
            message : 'error in sendmessage api'
        })
    }
}
module.exports = {
    getmessage, 
    sendmessage
}