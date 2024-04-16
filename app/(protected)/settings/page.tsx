"use client";
import { Button } from "@/components/ui/button";
import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function SettingsPage() {
    const user = useCurrentUser();
    const onClick= () => {
        logout();
    }

    return (
        <div className="bg-white p-10 rounded-xl">
            <Button type="submit" onClick={onClick}>
                SignOut
            </Button>
        </div>
    )
}
