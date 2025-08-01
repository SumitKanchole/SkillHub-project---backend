import { validationResult } from "express-validator";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
// import cloudinary from "../lib/cloudinary.js";
dotenv.config();

export const CreateUser = async (request, response, next) => {
    try {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ error: "Bad request", errorMessages: errors.array() });
        }
        let { name, email, password, contact, confirmPassword } = request.body;

        if (password != confirmPassword) {
            return response.status(404).json({ message: "Password doesn't Matched..." });
        }
        let newUser = await User.create({ name, password, contact, email });
        await SendEmail(email,name);
        return response.status(201).json({ message: "User registered successfully..", user: newUser });

    } catch (err) {
        console.log(err);
        return response.status(500).json({ error: "Internal Server Error..." });
        
    }
}

export const LogIn = async (request, response, next) => {
    try {
        let { email, password } = request.body;

        let user = await User.findOne({ email });

        if (!user.isVerified) {
            return response.status(401).json({ error: "Unauthorized user | Account is not Verified.." });
        }
        if (!user) {
            return response.status(401).json({ error: "Unauthorized user | Email id not found" });
        }
        let status = await bcrypt.compareSync(password, user.password);
        user.password = undefined;
        
        status && response.cookie("token",generateToken(user.userId, user.email ,user.contact));
        return status ? response.status(200).json({ message: "Sign In Successfully.." ,user}) : response.status(401).json({ error: "Unauthorized user | Invalid password" });

    }
    catch (err) {
        console.log(err); 
        return response.status(500).json({ error: "Internal Server Error" })
    }
}



export const VerifyEmail = async (request, response, next) => {
    try {
        const { email } = request.body;
        const updateVerifiedStatus = { $set: { isVerified: true } };

        let result = await User.updateOne({ email },updateVerifiedStatus );
        console.log(result);
        
        return response.status(200).json({message:"Account Verified Successfully..."})
    }
    catch (err) {
        return response.status(500).json({ Error: "Internal Server Error.." });
    }
}


export const SendEmail = (email, name) => {
    return new Promise((resolve, reject) => {
    
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });
          
        let mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Account Verification',
            html: `<img src="https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-528c-61f7-a43e-3c6d419327dd/raw?se=2025-07-04T21%3A26%3A39Z&sp=r&sv=2024-08-04&sr=b&scid=3f45e5e6-d83c-54b7-995a-a8749b99e485&skoid=30ec2761-8f41-44db-b282-7a0f8809659b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-04T14%3A10%3A56Z&ske=2025-07-05T14%3A10%3A56Z&sks=b&skv=2024-08-04&sig=/2B28di6XKv/A8tiYvDBndd8dIMQz%2BzeEZCKUIU9x70%3D" width="300" style="border-radius:8px;"/>
            <h4>Dear ${name}</h4>
            <p>Thank You for ragistration. To Verify your account Please Click on Below Button</p>
            <form method="post" action="http://localhost:3000/user/verification">
              <input type="hidden" name="email" value="${email}"/>
              <button type="submit" style="background-color: green; color:white; width:100px;padding:12px; border: none; border: 1px solid grey; border-radius:10px;">Verify</button>
            </form>
            <p>
            <h6> Thank You </h6> 
            Backend API 
             </p>`
        };
          
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
          
    });
}



export const logOut = async (request, response, next) => {
    try {
        response.clearCookie("token");
        return response.status(200).json({ message: "Sign Out Successfully..." });
    } catch (err) {
        return response.status(500).json({ error: "Internal Server Error..." });
    }
}

export const createProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const { name, contact, bio, country, city, skillToTeach, skillToLearn } = req.body;

    if (req.file) {
      user.profile = req.file.filename;
    }

    user.name = name ?? user.name;
    user.contact = contact ?? user.contact;
    user.bio = bio ?? user.bio;
    user.country = country ?? user.country;
    user.city = city ?? user.city;
    user.skillToTeach = skillToTeach ?? user.skillToTeach;
    user.skillToLearn = skillToLearn ?? user.skillToLearn;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      imagePath: req.file ? req.file.filename : user.profile.imageName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};




export const getProfile = async (request, response, next) => {
    try {
        let getuser = await User.find();
        return response.status(200).json({ message: "Get Profile Successfully...", getuser });
    }
    catch (err) {
        return response.status(500).json({ Error: "Internal Server Error.." });
    }
}


export const deleteProfile = async (request, response, next) => {
    try {
        const userId = request.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(userId);

        return response.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        console.log(err);
        return response.status(500).json({ error: "Internal Server Error..." });
    }
};



const generateToken = (userId, email,contact) => {
    let payload = { userId, email,contact };
    let token = jwt.sign(payload, process.env.TOKEN_SECRET);
    console.log(token);
    return token;
    
}