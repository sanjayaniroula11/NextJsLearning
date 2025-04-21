import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";


import { sendVerificationEmail } from "@/help/sendVerificationEmail";
import { useTransition } from "react";

export async function POST(request: Request) {
   await dbConnect() 

   try {
    const {username, email, password}= await request.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
        username ,
        isVerified: true
    })

    if (existingUserVerifiedByUsername) {
        return Response.json({
            success: false,
            message: 'Username already exists'
        }, {status:400})
    } 
    const existingUserByEmail = await UserModel.findOne({email})

    const verifyCode = Math.floor(100000+ Math.random()* 900000).toString()

    if(existingUserByEmail){
        true // TODO: Back here
    } else{
        const hashedPassword = await bcrypt.hash(password,10)
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() +1)
       const newUser = new UserModel({
             username,
              email,
              password: hashedPassword,
              verifyCode,
              verifyCodeExpiry: expiryDate,
              isVerified: false,
              isAcceptingMessage: true,
              message: []
        })
        await newUser.save()
    }

    //send verification email 

    const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
    )
    if(!emailResponse.success){
        return Response.json({
            success: true,
            message: emailResponse.message
        },{status :500})
    }
    return Response.json({
        success: true,
        message: emailResponse.message
    },{status :500})

   } catch (error) {
    console.error("Error registering use", error)
    return Response.json(
        {
            success: false,
            message: "Error registering user"
        },
        {
            status: 500
        }
    )
   }
}