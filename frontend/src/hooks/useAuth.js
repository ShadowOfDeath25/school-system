import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import axiosClient from "../axiosClient.js";

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (credentials) => {
            await axiosClient.get("/csrf-cookie");
            const response = await axiosClient.post("/login",credentials);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["currentUser"]);
        },
        onError: (error)=>{
            console.error("Login Failed:", error);
        }
    });
};
export const useLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["logout"],
        mutationFn: async () => {
            await axiosClient.post("/logout").then();
        },
        onSuccess:()=> {
            queryClient.invalidateQueries(["currentUser"]);
            queryClient.removeQueries(["currentUser"]);
        }

    })
}
export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
            const response = await axiosClient.get("/user");

            return response.data;
        },

        retry: false
    })
}
