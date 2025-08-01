import express from "express";
import { ExpressValidator } from "express-validator";
import { auth } from "../middleware/auth.js";
import { getMessages, getUserForTopBar, sendMessages } from "../controller/ChatMessage.controller.js";

const router = express.Router();

router.get("/user", auth, getUserForTopBar);
router.get("/:id", auth, getMessages);
router.post("/send/:id", auth, sendMessages);

export default router;