import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { db } from '@/integrations/firebase/client';
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query as firestoreQuery,
  where,
  orderBy,
  limit as firestoreLimit,
  startAfter,
  WhereFilterOp,
  DocumentData,
  QueryConstraint,
  onSnapshot,
  endAt,
  endBefore,
  startAt,
  getCountFromServer,
  or,
  and,
  writeBatch,
  runTransaction,
  serverTimestamp,
  QueryCompositeFilterConstraint,
  Query,
  QueryFilterConstraint,
  QueryNonFilterConstraint,
} from 'firebase/firestore';
import { useToast } from './use-toast';
import { useEffect, useState } from 'react';
import { FirestoreDocument } from '@/integrations/firebase/types';

// Types for query options
export interface QueryOptions {
  filters?: Array<{
    field: string;
    operator: WhereFilterOp;
    value: any;
  }>;
  orFilters?: Array<Array<{
    field: string;
    operator: WhereFilterOp;
    value: any;
  }>>;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  limit?: number;
  startAfterDoc?: DocumentData;
  startAtValue?: any;
  endAtValue?: any;
  endBeforeValue?: any;
}

// Type helper for query results with proper typing
export type QueryResult<T> = {
  data: T[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
};

// Fetch all documents from a collection with filtering and pagination
export function useFetchCollection<T extends FirestoreDocument>(
  collectionName: string, 
  options: QueryOptions = {}
): QueryResult<T> {
  const { toast } = useToast();
  
  const queryOptions: UseQueryOptions<T[], Error, T[], [string, QueryOptions]> = {
    queryKey: [collectionName, options],
    queryFn: async () => {
      // Create a base query
      let query = collection(db, collectionName);
      let finalQuery: Query<DocumentData, DocumentData>;
      
      // Handle OR filters as a separate case
      if (options.orFilters && options.orFilters.length > 0) {
        const orGroup = options.orFilters[0]; // Take the first group for now
        const conditions = orGroup.map(filter => 
          where(filter.field, filter.operator, filter.value)
        );
        
        // Create a base query with the OR condition
        finalQuery = firestoreQuery(query, or(...conditions));
        
        // Now add other non-filter constraints
        const nonFilterConstraints: QueryNonFilterConstraint[] = [];
        
        if (options.orderByField) {
          nonFilterConstraints.push(orderBy(options.orderByField, options.orderDirection || 'asc'));
        }
        
        if (options.limit) {
          nonFilterConstraints.push(firestoreLimit(options.limit));
        }
        
        if (options.startAfterDoc) {
          nonFilterConstraints.push(startAfter(options.startAfterDoc));
        }
        
        if (options.startAtValue !== undefined) {
          nonFilterConstraints.push(startAt(options.startAtValue));
        }
        
        if (options.endAtValue !== undefined) {
          nonFilterConstraints.push(endAt(options.endAtValue));
        }
        
        if (options.endBeforeValue !== undefined) {
          nonFilterConstraints.push(endBefore(options.endBeforeValue));
        }
        
        // Add non-filter constraints to the query with OR filter
        if (nonFilterConstraints.length > 0) {
          finalQuery = firestoreQuery(finalQuery, ...nonFilterConstraints);
        }
      } else {
        // No OR filters, just handle regular constraints
        const constraints: QueryConstraint[] = [];
        
        // Add filters if any
        if (options.filters) {
          options.filters.forEach(filter => {
            constraints.push(where(filter.field, filter.operator, filter.value));
          });
        }
        
        // Add ordering if specified
        if (options.orderByField) {
          constraints.push(orderBy(options.orderByField, options.orderDirection || 'asc'));
        }
        
        // Add pagination if specified
        if (options.limit) {
          constraints.push(firestoreLimit(options.limit));
        }
        
        // Add startAfter if we're paginating
        if (options.startAfterDoc) {
          constraints.push(startAfter(options.startAfterDoc));
        }
        
        // Add startAt if specified
        if (options.startAtValue !== undefined) {
          constraints.push(startAt(options.startAtValue));
        }
        
        // Add endAt if specified
        if (options.endAtValue !== undefined) {
          constraints.push(endAt(options.endAtValue));
        }
        
        // Add endBefore if specified
        if (options.endBeforeValue !== undefined) {
          constraints.push(endBefore(options.endBeforeValue));
        }
        
        // Apply all constraints
        finalQuery = firestoreQuery(query, ...constraints);
      }
      
      const querySnapshot = await getDocs(finalQuery);
      
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as T));
    }
  };
  
  // Add error handling with toast but not as direct properties
  const query = useQuery<T[], Error, T[], [string, QueryOptions]>(queryOptions);
  
  // Handle error with toast if needed
  if (query.error) {
    toast({
      title: "Error fetching data",
      description: query.error.message,
      variant: "destructive"
    });
  }
  
  return query as QueryResult<T>;
}

// Fetch a single document by ID with proper typing
export function useFetchById<T extends FirestoreDocument>(
  collectionName: string, 
  id: string | undefined
) {
  const { toast } = useToast();
  
  const queryOptions: UseQueryOptions<T | null, Error, T | null, [string, string | undefined]> = {
    queryKey: [collectionName, id],
    queryFn: async () => {
      if (!id) return null;
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error('Document not found');
      return { id: docSnap.id, ...docSnap.data() } as T;
    },
    enabled: !!id
  };
  
  const query = useQuery<T | null, Error, T | null, [string, string | undefined]>(queryOptions);
  
  // Handle error with toast if needed
  if (query.error) {
    toast({
      title: "Error fetching document",
      description: query.error.message,
      variant: "destructive"
    });
  }
  
  return query;
}

// Create a new document with proper typing
export function useCreateDocument<T extends FirestoreDocument, U extends Omit<T, 'id'>>(
  collectionName: string
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: U) => {
      // Remove any potential id from the data to let Firestore generate one
      const { id, ...rest } = data as any;
      const docRef = await addDoc(collection(db, collectionName), rest);
      return { id: docRef.id, ...rest } as T;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [collectionName] });
      toast({
        title: "Success",
        description: "Document created successfully",
        variant: "default"
      });
      return data;
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating document",
        description: error.message,
        variant: "destructive"
      });
    }
  });
}

// Update a document with proper typing
export function useUpdateDocument<T extends FirestoreDocument>(
  collectionName: string
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<T> }) => {
      const docRef = doc(db, collectionName, id);
      // Remove id from the data to update
      const { id: _, ...updateData } = data as any;
      await updateDoc(docRef, updateData);
      return { id, ...updateData } as T;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [collectionName] });
      queryClient.invalidateQueries({ queryKey: [collectionName, variables.id] });
      toast({
        title: "Success",
        description: "Document updated successfully",
        variant: "default"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating document",
        description: error.message,
        variant: "destructive"
      });
    }
  });
}

// Delete a document
export function useDeleteDocument(
  collectionName: string
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: [collectionName] });
      queryClient.invalidateQueries({ queryKey: [collectionName, id] });
      toast({
        title: "Success",
        description: "Document deleted successfully",
        variant: "default"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting document",
        description: error.message,
        variant: "destructive"
      });
    }
  });
}

// Real-time subscription to a collection
export function useCollectionSubscription<T extends FirestoreDocument>(
  collectionName: string,
  options: QueryOptions = {}
) {
  const [documents, setDocuments] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const constraints: QueryConstraint[] = [];
    
    // Add filters if any
    if (options.filters) {
      options.filters.forEach(filter => {
        constraints.push(where(filter.field, filter.operator, filter.value));
      });
    }
    
    // Add ordering if specified
    if (options.orderByField) {
      constraints.push(orderBy(options.orderByField, options.orderDirection || 'asc'));
    }
    
    // Add pagination if specified
    if (options.limit) {
      constraints.push(firestoreLimit(options.limit));
    }
    
    const q = firestoreQuery(collection(db, collectionName), ...constraints);
    
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const docs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }) as T);
        setDocuments(docs);
        setLoading(false);
      },
      (err) => {
        setError(err as Error);
        setLoading(false);
      }
    );
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [collectionName, JSON.stringify(options)]);
  
  return { documents, loading, error };
}

// Real-time subscription to a single document
export function useDocumentSubscription<T extends FirestoreDocument>(
  collectionName: string,
  id: string | undefined
) {
  const [document, setDocument] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return () => {};
    }
    
    const docRef = doc(db, collectionName, id);
    
    const unsubscribe = onSnapshot(docRef, 
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setDocument({
            id: docSnapshot.id,
            ...docSnapshot.data()
          } as T);
        } else {
          setDocument(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err as Error);
        setLoading(false);
      }
    );
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [collectionName, id]);
  
  return { document, loading, error };
}

// Get the count of documents in a collection with filtering
export function useCollectionCount(
  collectionName: string, 
  options: QueryOptions = {}
) {
  const { toast } = useToast();
  
  const queryOptions: UseQueryOptions<number, Error, number, [string, string, QueryOptions]> = {
    queryKey: [collectionName, 'count', options],
    queryFn: async () => {
      // Create a base query
      let query = collection(db, collectionName);
      let finalQuery: Query<DocumentData, DocumentData>;
      
      // Handle OR filters as a separate case
      if (options.orFilters && options.orFilters.length > 0) {
        const orGroup = options.orFilters[0]; // Take the first group for now
        const conditions = orGroup.map(filter => 
          where(filter.field, filter.operator, filter.value)
        );
        
        // Create a base query with the OR condition
        finalQuery = firestoreQuery(query, or(...conditions));
        
        // We don't usually need non-filter constraints for count, but just in case
        const nonFilterConstraints: QueryNonFilterConstraint[] = [];
        
        // Apply non-filter constraints if any
        if (nonFilterConstraints.length > 0) {
          finalQuery = firestoreQuery(finalQuery, ...nonFilterConstraints);
        }
      } else {
        // No OR filters, just handle regular constraints
        const constraints: QueryConstraint[] = [];
        
        // Add filters if any
        if (options.filters) {
          options.filters.forEach(filter => {
            constraints.push(where(filter.field, filter.operator, filter.value));
          });
        }
        
        // Apply all constraints
        finalQuery = firestoreQuery(query, ...constraints);
      }
      
      const countSnapshot = await getCountFromServer(finalQuery);
      
      return countSnapshot.data().count;
    }
  };
  
  const query = useQuery<number, Error, number, [string, string, QueryOptions]>(queryOptions);
  
  // Handle error with toast if needed
  if (query.error) {
    toast({
      title: "Error counting documents",
      description: query.error.message,
      variant: "destructive"
    });
  }
  
  return query;
}

// Batch operation helper
export function useBatchOperation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      operations, 
      collections = [] 
    }: { 
      operations: Array<{
        type: 'add' | 'update' | 'delete';
        collection: string;
        id?: string;
        data?: any;
      }>, 
      collections?: string[] 
    }) => {
      const batch = writeBatch(db);
      
      for (const op of operations) {
        switch (op.type) {
          case 'add':
            const newRef = doc(collection(db, op.collection));
            batch.set(newRef, { ...op.data, createdAt: serverTimestamp() });
            break;
          case 'update':
            if (!op.id) throw new Error('ID is required for update operation');
            const updateRef = doc(db, op.collection, op.id);
            batch.update(updateRef, { ...op.data, updatedAt: serverTimestamp() });
            break;
          case 'delete':
            if (!op.id) throw new Error('ID is required for delete operation');
            const deleteRef = doc(db, op.collection, op.id);
            batch.delete(deleteRef);
            break;
        }
      }
      
      await batch.commit();
      return true;
    },
    onSuccess: (_, variables) => {
      // Invalidate all affected collections
      const uniqueCollections = [...new Set([
        ...(variables.collections || []),
        ...variables.operations.map(op => op.collection)
      ])];
      
      uniqueCollections.forEach(collectionName => {
        queryClient.invalidateQueries({ queryKey: [collectionName] });
      });
      
      toast({
        title: "Success",
        description: "Batch operation completed successfully",
        variant: "default"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error performing batch operation",
        description: error.message,
        variant: "destructive"
      });
    }
  });
}

// Transaction helper
export function useTransaction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      transactionFn, 
      collections = [] 
    }: { 
      transactionFn: (transaction: any) => Promise<any>,
      collections?: string[] 
    }) => {
      return runTransaction(db, transactionFn);
    },
    onSuccess: (_, variables) => {
      // Invalidate all affected collections
      if (variables.collections.length > 0) {
        variables.collections.forEach(collectionName => {
          queryClient.invalidateQueries({ queryKey: [collectionName] });
        });
      }
      
      toast({
        title: "Success",
        description: "Transaction completed successfully",
        variant: "default"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error performing transaction",
        description: error.message,
        variant: "destructive"
      });
    }
  });
}
