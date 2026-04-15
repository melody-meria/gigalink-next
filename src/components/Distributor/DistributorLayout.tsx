"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Users, Ticket, PackageCheck,
  BarChart3, Activity, Settings, LogOut,
  Menu, X, Briefcase, Send, Moon, Sun,
} from "lucide-react";

const navItems = [
  // { name: "Dashboard",          path: "/distributor/dashboard",  icon: LayoutDashboard },
  { name: "Vendor Management",  path: "/distributor/vendors",    icon: Users           },
  // { name: "Voucher Management", path: "/distributor/vouchers",   icon: Ticket          },
  // { name: "Voucher Assignment", path: "/distributor/assignment", icon: PackageCheck    },
  { name: "Request Vouchers",   path: "/distributor/request",    icon: Send            },
  { name: "Inventory Tracking", path: "/distributor/inventory",  icon: Activity        },
  // { name: "Sales Monitoring",   path: "/distributor/sales",      icon: BarChart3       },
  // { name: "Activity Logs",      path: "/distributor/logs",       icon: Settings        },
];

function SidebarContent({
  dark, toggleDark, handleSignOut, onNavClick,
}: {
  dark: boolean;
  toggleDark: () => void;
  handleSignOut: () => void;
  onNavClick: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shrink-0">
            <Briefcase size={20} />
          </div>
          <div>
            <div className="font-bold text-lg text-blue-600 dark:text-blue-400">Distributor</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Portal</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            onClick={onNavClick}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <item.icon size={20} />
            {item.name}
          </a>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
        <button
          onClick={toggleDark}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
          {dark ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function DistributorLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const router = useRouter();

  const toggleDark = () => {
    setDark((d) => !d);
    document.documentElement.classList.toggle("dark");
  };

  const handleSignOut = () => router.push("/portal-selection");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center text-white shrink-0">
              <Briefcase size={16} />
            </div>
            <span className="font-bold text-xl text-blue-500">Distributor</span>
          </div>
        </div>
      </div>

      <div className="flex h-screen lg:h-screen overflow-hidden">

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.aside
                initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-xl lg:hidden"
              >
                <SidebarContent dark={dark} toggleDark={toggleDark} handleSignOut={handleSignOut} onNavClick={() => setIsSidebarOpen(false)} />
              </motion.aside>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0">
          <SidebarContent dark={dark} toggleDark={toggleDark} handleSignOut={handleSignOut} onNavClick={() => {}} />
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
