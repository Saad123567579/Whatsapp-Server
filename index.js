import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import userRouter from "./router/User.js";
import messageRouter from "./router/Message.js";
dotenv.config();
import cookieParser from "cookie-parser"; 
import {Server } from "socket.io";

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));


app.use(express.json());
app.use(cookieParser());

app.use('/user',userRouter);
app.use('/message',messageRouter);

const server = app.listen(process.env.PORT,()=>console.log("Server Started"));

const io = new Server(server,{
    cors:{origin:"http://localhost:3000"}
});
global.onlineUsers = new Map();

io.on("connection",(socket)=>{
    var socketId = socket.id;
    socket.on("error", (error) => {console.error("Socket error:", error);});
    global.chatSocket = socket;  
    console.log("A new user has connected ",socket.id);
    socket.on("adduser",(userid)=>{
        onlineUsers.set(userid,socket.id);
        console.log(onlineUsers);
        socket.broadcast.emit("getOnlineusers",Array.from(onlineUsers.keys()));
    })
    socket.on("disconnect", () => {
        onlineUsers.forEach((value, key) => {
            if (value === socketId) {
                onlineUsers.delete(key);
                console.log("The id ", key, " was found and has been removed from the connection");
                console.log(onlineUsers);
                socket.broadcast.emit("getOnlineusers",Array.from(onlineUsers.keys()));
            } else {console.log("no socket id could be found");}
        });
    })
    socket.on("getcurrentusers",(userid)=>{
        if(onlineUsers.has(userid)){
            io.to(onlineUsers.get(userid)).emit("herecurrentusers",Array.from(onlineUsers.keys()))
        }
    })
    socket.on("typing",(obj)=>{
        const {from,to} = obj;
        if(onlineUsers.has(from) && onlineUsers.has(to)){
            io.to(onlineUsers.get(to)).emit("typing");
        }
        setTimeout(() => {
            io.to(onlineUsers.get(to)).emit("herecurrentusers",Array.from(onlineUsers.keys()))
        }, 2000);
    })

    socket.on("send-msg",(obj)=>{
        const {senderId,receiverId} = obj;
        if(senderId && receiverId){
            if(onlineUsers.get(senderId)) io.to(onlineUsers.get(senderId)).emit("receive-msg");
            if(onlineUsers.get(receiverId)) io.to(onlineUsers.get(receiverId)).emit("receive-msg");
            
        }
    })
    socket.on("update-msg-log",(userId)=>{
        if(onlineUsers.get(userId)) io.to(onlineUsers.get(userId)).emit("update-your-msg-log");
    })
   
    

})