import { sendMatchRequest,fetchAllRequests } from "../controller/match.controller.js";
import express from "express";
import dotenv from "dotenv";
import { auth } from "../middleware/auth.js";
dotenv.config();

const router = express.Router();

router.post("/send/:id", auth,sendMatchRequest);
router.get("/",auth, fetchAllRequests);
export default router;