
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
import NotFound from "./pages/NotFound";

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

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <Auth />
      }
    />
    <Route 
      path="/sign-in" 
      element={<Auth />} 
    />
    <Route 
      path="/sign-up" 
      element={<Auth />} 
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
      path="*"
      element={
        <ProtectedRoute>
          <NotFound />
        </ProtectedRoute>
      }
    />
  </Routes>
);

const App = () => (
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
);

export default App;
