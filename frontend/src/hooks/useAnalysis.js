import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';

export const useAnalysis = () => {
  // Fetch auto-analysis
  const { data: autoAnalysis, isLoading: autoLoading } = useQuery({
    queryKey: ['analysis', 'auto'],
    queryFn: async () => {
      const response = await api.get('/api/analysis/auto');
      return response.data;
    },
  });

  // Fetch weekly analysis for a specific habit
  const useWeeklyAnalysis = (habitId) => {
    return useQuery({
      queryKey: ['analysis', 'weekly', habitId],
      queryFn: async () => {
        const response = await api.get(`/api/habits/${habitId}/weekly`);
        return response.data;
      },
      enabled: !!habitId,
    });
  };

  // Fetch monthly analysis for a specific habit
  const useMonthlyAnalysis = (habitId) => {
    return useQuery({
      queryKey: ['analysis', 'monthly', habitId],
      queryFn: async () => {
        const response = await api.get(`/api/habits/${habitId}/monthly`);
        return response.data;
      },
      enabled: !!habitId,
    });
  };

  return {
    autoAnalysis,
    autoLoading,
    useWeeklyAnalysis,
    useMonthlyAnalysis,
  };
};
