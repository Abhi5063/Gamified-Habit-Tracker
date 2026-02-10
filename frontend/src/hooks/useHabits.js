import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

export const useHabits = () => {
  const queryClient = useQueryClient();

  // Fetch all habits
  const { data, isLoading, error } = useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      const response = await api.get('/api/habits');
      return response.data.habits;
    },
  });

  // Create habit
  const createHabit = useMutation({
    mutationFn: async (habitData) => {
      const response = await api.post('/api/habits', habitData);
      return response.data.habit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  // Update habit
  const updateHabit = useMutation({
    mutationFn: async ({ id, ...habitData }) => {
      const response = await api.put(`/api/habits/${id}`, habitData);
      return response.data.habit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  // Delete habit
  const deleteHabit = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/habits/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  // Track habit (toggle checkbox)
  const trackHabit = useMutation({
    mutationFn: async ({ id, date }) => {
      const response = await api.post(`/api/habits/${id}/track`, { date });
      return response.data.habit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  return {
    habits: data || [],
    isLoading,
    error,
    createHabit,
    updateHabit,
    deleteHabit,
    trackHabit,
  };
};
