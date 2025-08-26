import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import axiosClient from "../axiosClient.js";
import {useNavigate} from 'react-router';

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (credentials) => {
            await axiosClient.get("/csrf-cookie");
            const response = await axiosClient.post("/login", credentials);
            return response.data;
        }, onSuccess: (userData) => {
            queryClient.setQueryData(["currentUser"], userData);
        }, onError: (error) => {
            console.error("Login Failed:", error);
        }
    });
};
export const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
        mutationKey: ["logout"], mutationFn: async () => {
            await axiosClient.post("/logout").then();
        }, onSuccess: () => {
            queryClient.setQueryData(["currentUser"], {user: null});
            queryClient.invalidateQueries(["currentUser"]).then();
            queryClient.removeQueries(["currentUser"]);
        }

    })
}
export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["currentUser"], queryFn: async () => {
            const response = await axiosClient.get("/user");
            return response.data;

        },

        retry: false
    })
}
