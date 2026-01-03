import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import Landing from "./pages/Landing";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import EmailVerification from "./pages/auth/EmailVerification";
import EmployeeDashboard from "./pages/dashboard/EmployeeDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import NotFound from "./pages/NotFound";

// Components
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

// Redirect authenticated users away from auth pages
function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) return null;
  
  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  
  return <>{children}</>;
}

// Placeholder pages for routes we'll build later
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">{title}</h1>
        <p className="text-muted-foreground">Coming in next phase...</p>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      
      {/* Auth Routes - redirect to dashboard if already logged in */}
      <Route path="/signin" element={
        <AuthRedirect>
          <SignIn />
        </AuthRedirect>
      } />
      <Route path="/signup" element={
        <AuthRedirect>
          <SignUp />
        </AuthRedirect>
      } />
      <Route path="/verify-email" element={<EmailVerification />} />
      
      {/* Employee Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <EmployeeDashboard />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <PlaceholderPage title="My Profile" />
        </ProtectedRoute>
      } />
      <Route path="/attendance" element={
        <ProtectedRoute>
          <PlaceholderPage title="My Attendance" />
        </ProtectedRoute>
      } />
      <Route path="/leave" element={
        <ProtectedRoute>
          <PlaceholderPage title="Leave Requests" />
        </ProtectedRoute>
      } />
      <Route path="/payroll" element={
        <ProtectedRoute>
          <PlaceholderPage title="My Payroll" />
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/employees" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <PlaceholderPage title="Employee Directory" />
        </ProtectedRoute>
      } />
      <Route path="/admin/employees/new" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <PlaceholderPage title="Add New Employee" />
        </ProtectedRoute>
      } />
      <Route path="/admin/attendance" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <PlaceholderPage title="Attendance Management" />
        </ProtectedRoute>
      } />
      <Route path="/admin/leave" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <PlaceholderPage title="Leave Approvals" />
        </ProtectedRoute>
      } />
      <Route path="/admin/payroll" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <PlaceholderPage title="Payroll Management" />
        </ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <PlaceholderPage title="Reports Dashboard" />
        </ProtectedRoute>
      } />
      <Route path="/admin/notifications" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <PlaceholderPage title="Notifications" />
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <PlaceholderPage title="Settings" />
        </ProtectedRoute>
      } />
      
      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

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
