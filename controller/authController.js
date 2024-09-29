import {prisma} from "../index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";



export const signUp = catchAsync(async (req,res,next)=>{
  
  const {username,email,password} = req.body;  
    const emailExist = await prisma.user.findUnique({
      where:{
        email
      }
    });
    if(emailExist){
      res.status(501).json({
        message:'Email is already in used'
      })
    }
    const hashedPassword = await bcrypt.hash(password,12);
    const newUser = await prisma.user.create({
      data:{
        username,
        email,
        password:hashedPassword
      }
    })
    const token = jwt.sign({userId:newUser?.id},process.env.SECRET_KEY,{expiresIn:process.env.EXPIRES_AT});
    res.status(200).json({
      message:"Signed Up Successfully",
      newUser,
      token
    })
});

export const login = catchAsync(async (req,res,next)=>{
  
  const {email,password} = req.body;

    const userExit = await prisma.user.findUnique({
      where:{
        email
      }
    });
    if(!userExit){
      res.status(404).json({
        message:'User Email is not found'
      })
    }
    const comparedPassword = await bcrypt.compare(password,userExit?.password);
    if(!comparedPassword){
      res.status(500).json({
        message:'Password is not correct'
      })
    }
    const token = jwt.sign({userId:userExit?.id},process.env.SECRET_KEY,{expiresIn:process.env.EXPIRES_AT});
    res.status(200).json({
      message:'Logged in successfully',
      token
    })
  
})

export const protect = catchAsync(async (req,res,next)=>{
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      const token = req.headers.authorization.split(' ')[1];
      if(!token){
        return next(new AppError("No token provided"));
      }
      const decoded = jwt.verify(token,process.env.SECRET_KEY);
      
      req.user = decoded;
      next();
    }
  
})