import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "@/contexts/GameContext";
import Index from "./pages/Index";
import PlankTechnique from "./pages/PlankTechnique";
import PlankSession from "./pages/PlankSession";
import PlankResult from "./pages/PlankResult";
import Rankings from "./pages/Rankings";
import GuildDetail from "./pages/GuildDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GameProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/plank/technique" element={<PlankTechnique />} />
            <Route path="/plank/session" element={<PlankSession />} />
            <Route path="/plank/result" element={<PlankResult />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/guild" element={<GuildDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
