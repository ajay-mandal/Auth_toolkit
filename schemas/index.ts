import * as z from 'zod';

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Must be a valid email"
    }),
    password: z.string()
});
