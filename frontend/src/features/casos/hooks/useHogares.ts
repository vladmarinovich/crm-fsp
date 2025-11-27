import { useQuery } from '@tanstack/react-query';
import { hogaresApi } from '../services/hogaresService';

export const useHogares = (search?: string) => {
    return useQuery({
        queryKey: ['hogares', search],
        queryFn: () => hogaresApi.getAll(search),
    });
};
