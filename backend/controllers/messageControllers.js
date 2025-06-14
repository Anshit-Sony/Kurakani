const asynHandler=require('express-async-handler');
const Chat=require('../Models/ChatModel');
const User = require('../Models/UserModel');
const Message = require('../Models/MessageModel');

const sendMessage=asynHandler(async (req, res)=>{
    const {content, chatId}=req.body;

    if(!content || !chatId){
        console.log("Invalid data passed");
        return res.sendStatus(400);
    }

    var newMessage={
        sender:req.user._id,
        content:content,
        chat: chatId,
    }

    try {
        var message=await Message.create(newMessage)
        message=await message.populate("sender", "name pic")
        message=await message.populate("chat")
        message=await User.populate(message,{
            path:'chat.users',
            select:"name pic email"
        })

        await Chat.findByIdAndUpdate(chatId,{
            latestMessage:message,
        })

        res.json(message)
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
})

const allMessage=asynHandler(async (req, res)=>{
    try {
        const messages=await Message.find({chat: req.params.chatId})
            .populate("sender","name pic email")
            .populate("chat");
        
        res.json(messages)
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
})

module.exports={sendMessage, allMessage}