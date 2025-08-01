import { createProfile, CreateUser, deleteProfile, getProfile, LogIn, logOut, VerifyEmail } from "../controller/user.controller.js";
import express from "express";
import { body } from "express-validator";
import { auth } from "../middleware/auth.js";
import multer from "multer";
const upload = multer({ dest: "public/profile" });

const router = express.Router();

router.post("/", body("name", "name is required").notEmpty(),
    body("name", "Only Alphabets are allowed").isAlpha(),
    body("email", "email id is required").notEmpty(),
    body("email", "invalid email id").isEmail(),
    body("password", "password is required").notEmpty(),
    body("confirmPassword", "password is required").notEmpty(),
    body("contact", "contact number is required").notEmpty(),
    body("contact", "only digits are allowed").isNumeric(), CreateUser);

router.post("/login", LogIn);
router.post("/verification", VerifyEmail);
router.post("/logout", auth, logOut);
router.patch("/profile/:userId",auth, upload.single("imageName"), createProfile);
router.get("/getprofile", auth, getProfile);
router.delete("/delete/:userId", deleteProfile);
export default router;