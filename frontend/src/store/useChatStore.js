import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../utils/axios";


export const useChatStore = create((set, get) => ({
    message: [],
    chat: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,

    getUsers: async () => {
        set({ isUserLodaing: true });
        try {
            const res = await axiosInstance.get("/messages/user");
            set({ users: res.data })
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            set({ isMessageLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessageLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data })
        } catch (error) {
            toast.error("Failed to fetch messages");
        } finally {
            set({ isMessageLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();

        try {
            const res = axiosInstance.post(`/messages/send/${selectedUser._id},messageData`);
            set({ messages: [...messages, res.data] })

        } catch (error) {
            toast.error("Failed to send message");

        }
    },


    setSelectedUser: async (selectedUser) => set({ selectedUser }),


}))