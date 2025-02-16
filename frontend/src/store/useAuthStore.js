import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false, 
    isUpdatedProfile: true,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error on CheckAuth", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } finally {
            set({ isSigningUp: false });
        }
    },

    logout: async()=>{ 
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Logged out Successfully")
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }, 

    updateProfile: async (data)=>{ 

    }
}));

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2IyMjBjYTYzMGE1ZWZmYTU3ZTY3ZGQiLCJpYXQiOjE3Mzk3MjcwNTAsImV4cCI6MTc0MDMzMTg1MH0.EM1thqo9AqruDdsmPADGCFmtIY3zAhaPjrRLuKCabNc