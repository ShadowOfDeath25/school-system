import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axiosClient from "../../axiosClient.js";

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["createUser"],
        mutationFn: async (data) => {
            await axiosClient.post("/users", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]).then();
        },
        onError: () => {
            // Todo: Handle server errors
        }

    })
}
export const useUsers = (page) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ["users", page],
        queryFn: async () => {
            const response = await axiosClient.get(`/users/?page=${page}`);
            console.log(response)
            return response.data;
        },
        keepPreviousData: true


    })
}
