import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import axiosClient from "../axiosClient.js";
import {useDispatch} from "react-redux";
import {logout, setError, setLoading, setUser} from '@features/Auth/authSlice.js';

export const useLogin = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    return useMutation({
        onMutate: () => {
            dispatch(setLoading());
        },
        mutationFn: async (credentials) => {
            await axiosClient.get("/csrf-cookie");
            const response = await axiosClient.post("/login", credentials);
            return response.data.user;
        }, onSuccess: (userData) => {
            queryClient.setQueryData(["currentUser"], { user: userData });
            dispatch(setUser(userData));
        }, onError: (error) => {
            console.error("Login Failed:", error);
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            dispatch(setError(errorMessage));
        }
    });
};
export const useLogout = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    return useMutation({
        mutationFn: async () => {
            await axiosClient.post("/logout");
        },
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['currentUser'], exact: true });
            dispatch(logout());
        },
        onError: (error) => {
            console.error("Logout failed on server:", error);
            queryClient.removeQueries({ queryKey: ['currentUser'], exact: true });
            dispatch(logout());
        }
    });
};
export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
            const response = await axiosClient.get("/user");
            return response.data;
        },
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });
};
