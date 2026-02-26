"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { LoginSchema } from "@/zod/validator";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { login } from "@/actions/login";
import { resend2FACode } from "@/actions/resend-2fa";
export function LoginForm() {

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with different providers!"
        : "";
    const [ error, setError ] = useState<string | undefined>("");
    const [ success, setSuccess ] = useState<string | undefined>("");
    const [ showTwoFactor, setShowTwoFactor ]  = useState(false);

    const [ isPending, startTransition ] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email:"",
            password:"",
        },
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");
        startTransition(()=>{
            login(values, callbackUrl)
                .then((data)=>{
                    if(data?.error) {
                        form.reset();
                        setError(data.error);
                    }

                    if(data?.success) {
                        form.reset();
                        setSuccess(data.success);
                    }

                    if(data?.twoFactor) {
                        setShowTwoFactor(true);
                    }
                })
                .catch(()=> setError("Something went wrong"));
        });
    }

    const handleResend2FA = () => {
        const email = form.getValues("email");
        if (!email) return;

        setError("");
        setSuccess("");
        
        startTransition(() => {
            resend2FACode({ email })
                .then((data) => {
                    if (data?.error) {
                        setError(data.error);
                    }
                    if (data?.success) {
                        setSuccess(data.success);
                    }
                })
                .catch(() => setError("Failed to resend code"));
        });
    }

    const handleBack = () => {
        setShowTwoFactor(false);
        form.setValue("code", "");
        setError("");
        setSuccess("");
    }

    return(
        <CardWrapper
        headerLabel="Welcome back"
        backButtonLabel="Don't have an account?"
        backButtonHref="/register"
        showSocial
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                >
                    <div className="space-y-4">
                        {showTwoFactor && (
                            <>
                            <FormField
                            control={form.control}
                            name="code"
                            render={({ field })=>(
                                <FormItem>
                                    <FormLabel>Two Factor Code</FormLabel>
                                    <FormControl>
                                        <Input
                                        {...field}
                                        disabled={isPending}
                                        placeholder="123456"
                                        type="text"
                                        maxLength={6}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Enter the 6-digit code sent to your email. Code expires in 5 minutes.
                                    </p>
                                </FormItem>
                            )}
                            />
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBack}
                                    disabled={isPending}
                                    className="flex-1"
                                >
                                    Back
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleResend2FA}
                                    disabled={isPending}
                                    className="flex-1"
                                >
                                    Resend Code
                                </Button>
                            </div>
                            </>
                        )}
                        {!showTwoFactor && (
                            <>
                                <FormField
                                control={form.control}
                                name="email"
                                render={({ field })=>(
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="hi@ajaymandal.me"
                                            type="email"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="password"
                                render={({ field })=>(
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="********"
                                            type="password"/>
                                        </FormControl>
                                        <Button
                                        size="sm"
                                        variant="link"
                                        asChild
                                        className="px-0 font-normal"
                                        >
                                            <Link href="/reset">
                                                Forget password?
                                            </Link>
                                        </Button>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                                />
                            </>
                        )}
                    </div>
                    <FormError message={error || urlError }/>
                    <FormSuccess message={success}/>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {showTwoFactor ? "Confirm" : "Login"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
