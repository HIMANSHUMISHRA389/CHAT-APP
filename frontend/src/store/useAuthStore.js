import { create } from "zustand";


import { axiosInstanace } from "../lib/axios";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    isLoggingOut: false,
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
    },
    signup: async (userData) => {
        set({ isSigningUp: true });
        try {
            console.log(userData)
            // Send signup request to the API
            const response = await axiosInstanace.post("/auth/signup", {
                fullname: userData.fullname,
                email: userData.email,
                password: userData.password
            });
            set({authUser:response.data})
            // You might want to automatically log the user in or just return the response
            return response.data;
        } catch (error) {
            // Handle and throw the error so it can be caught in the component
            console.error("Signup error:", error);
            throw error;
        } finally {
            set({ isSigningUp: false });
        }
    },
    login: async (email, password) => {
        set({ isLoggingIn: true });
        try {
            const response = await axiosInstanace.post("/auth/login", {
                email,
                password
            });
            set({ authUser: response.data });
            return response.data;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        } finally {
            set({ isLoggingIn: false });
        }
    },
    logout: async () => {
        set({ isLoggingOut: true });
        try {
            await axiosInstanace.post("/auth/logout");
            set({ authUser: null });
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        } finally {
            set({ isLoggingOut: false });
        }
    }
}))

