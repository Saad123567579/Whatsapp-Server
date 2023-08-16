import {checkAuth,createUser} from "../controller/User.js";
import express from "express";
const router = express.Router();
router.post('/check',checkAuth);
router.post('/createuser',createUser);

export default router;