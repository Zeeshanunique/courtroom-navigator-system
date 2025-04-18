import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CaseManagement from "./pages/CaseManagement";
import Calendar from "./pages/Calendar";
import Documents from "./pages/Documents";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";

// Import Firebase initialization - explicitly import all needed services
import { app, auth, db, storage, firebaseError } from "@/integrations/firebase/client";
import { useEffect, useState } from "react";

// Wrap routes that require authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Wrap routes that should be inaccessible when authenticated
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Create a Firebase initialization component that ensures Firebase is loaded
const FirebaseInitializer = ({ children }: { children: React.ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // Import test function here to avoid circular dependencies
  const testFirestoreConnection = async () => {
    try {
      setIsTestingConnection(true);
      // Dynamically import the test function
      const { testFirestore } = await import('./integrations/firebase/test-firestore');
      const result = await testFirestore();
      setTestResult(result);
      
      // If the test was successful, try initializing again
      if (result.success) {
        setIsInitialized(true);
        setError(null);
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Error running test: ${error.message}`
      });
    } finally {
      setIsTestingConnection(false);
    }
  };
  
  useEffect(() => {
    // Check if Firebase is properly initialized
    const checkFirebaseInit = async () => {
      try {
        // Check for configuration errors first
        if (firebaseError) {
          throw new Error(firebaseError);
        }
        
        // Check if Firebase app is properly initialized
        if (!app) {
          throw new Error("Firebase app not initialized");
        }
        
        // Check authentication service
        if (!auth) {
          throw new Error("Firebase auth service not initialized");
        }
        
        // Check Firestore service
        if (!db) {
          throw new Error("Firebase Firestore service not initialized");
        }
        
        // Check Storage service - but make it optional
        if (!storage) {
          // Log a warning but don't throw an error
          console.warn("Firebase Storage service not available - some features may be limited");
        } else {
          console.log("Firebase Storage initialized");
        }
        
        console.log("Firebase successfully initialized");
        setIsInitialized(true);
      } catch (error) {
        console.error("Firebase initialization error:", error);
        setError(error instanceof Error ? error.message : "Unknown Firebase initialization error");
      }
    };
    
    checkFirebaseInit();
  }, []);
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6 text-center">
        <p className="text-2xl text-red-500 font-semibold">Firebase Initialization Error</p>
        <p className="text-lg">{error}</p>
        
        {testResult && (
          <div className={`p-4 rounded-md mt-2 ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={testResult.success ? 'text-green-700' : 'text-red-700'}>
              {testResult.message}
            </p>
          </div>
        )}
        
        <div className="mt-4">
          <button
            onClick={testFirestoreConnection}
            disabled={isTestingConnection}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isTestingConnection ? 'Testing Connection...' : 'Test Firestore Connection'}
          </button>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mt-4 max-w-xl">
          <p className="text-sm text-gray-700 mb-2">To fix this issue:</p>
          <ol className="text-sm text-left list-decimal pl-5 space-y-2">
            <li>Open your <code className="bg-gray-100 px-1 rounded">.env</code> file</li>
            <li>Verify the Firebase configuration values are correct</li>
            <li>Make sure you have installed all required Firebase packages: <code className="bg-gray-100 px-1 rounded">npm install firebase @firebase/firestore</code></li>
            <li>Restart your development server</li>
          </ol>
          <p className="text-xs text-gray-500 mt-4">You can find your Firebase project details in the Firebase console at <a href="https://console.firebase.google.com" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">console.firebase.google.com</a></p>
        </div>
      </div>
    );
  }
  
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Initializing Firebase services...</p>
      </div>
    );
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <PublicOnlyRoute>
          <LandingPage />
        </PublicOnlyRoute>
      }
    />
    <Route 
      path="/login" 
      element={
        <PublicOnlyRoute>
          <Auth />
        </PublicOnlyRoute>
      } 
    />
    <Route 
      path="/register" 
      element={
        <PublicOnlyRoute>
          <Auth />
        </PublicOnlyRoute>
      } 
    />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/cases"
      element={
        <ProtectedRoute>
          <CaseManagement />
        </ProtectedRoute>
      }
    />
    <Route
      path="/calendar"
      element={
        <ProtectedRoute>
          <Calendar />
        </ProtectedRoute>
      }
    />
    <Route
      path="/documents"
      element={
        <ProtectedRoute>
          <Documents />
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/settings"
      element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      }
    />
    <Route
      path="*"
      element={<NotFound />}
    />
  </Routes>
);

const App = () => (
  <FirebaseInitializer>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </FirebaseInitializer>
);

export default App;
