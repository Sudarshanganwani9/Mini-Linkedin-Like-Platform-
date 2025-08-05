import { Search, Home, Users, MessageSquare, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "react-router-dom";

export const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Users, label: "My Network", path: "/network" },
    { icon: MessageSquare, label: "Messaging", path: "/messages" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
  ];

  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link to="/" className="font-bold text-xl text-primary">Social</Link>
        
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search" 
              className="pl-10 bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`flex flex-col gap-1 h-12 px-3 ${
                  location.pathname === item.path ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs hidden sm:block">{item.label}</span>
              </Button>
            </Link>
          ))}
          
          <Link to="/profile">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex flex-col gap-1 h-12 px-3 ${
                location.pathname === "/profile" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs hidden sm:block">Me</span>
            </Button>
          </Link>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={signOut}
            className="ml-2"
          >
            Sign Out
          </Button>
        </nav>
      </div>
    </header>
  );
};