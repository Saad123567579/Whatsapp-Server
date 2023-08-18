import {checkAuth,createUser,Getuser,Getallusers} from "../controller/User.js";
import express from "express";
const router = express.Router();
router.post('/check',checkAuth);
router.post('/createuser',createUser);
router.get('/getuser',Getuser);
router.get('/getalluser',Getallusers);

export default router;