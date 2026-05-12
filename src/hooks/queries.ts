import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRepos, fetchRepo, triggerSync, fetchAnalytics, fetchResources, fetchSnippets, createSnippet, updateSnippet, deleteSnippet, fetchActivity } from '@/lib/api';

export function useRepos() {
  return useQuery({
    queryKey: ['repos'],
    queryFn: () => fetchRepos().then(d => d.repos),
  });
}

export function useRepo(id: string) {
  return useQuery({
    queryKey: ['repos', id],
    queryFn: () => fetchRepo(id).then(d => d.repo),
    enabled: !!id,
    // Automatically poll if activity is null (Computing state)
    refetchInterval: (query) => {
      const data = query.state.data;
      return data && data.activity === null ? 5000 : false;
    },
  });
}

export function useSync() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: triggerSync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repos'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics,
  });
}

export function useResources() {
  return useQuery({
    queryKey: ['resources'],
    queryFn: () => fetchResources().then(d => d.resources),
  });
}

export function useSnippets() {
  return useQuery({
    queryKey: ['snippets'],
    queryFn: () => fetchSnippets().then(d => d.snippets),
  });
}

export function useCreateSnippet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSnippet,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['snippets'] }),
  });
}

export function useUpdateSnippet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string; title?: string; code?: string; language?: string }) =>
      updateSnippet(id, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['snippets'] }),
  });
}

export function useDeleteSnippet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSnippet,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['snippets'] }),
  });
}

export function useActivity() {
  return useQuery({
    queryKey: ['activity'],
    queryFn: () => fetchActivity().then(d => d.activities),
    refetchInterval: 60000, // Refresh every minute
  });
}
