import {checkAuth} from "../controller/User.js";
import express from "express";
const router = express.Router();
router.post('/check',checkAuth);

export default router;