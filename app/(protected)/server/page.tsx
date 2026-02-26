import { UserInfo } from "@/components/user-info";
import { currentUserServerSide } from "@/hooks/currentUserServerSide";

const ServerPage = async () =>  {
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

export default ServerPage;
