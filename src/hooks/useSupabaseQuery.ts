
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

// Generic function to fetch data from a table
export function useFetchData<T>(
  queryKey: string[],
  table: string,
  options: {
    columns?: string;
    filters?: Record<string, any>;
    order?: { column: string; ascending?: boolean };
    limit?: number;
    page?: number;
    relationships?: string[];
  } = {}
) {
  const { toast } = useToast();
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      let query = supabase.from(table).select(
        options.columns || '*',
        { count: 'exact' }
      );
      
      // Apply filters if provided
      if (options.filters) {
        Object.entries(options.filters).forEach(([column, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
              query = query.in(column, value);
            } else {
              query = query.eq(column, value);
            }
          }
        });
      }
      
      // Apply ordering if provided
      if (options.order) {
        query = query.order(options.order.column, {
          ascending: options.order.ascending ?? true,
        });
      }
      
      // Apply pagination if both limit and page are provided
      if (options.limit && options.page) {
        const from = (options.page - 1) * options.limit;
        const to = from + options.limit - 1;
        query = query.range(from, to);
      } else if (options.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error, count } = await query;
      
      if (error) {
        toast({
          title: 'Error fetching data',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      return { data: data as T[], count };
    },
  });
}

// Hook for creating records
export function useCreateRecord<T>(table: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (record: Partial<T>) => {
      const { data, error } = await supabase.from(table).insert(record).select();
      
      if (error) {
        toast({
          title: 'Error creating record',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      return data[0] as T;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Record created successfully',
      });
      queryClient.invalidateQueries({ queryKey: [table] });
    },
  });
}

// Hook for updating records
export function useUpdateRecord<T>(table: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<T> }) => {
      const { data: updatedData, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select();
      
      if (error) {
        toast({
          title: 'Error updating record',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      return updatedData[0] as T;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Record updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: [table] });
    },
  });
}

// Hook for deleting records
export function useDeleteRecord(table: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq('id', id);
      
      if (error) {
        toast({
          title: 'Error deleting record',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      return id;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Record deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: [table] });
    },
  });
}

// Hook for fetching a single record by ID
export function useFetchById<T>(
  table: string,
  id: string | null,
  options: {
    columns?: string;
    relationships?: string[];
  } = {}
) {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: [table, id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from(table)
        .select(options.columns || '*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') { // Not found error
          toast({
            title: 'Error fetching record',
            description: error.message,
            variant: 'destructive',
          });
        }
        throw error;
      }
      
      return data as T;
    },
    enabled: !!id,
  });
}
