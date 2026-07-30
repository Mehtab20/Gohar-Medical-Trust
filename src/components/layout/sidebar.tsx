import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useCurrentUser } from "@/hooks/use-current-user";
import { canAccess } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  Receipt,
  Pill,
  FlaskConical,
  Scan,
  Package,
  UserCog,
  Clock,
  FileBarChart,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  module: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: <LayoutDashboard />, module: "dashboard" },
  { title: "Patients", href: "/patients", icon: <Users />, module: "patients" },
  { title: "Appointments", href: "/appointments", icon: <Calendar />, module: "appointments" },
  { title: "Medical Records", href: "/medical-records", icon: <ClipboardList />, module: "medicalRecords" },
  { title: "Billing", href: "/billing", icon: <Receipt />, module: "billing" },
  { title: "Pharmacy", href: "/pharmacy", icon: <Pill />, module: "pharmacy" },
  { title: "Lab", href: "/lab", icon: <FlaskConical />, module: "lab" },
  { title: "Radiology", href: "/radiology", icon: <Scan />, module: "radiology" },
  { title: "Inventory", href: "/inventory", icon: <Package />, module: "inventory" },
  { title: "Staff", href: "/staff", icon: <UserCog />, module: "staff" },
  { title: "HR", href: "/hr", icon: <Clock />, module: "hr" },
  { title: "Reports", href: "/reports", icon: <FileBarChart />, module: "reports" },
  { title: "Admin", href: "/admin", icon: <Shield />, module: "admin" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const user = useCurrentUser();

  const filteredNavItems = navItems.filter(
    (item) => user?.role && canAccess(user.role, item.module),
  );

  const sidebarContent = (
    <div
      className={cn(
        "flex h-full flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20">
            <HeartPulse className="h-5 w-5 text-primary" />
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-sm font-bold whitespace-nowrap"
              >
                Gohar Medical
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        {isDesktop && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onMobileClose}
              className={cn(
                "sidebar-link group relative",
                isActive && "active",
              )}
              title={collapsed ? item.title : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm"
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute right-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-primary"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-sidebar-border p-2">
        <Link
          to="/admin/settings"
          onClick={onMobileClose}
          className={cn(
            "sidebar-link",
            location.pathname === "/admin/settings" && "active",
          )}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings className="shrink-0" />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </div>
  );

  // Mobile: overlay drawer
  if (!isDesktop) {
    return (
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-64 shadow-xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop: persistent sidebar
  return (
    <aside className="fixed inset-y-0 left-0 z-30">
      {sidebarContent}
    </aside>
  );
}
