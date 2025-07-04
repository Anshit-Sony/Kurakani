const asynHandler=require('express-async-handler');
const Chat=require('../Models/ChatModel');
const User = require('../Models/UserModel');
const accessChat=asynHandler(async(req,res)=>{
    const {userId}=req.body
    if(!userId){
        console.log("no userId param sent");
        return res.sendStatus(400);
    }

    var isChat=await Chat.find({
        isGroupChat: false,
        $and: [
            {
                users: {$elemMatch: {$eq: req.user._id}}
            },
            {users: {$elemMatch:{$eq: userId}}}
        ]
    }).populate("users","-password").populate("latestMessage")

    isChat=await User.populate(isChat,{
        path:'latestMessage.sender',
        select:"name pic email"
    })

    if(isChat.length>0){
        res.send(isChat[0]);
    }else{
        var chatData={
            chatName: "sender",
            isGroupChat:false,
            users: [req.user._id,userId]
        }
        try {
            const createdChat=await Chat.create(chatData);
            const fullChat=await Chat.findOne({_id: createdChat._id}).populate("users","-password");
            res.status(200).send(fullChat);

        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
})


const fetchChat=asynHandler(async(req,res)=>{
    try {
        Chat.find({users: {$elemMatch: {$eq: req.user._id}}})
        .populate("users","-password")
        .populate("latestMessage")
        .populate("groupAdmin","-password")
        .sort({updatedAt: -1})
        .then(async(result)=>{
            results=await User.populate(result,{
                path:'latestMessage.sender',
                select:"name email pic"
            })
            res.status(200).send(results)
        })
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

const createGroupChat=asynHandler(async(req,res)=>{
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message: "please fill all the details."})
    }

    var users=JSON.parse(req.body.users)
    if(users.length<2){
        return res.status(400).send({message: "more than two users required to make a group chat."});
    }

    users.push(req.user);
    try {
        const groupChat=await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        })

        const fullGroupChat=await Chat.findOne({_id: groupChat._id})
        .populate("users","-password")
        .populate("groupAdmin","-password")

        res.status(200).json(fullGroupChat)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const renameGroup=asynHandler(async(req,res)=>{
    const {chatId, chatName}=req.body;

    const updatedChat=await Chat.findByIdAndUpdate(chatId,{
        chatName,
    },
    {
        new: true,
    }).populate("users","-password")
    .populate("groupAdmin","-password");

    if(!updatedChat){
        res.status(400)
        throw new Error("Chat not found")
    }else{
        res.json(updatedChat)
    }

})

const addToGroup=asynHandler(async(req,res)=>{
    const {chatId, userId}=req.body;

    const added=await Chat.findByIdAndUpdate(chatId,{
        $push:{users: userId}
    },{new: true})
    .populate("users","-password")
    .populate("groupAdmin","-password")

    if(!added){
        res.status(400)
        throw new Error("Unable to add user")
    }else{
        res.json(added)
    }
})

const removeFromGroup=asynHandler(async(req,res)=>{
    const {chatId, userId}=req.body;

    const removed=await Chat.findByIdAndUpdate(chatId,{
        $pull:{users: userId}
    },{new: true})
    .populate("users","-password")
    .populate("groupAdmin","-password")

    if(!removed){
        res.status(400)
        throw new Error("Unable to add user")
    }else{
        res.json(removed)
    }
})
module.exports={accessChat,fetchChat, createGroupChat, renameGroup, addToGroup, removeFromGroup}