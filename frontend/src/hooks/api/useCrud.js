import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import axiosClient from "../../axiosClient.js";


export const useCreate = (resource) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["create", resource],
        mutationFn: (payload) => axiosClient.post(`/${resource}`, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [resource]});
        }
    })
}
export const useGetAll = (resource, params = {}) => {
    return useQuery({
        queryKey: [resource, params],
        queryFn: () => axiosClient.get(`/${resource}`, {params}).then(res => res.data),
        keepPreviousData: true
    })
}
