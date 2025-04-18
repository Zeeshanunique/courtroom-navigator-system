
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserButton } from "@clerk/clerk-react";
import { useUserRole } from "@/hooks/useUserRole";

export function TopBar() {
  const role = useUserRole();
  
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <div className="flex-1 hidden md:block">
        <form className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search cases, documents..."
            className="w-full appearance-none bg-background pl-8 md:w-2/3 lg:w-1/3"
          />
        </form>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        
        <UserButton 
          appearance={{
            elements: {
              userButtonBox: "h-8 w-8"
            }
          }}
        />
      </div>
    </header>
  );
}
