import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../services/dashboardService';

export const useDashboardData = (startDate?: string, endDate?: string) => {
    return useQuery({
        queryKey: ['dashboard', startDate, endDate],
        queryFn: () => getDashboardStats(startDate, endDate),
        placeholderData: (previousData: any) => previousData,
    });
};
