import { useChatStore } from "../store/useChatStore"
import Sidebar from "../components/Sidebar"; 
import NoChatSelected from "../components/NoChatSelected";;
import ChatCountainer from "../components/ChatCountainer";


const  HomePage = ()=> {

    const {selectedUser}= useChatStore();


  return (
    <div className="h-screen bg-base-200">
      <div className="flex item-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6x; h-[calc(100vh-8rem)]">
          <div className="flex h-full roudned-lg overflow-hidden">

            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatCountainer />}

          </div>

        </div>

      </div>
    </div>
  )
}

export default HomePage