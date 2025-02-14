import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt, { genSaltSync } from "bcrypt";
import validator from "validator";

//register user

const registerUser= async(req , res)=>{
     const {name,password,email}=req.body
     try{
        const exists=await userModel.findOneAndReplace({email});
        if(exists){
            return res.json({success:false,message:"User already exists"})
        }
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please Enter Valid Email ! "})
        }
        if(password.length<8){
            return res.json({success:false,message:"Please Enter a Strong password"});
        }
        //hasing password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser=new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

        const user =await newUser.save();
        const token=createToken(user._id);
        res.json({success:true,token})
     }catch(error){
        consolr.log(error)
        res.json({success:false,message:"error"});
     }
}

//login user

const loginUser=async (req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await userModel.findOne({email});
        console.log(user);
        if(!user){
            return res.json({success:false,message:"User not Exists"})
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false,message:"Invalid password"});

        }
        const token=createToken(user._id);
        res.json({success:true,token});

    }catch(error){
         console.log(error);
         return res.json({success:false,message:"error"})
    }
}

// craete token
const createToken =(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

export {loginUser,registerUser};