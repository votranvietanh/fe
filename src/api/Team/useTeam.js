import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getTeam, deleteTeam, addTeam, getTeamById, updateTeam } from './teamApi';

export const useGetTeam = () => {
    return useQuery('team', getTeam);
};


export const useGetTeamById = (id) => {
    return useQuery(['team', id], () => getTeamById(id));
}

export const useDeleteTeam = () => {
    const queryClient = useQueryClient();

    return useMutation(deleteTeam, {
        onSuccess: () => {
            queryClient.invalidateQueries('team');
        }
    })
}


export const useAddTeam = () => {
    const queryClient = useQueryClient();

    return useMutation(addTeam, {
        onSuccess: () => {
            queryClient.invalidateQueries('team');
        }
    })
}

export const useUpdateTeam = () => {
    const queryClient = useQueryClient();

    return useMutation(updateTeam, {
        onSuccess: () => {
            queryClient.invalidateQueries('team');
        }
    })
}