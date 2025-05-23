import { z } from "zod";

export const usernameValidation= z
.string()
.min(4, "Username Must Be Atleast 4 Characters")
.min(4, "Username Sould Not Be More Than 20 Characters")
.regex(/^[a-zA-Z0-9]+$/    , "Username must not contain special characters")


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:'Invalid E-mail Address'}),
    password: z.string().min(4,{message: "password must be 4 characters"})

})