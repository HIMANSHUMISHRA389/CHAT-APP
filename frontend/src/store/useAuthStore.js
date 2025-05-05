import { create } from "zustand";


import { axiosInstanace } from "../lib/axios";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    checkAuth: async () => {
        try {
            const res = await axiosInstanace.get("/auth/check");
            set({ authUser: res.data })
        } catch (error) {
            console.log(error)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    }
}))

