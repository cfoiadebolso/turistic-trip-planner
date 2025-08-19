import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import TripManagement from "./pages/admin/TripManagement";
import PassengerManagement from "./pages/admin/PassengerManagement";
import PaymentControl from "./pages/admin/PaymentControl";
import OrganizerSettings from "./pages/admin/OrganizerSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/trips" element={<TripManagement />} />
        <Route path="/admin/passengers" element={<PassengerManagement />} />
        <Route path="/admin/payments" element={<PaymentControl />} />
        <Route path="/admin/settings" element={<OrganizerSettings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
