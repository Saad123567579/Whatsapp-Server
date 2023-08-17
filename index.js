import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import userRouter from "./router/User.js";
dotenv.config();
import cookieParser from "cookie-parser"; 

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/user',userRouter);





app.listen(process.env.PORT,()=>console.log("Server Started"));
