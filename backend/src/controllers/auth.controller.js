import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import Cloudnary from "../lib/cloudnary.js"

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (password.length < 6) {
            return res.send(400).json({ message: "Password must be at least 6 Charactor" })
        }

        const user = await User.findOne({ email });

        if (user) return res.send(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            });
        } else {
            res.status(400).json({ message: "Invaild user data" })
        }


    } catch (error) {
        console.log(`Messges from the signUp controller ${error.message}`);
        res.status(500).json(error)
    }
};

export const login =async (req, res) => {
   const {email , password} = req.body ; 

   try{ 
    const user = await User.findOne({email}); 

    if(!user){ 
        return res.status(400).json({message: "Invaild Email"}); 
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect){ 
            return res.status(400).json({message: "Invaild Password"}); 
        }

        generateToken(user._id,res)

        res.status(200).json({ 
            _id: user._id,
            fullName: user.fullName,
            email:user.email,
            profilePic: user.profilePic,
        });
   } catch(error){ 
    console.log("Error in login controller " , error.message);
    return res.status(500).json({message: "Internal Server Error"});
   }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message: "Logged Out Successfully"})
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const updateProfile = async (req, res)=>{ 
    try {
        const {profilePic} = req.body; 

        const userId = req.user._id

        if(!profilePic){ 
            return res.status(400),json({message: "Profile pic is required"})
        }

        const uploadResponse = await Cloudnary.uploader.upload(profilePic)
        const updateUser = await User.findByIdAndUpdate(userId, {profile: uploadResponse.seure_url},{new:true})
       
        res.status(200).json(updateUser);

    } catch (error) {
        console.log("error in update profile:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const checkAuth = (req, res)=>{ 
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in chechAuth controller ", error.message);  
        return res.status(500).json({message: "Internal Server Error"});
    }
}