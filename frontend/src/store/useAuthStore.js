import { create } from "zustand";
import { persist } from "zustand/middleware";

import { axiosInstanace } from "../lib/axios";

export const useAuthStore = create(
  persist(
    (set) => ({
      authUser: null,
      isSigningUp: false,
      isLoggingIn: false,
      isUpdatingProfile: false,
      isCheckingAuth: true,
      isLoggingOut: false,
      
      checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
          const res = await axiosInstanace.get("/auth/check");
          set({ authUser: res.data });
          console.log("Auth checked successfully:", res.data);
        } catch (error) {
          console.log("Auth check failed:", error);
          set({ authUser: null });
        } finally {
          set({ isCheckingAuth: false });
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
          
          // Make sure profilePic is included in the response
          console.log("Login response:", response.data);
          
          // Store the full user data including profilePic
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
      },
      updateProfilePic: async (profilePic) => {
        set({ isUpdatingProfile: true });
        try {
          const response = await axiosInstanace.put("/auth/update-profile", {
            profilePic
          });
          
          console.log("Auth store - profile update response:", response.data);
          
          // Check if the response contains the profilePic URL
          if (response.data && response.data.profilePic) {
            // Update the authUser with the new profile pic URL
            set(state => ({
              authUser: {
                ...state.authUser,
                profilePic: response.data.profilePic
              }
            }));
            console.log("Auth store - updated authUser with new profilePic:", response.data.profilePic);
          }
          
          return response.data;
        } catch (error) {
          console.error("Profile update error:", error);
          throw error;
        } finally {
          set({ isUpdatingProfile: false });
        }
      }
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

