import { UserInfo } from "@/components/user-info";
import { currentUserServerSide } from "@/hooks/currentUserServerSide";

export default async function ServerPage () {

    const user = await currentUserServerSide();
    return(
        <div>
            <UserInfo
            label="🖥️ Server component"
            user={user}
            />
        </div>
    )
}
