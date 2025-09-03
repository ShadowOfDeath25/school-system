import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import axiosClient from "../../axiosClient.js";

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (credentials) => {
            await axiosClient.get("/csrf-cookie");
            const response = await axiosClient.post("/login", credentials);
            return response.data.user;
        }, onSuccess: (userData) => {
            queryClient.setQueryData(["currentUser"], {user: userData});

        }, onError: (error) => {
            console.error("Login Failed:", error);
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";

        }
    });
};
export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            await axiosClient.post("/logout");
        },
        onSuccess: () => {
            queryClient.setQueryData(["currentUser"], null);
        },
        onError: (error) => {
            console.error("Logout failed on server:", error);

            queryClient.setQueryData(["currentUser"], null);
        }
    });
};
export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
            const response = await axiosClient.get("/user");
            return response.data.user;
        },
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });
};
