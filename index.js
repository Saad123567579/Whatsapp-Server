import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import userRouter from "./router/User.js";
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




const server = app.listen(process.env.PORT,()=>console.log("Server Started"));

const io = new Server(server,{
    cors:{origin:"http://localhost:3000"}
});

io.on("connection",(socket)=>{
    socket.on("error", (error) => {
        console.error("Socket error:", error);
      });
    console.log("A new user has connected ",socket.id);
})
io.on('disconnect', (socket) => {
    // Perform cleanup tasks or logging
    console.log('A client has disconnected:', socket.id);
});