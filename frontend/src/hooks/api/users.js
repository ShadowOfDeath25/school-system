import {useMutation, useQueryClient} from "@tanstack/react-query";
import axiosClient from "../../axiosClient.js";

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["createUser"],
        mutationFn: async (data) => {
            await axiosClient.post("/users", data);
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries(["users"]).then();
        },
        onError: ()=>{
            // Todo: Handle server errors
        }

    })
}
