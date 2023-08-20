import {addMessage , getMessages} from "../controller/Message.js";
import express from "express";
const router = express.Router();
router.post('/add',addMessage);
router.get('/get/:from/:to',getMessages);


export default router;