"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/zod/validator";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if(!validatedFields.success) {
        return {error: "Invalid fields!"}
    }

    const { email, password, name } = validatedFields.data;
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUser = await getUserByEmail(email);
    if(existingUser){
        return { error: "Email already in use"}
    }

    await db.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
        }
    });

    // TODO: Send verification token email

    return { success: "User created!"}
}
