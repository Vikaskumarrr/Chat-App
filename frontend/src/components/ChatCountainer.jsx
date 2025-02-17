import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "../components/skeletons/MessageSkeleton";


const ChatCountainer = ()=>{ 

    const {message, getMessages , isMessageLoading, selectedUser}   = useChatStore()

   useEffect(()=>{
    getMessages(selectedUser._id)
   },[selectedUser._id, getMessages]);
       
    
    if(isMessageLoading) {
        return (
        <div className="flex-1 flex flex-col overflow-auto">
            < ChatHeader />
            <MessageSkeleton />
            <MessageInput />
        </div>
    )}
    

    return (
        <div className="flex-1 flec flex-col overflow-auto">
            <ChatHeader /> 

            <p>messages...</p>

            <MessageInput /> 
        </div>
    )
}

export default ChatCountainer; 