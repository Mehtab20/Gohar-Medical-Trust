import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getInitials } from "@/lib/format";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Menu, Bell, Search } from "lucide-react";

interface TopbarProps {
  onMenuClick: () => void;
  className?: string;
}

export function Topbar({ onMenuClick, className }: TopbarProps) {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6",
        className,
      )}
    >
      {/* Mobile menu button */}
      {!isDesktop && (
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="shrink-0">
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search patients, appointments..."
          className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-4 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onFocus={() => navigate("/patients")}
        />
      </div>

      {/* Spacer */}
      <div className="flex-1 hidden sm:block" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
            3
          </span>
        </Button>

        {/* User */}
        {user && (
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-2"
            onClick={() => navigate("/admin/settings")}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            {!isMobile && (
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-medium leading-none">{user.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{user.role.replace("_", " ")}</span>
              </div>
            )}
          </Button>
        )}
      </div>
    </header>
  );
}
