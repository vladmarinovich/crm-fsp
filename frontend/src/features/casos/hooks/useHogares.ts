import { useQuery } from '@tanstack/react-query';
import { hogaresApi } from '../services/hogaresService';

interface UseHogaresParams {
    page?: number;
    page_size?: number;
    search?: string;
}

import { PaginatedResponse } from '@/types/api';
import { HogarDePaso } from '../services/hogaresService';

export const useHogares = ({ page = 1, page_size = 10, search = '' }: UseHogaresParams) => {
    return useQuery<PaginatedResponse<HogarDePaso>>({
        queryKey: ['hogares', page, page_size, search],
        queryFn: () => hogaresApi.getAll({ page, page_size, search }),
    });
};
