import {checkAuth,createUser,Getuser} from "../controller/User.js";
import express from "express";
const router = express.Router();
router.post('/check',checkAuth);
router.post('/createuser',createUser);
router.get('/getuser',Getuser);

export default router;