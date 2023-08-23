import {addMessage , getMessages,getmyMessages} from "../controller/Message.js";
import express from "express";
const router = express.Router();
router.post('/add',addMessage);
router.get('/get/:from/:to',getMessages);
router.get('/getmy/:from',getmyMessages);


export default router;