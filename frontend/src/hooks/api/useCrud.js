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
export const useFilters = (resource) => {
    return useQuery({
        queryKey: [resource, "filters"],
        queryFn: async () => {
            const response = await axiosClient.get(`${resource}/filters`);
            const normalizedData = {}
            for (const [key, value] of Object.entries(response.data)) {
                normalizedData[key] = value.map(item => {
                    return {
                        label: item,
                        value: item
                    }
                })
            }

            return normalizedData;
        },
        keepPreviousData: true,


    })
}
export const useDelete = (resource) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: [resource, "delete"],
        mutationFn: (id) => axiosClient.delete(`/${resource}/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(resource).then();
        }
    })
}
