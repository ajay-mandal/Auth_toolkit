"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settings } from "@/actions/settings";
import { Button } from "@/components/ui/button";

import { SettingsSchema } from "@/zod/validator";
import {
    Card,
    CardHeader,
    CardContent,
} from "@/components/ui/card"
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import {
    Form,
    FormField,
    FormControl,
    FormItem,
    FormDescription,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function SettingsPage() {

    const user = useCurrentUser();
    const [error, setError ] = useState<string | undefined>();
    const [success, setSuccess ] = useState<string | undefined>();
    const { update } = useSession();
    const [isPending, startTransition ] = useTransition();

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            name: user?.name || undefined,
        }
    });
    const onSubmit = (values: z.infer<typeof SettingsSchema> ) => {
        startTransition(() => {
            settings(values)
            .then((data)=>{
                if(data.error) {
                    setError(data.error);
                }
                if(data.success) {
                    setSuccess(data.success);
                }
            })
            .catch(()=>{
                setError("Something went wrong!");
            })
        })
    }
    return (
        <Card className="mx-auto w-[420px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    ⚙️ Settings
                </p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="space-y-4">
                            <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) =>  (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                        {...field}
                                        placeholder="Your Name"
                                        disabled={isPending}
                                        />
                                    </FormControl>
                                </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit">
                            Save
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
