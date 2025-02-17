import { User } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeletons";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

const Sidebar = () => {
    const { getUsers, users, selectedUser, setSelectedUser, isUserLoading } = useChatStore();

    const { onlineUser } = useAuthStore();  // online users

    useEffect(() => {
        getUsers();

    }, []);

    if (isUserLoading) return <SidebarSkeleton />;

    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col trasition-all duration-200">
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex item-center gap-2">
                    <User className="size-6" />
                    <span className="font-medium hidden lg:block">Contacts</span>
                </div>
                {/* {TODO : Online filter toggle we can implement here } */}
            </div>

            <div className="overflow-y-auto w-auto py-2">
                {users?.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors
                        ${selectedUser?._id === user._id ? "bg-base-300" : ""}
                        `}
                    >
                        <div className="flex gap-3 max-auto lg:mx-0">
                            <img
                                src={user.profilePic || "/avatar.png"}
                                alt={user.name}
                                className="size-12 object-cover rounded-full"
                            />
                            {onlineUser.includes(user._id) && (
                                <span className="absolute bottom-0 right-0 size-3 bg-green-500 
                                 rounded-full ring-2 ring-zinc-900" />
                            )}
                            {/* User info - only visible on larger screens */}
                            <div className="hidden lg:block text-left min-w-0">
                                <div className="font-medium truncate">{user.fullName}</div>
                                <div className="text-sm text-zinc-400">
                                    {onlineUser.includes(user._id) ? "Online" : "Offline"}
                                </div>


                            </div>
                        </div>

                    </button>
                ))}

            </div>

        </aside>
    )



}

export default Sidebar;