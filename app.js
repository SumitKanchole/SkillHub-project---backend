import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRouter from "./routes/user.route.js";
import MatchRouter from "./routes/match.route.js";
import ChatRouter from "./routes/ChatMessage.route.js";

dotenv.config();
const app = express();
mongoose.connect(process.env.DB_URL)
    .then(result => {
        console.log("Database Connected Successfully..",result);
        app.use(cookieParser())
        app.use(cors({ origin: "http://localhost:3001",
      credentials: true}));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use("/user", UserRouter);
        app.use("/matchrequest", MatchRouter);
        app.use("/chat",ChatRouter);
        app.listen(process.env.PORT, () => {
            console.log("Server Started....");
            
        })
    }).catch(err => {
        console.log("Database Connection failed...");
        
    })