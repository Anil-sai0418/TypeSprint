/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, register as apiRegister, getFullUserProfile } from "../services/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const queryClient = useQueryClient();

    const fetchUser = async (email, token) => {
        try {
            const userData = await queryClient.fetchQuery({
                queryKey: queryKeys.userProfile(email),
                queryFn: () => getFullUserProfile(email, token),
                staleTime: 10 * 60 * 1000 // 10 minutes cache
            });

            if (userData && userData.success) {
                // Merge core user data with profile data (which contains profileImage)
                const mergedUser = {
                    ...userData.user,
                    ...(userData.profile || {}),
                    // Ensure the name stays consistent if profile has a different name field or none
                    name: userData.user?.name || (userData.profile && userData.profile.name) || email.split('@')[0]
                };
                setUser(mergedUser);
                setIsAuthenticated(true);
            } else {
                // Token invalid or profile fetch returned unsuccessful
                localStorage.removeItem("token");
                localStorage.removeItem("userEmail");
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (err) {
            console.error("Failed to fetch user profile (token expired or invalid):", err);
            // Clear invalid session tokens so the app does not hang or loop on 401s
            localStorage.removeItem("token");
            localStorage.removeItem("userEmail");
            queryClient.clear();
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = localStorage.getItem("token");
                const userEmail = localStorage.getItem("userEmail");

                if (token && userEmail) {
                    await fetchUser(userEmail, token);
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("userEmail");
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const data = await apiLogin(email, password);
            if (data.success) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userEmail", email);
                setIsAuthenticated(true);
                await fetchUser(email, data.token);
                return { success: true, token: data.token };
            }
            return { success: false, message: data.message || "Login failed" };
        } catch (error) {
            return { success: false, message: error.message || "An error occurred" };
        }
    };

    const logout = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        queryClient.clear(); // Clear TanStack Query cache on logout
        setIsAuthenticated(false);
        setUser(null);
        toast.info("Successfully logged out!");
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, register: apiRegister }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
