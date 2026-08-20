"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Plus, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }

    return pathname.startsWith(path);
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/investigations", label: "Investigations", icon: FileText },
    { href: "/investigations/new", label: "New Investigation", icon: Plus },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
    fixed left-0 top-0 z-40 flex h-screen w-[280px] shrink-0
    flex-col overflow-y-auto border-r border-slate-200 bg-white
    p-4 sm:p-5 lg:static lg:w-[280px] lg:translate-x-0 lg:p-6
    transition-transform duration-300
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        {/* Logo */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="group flex items-center rounded-xl p-2 -m-2"
          >
            <div
              className="
        flex h-11 w-full max-w-[220px] items-center justify-center
        rounded-xl bg-indigo-600
        shadow-sm
        transition-all duration-200
        group-hover:bg-indigo-700
        group-hover:shadow-md
      "
            >
              <span className="text-lg font-bold tracking-[0.25em] text-white">
                ACCIDENT GEO
              </span>
            </div>
          </Link>
        </div>
        {/* Navigation */}
        <nav className="flex-1 space-y-1" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex min-w-0 items-center gap-3 rounded-lg
                  px-3 py-3 font-medium
                  transition-colors duration-200
                  ${
                    active
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }
                `}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.25 : 2}
                  className="shrink-0"
                />

                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="my-5 border-t border-slate-200 sm:my-6" />

        {/* User Profile */}
        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl bg-slate-50 p-3 sm:p-4">
            <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Logged in as
            </p>

            <p className="truncate text-sm font-medium text-slate-900">
              {user?.email || "User"}
            </p>

            {user?.name && (
              <p className="mt-1 truncate text-xs text-slate-500">
                {user.name}
              </p>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="
              flex w-full min-w-0 items-center gap-3 rounded-lg
              px-3 py-3 font-medium text-slate-600
              transition-colors duration-200
              hover:bg-slate-50 hover:text-slate-900
            "
          >
            <LogOut size={20} className="shrink-0" />
            <span className="truncate">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[1px] lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
