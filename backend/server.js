const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const connectMongo = require('./config/db');
const userRoute=require('./routes/userRoute');
const chatRoute=require('./routes/chatRoute');
const messageRoute=require('./routes/messageRoute')
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const path=require('path')

dotenv.config();

connectMongo();
const port=process.env.PORT || 3000;
const app=express();

const corsOption={
    origin:["http://localhost:5173",
           "https://kurakani-frontend.onrender.com"],
};

app.use(express.json());
app.use(cors(corsOption));

app.use('/api/user', userRoute);
app.use('/api/chat', chatRoute);
app.use('/api/message', messageRoute);


app.get('/',(req,res)=>{
    res.send("Running Successfully...")
})




app.use(notFound);
app.use(errorHandler);
const server=app.listen(port,()=>console.log(`server listening on ${port}`));

const io=require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:["http://localhost:5173",
           "https://kurakani-frontend.onrender.com"],
    }
})

io.on("connection",(socket)=>{
    socket.on("setup",(userData)=>{
        socket.join(userData._id)
        socket.emit("connected");
    })

    socket.on("join chat",(chatroom)=>{
        socket.join(chatroom);
    })

    socket.on("new message",(newMessageReceived)=>{
        var chat=newMessageReceived.chat;

        if(!chat.users) return console.log("chat user not defined");
         
        chat.users.forEach(user=>{
            if(user._id==newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received",newMessageReceived);
        })
    })

    socket.on("typing", (room) => socket.to(room).emit("typing"));
    socket.on("stop typing", (room) => socket.to(room).emit("stop typing"));


    socket.off("setup",()=>{
        socket.leave(userData._id)
    })
})
