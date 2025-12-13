import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import WalletButton from "../WalletButton";
import { Home, Trophy, User, Swords } from "lucide-react";
import { useGame } from "@/contexts/GameContext";

interface AppLayoutProps {
  children: ReactNode;
  showNav?: boolean;
  showHeader?: boolean;
}

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/rankings", icon: Trophy, label: "Rankings" },
  { path: "/profile", icon: User, label: "Profile" },
];

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showNav = true,
  showHeader = true,
}) => {
  const location = useLocation();
  const { isConnected } = useGame();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      {showHeader && (
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="container flex h-14 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Swords className="w-5 h-5 text-primary" />
              </div>
              <span className="font-serif font-bold text-lg text-foreground hidden sm:inline">
                Conquer Plank
              </span>
            </Link>
            <WalletButton />
          </div>
        </header>
      )}

      {/* Main content */}
      <main className="flex-1 container py-4 pb-20 md:pb-6">{children}</main>

      {/* Bottom navigation (mobile) */}
      {showNav && isConnected && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};

export default AppLayout;
