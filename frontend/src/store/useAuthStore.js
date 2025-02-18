import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ?"http://localhost:5002" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false, 
    isUpdatedProfile: false,
    isCheckingAuth: true,
    onlineUser: [],
    socket: null,

    checkAuth: async () => {
        try {
            console.log('Checking auth...');
            const res = await axiosInstance.get("/auth/check");
            console.log('Auth response:', res.data);
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            console.error("Error on CheckAuth:", {
                status: error.response?.status,
                data: error.response?.data,
                url: error.config?.url
            });
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            console.log('Signup data:', data);
            const res = await axiosInstance.post("/auth/signup", data);
            console.log('Signup response:', res.data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred. Please try again.");
                return false;
            }
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login",data);
          set({ authUser: res.data });
          toast.success("Logged in successfully");
    
          get().connectSocket();
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isLoggingIn: false });
        }
      },

    logout: async()=>{ 
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Logged out Successfully")
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }, 

    updateProfile: async (data)=>{ 
        set({isUpdatedProfile : true}); 
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({authUser : res.data}); 
            toast.success("Profile updated succesfully");

        } catch (error) {
            toast.error(error.response.data.message)
        } finally{ 
            set({isUpdatedProfile : false});
        }
    },

    connectSocket: ()=>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL,{ 
            query: {
             userId: authUser._id,
            }
        }) 
         socket.connect()

         set({socket: socket });

         socket.on("getOnlineUsers", (userIds)=>{ 
            set({onlineUser : userIds});
         })
    },

    disconnectSocket: ()=>{
        if(get().socket?.connected) get().socket.disconnect();  
    }


}));
