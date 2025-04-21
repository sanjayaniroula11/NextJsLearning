import {z} from 'zod'

export const messageSchema = z.object({
    content:z
    .string()
    .min(4, {message: 'content must be atleast 4 characters.'})
    .min(300, {message: 'content must be no longer than 300 characters.'})
})