import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, FileText, Folder, Gavel, Home, LogOut, Menu, Settings, Users, Video, BarChart } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  text: string;
  collapsed: boolean;
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const role = useUserRole();
  const { signOut } = useAuth();

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-sidebar border-sidebar-border h-screen sticky top-0 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-14 items-center px-4 border-b border-sidebar-border">
        {!collapsed && (
          <span className="text-lg font-semibold text-sidebar-foreground">
            Court Navigator
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto text-sidebar-foreground", 
            collapsed && "mx-auto")}
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu size={20} />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 py-2">
          <nav className="grid gap-1">
            <NavItem to="/dashboard" icon={Home} text="Dashboard" collapsed={collapsed} />
            <NavItem to="/cases" icon={Folder} text="Cases" collapsed={collapsed} />
            <NavItem to="/calendar" icon={Calendar} text="Calendar" collapsed={collapsed} />
            <NavItem to="/documents" icon={FileText} text="Documents" collapsed={collapsed} />
            
            {(role === "judge" || role === "clerk" || role === "admin") && (
              <NavItem to="/hearings" icon={Video} text="Hearings" collapsed={collapsed} />
            )}
            
            {(role === "judge" || role === "admin") && (
              <NavItem to="/decisions" icon={Gavel} text="Decisions" collapsed={collapsed} />
            )}
            
            {(role === "admin") && (
              <NavItem to="/users" icon={Users} text="Users" collapsed={collapsed} />
            )}
            
            {(role === "admin") && (
              <NavItem to="/reports" icon={BarChart} text="Reports" collapsed={collapsed} />
            )}

            <div className="mt-2 pt-2 border-t border-sidebar-border">
              <NavItem to="/settings" icon={Settings} text="Settings" collapsed={collapsed} />
            </div>
          </nav>
        </div>
      </ScrollArea>
      <div className="border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          className="w-full justify-start text-sidebar-foreground"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}

function NavItem({ to, icon: Icon, text, collapsed }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to || 
    (to !== "/" && location.pathname.startsWith(to));
  
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive 
          ? "bg-sidebar-active text-sidebar-active-foreground" 
          : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-hover-foreground",
        collapsed && "justify-center px-0"
      )}
    >
      <Icon className={cn("h-5 w-5", collapsed ? "" : "mr-2")} />
      {!collapsed && <span>{text}</span>}
    </Link>
  );
}
