import {useQueryClient,useQuery} from '@tanstack/react-query'
import axiosClient from "../../axiosClient.js";

export const useRoles=()=>{
    return useQuery({
        queryKey: ['roles'],
        queryFn: async()=>{
            const response = await axiosClient.get("/roles");
            return response.data;
        }

    })
}
