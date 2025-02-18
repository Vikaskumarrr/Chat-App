import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../utils/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    message: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,

    getUsers: async () => {
        set({ isUserLoading: true }); // Corrected typo here
        try {
            const res = await axiosInstance.get("/message/user");
            set({ users: res.data })
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            set({ isUserLoading: false }); // Corrected typo here
        }
    },

    getMessages: async (usersId) => {
        set({ isMessageLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${usersId}`);
            set({ message: res.data })
        } catch (error) {
            toast.error("Failed to fetch messages");
        } finally {
            set({ isMessageLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, message } = get(); // Corrected typo here

        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({ message: [...message, res.data] }) // Corrected typo here

        } catch (error) {
            toast.error("Failed to send message");
        }
    },

    subscribeToMessage: () => { 
        const { selectedUser } = get(); 
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => { 
            set({ message: [...get().message, newMessage] })
        })
    },

    unsubscribeToMessage: () => { 
        const socket = useAuthStore.getState().socket; 
        socket.off("newMessage");
    },

    setSelectedUser: async (selectedUser) => set({ selectedUser }),
}))