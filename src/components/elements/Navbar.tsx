"use client";

import { useState, useEffect, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../common/Button";
import { Menu, X, LogOut, LayoutDashboard, Sun, Moon } from "lucide-react";
import { cn } from "@/utils/tw-merge";
import { useAuthStore } from "@/store/auth/auth.store";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Separator } from "../common/Seperator";

interface NavLink {
  href: string;
  label: string;
  icon?: LucideIcon;
}

const publicNavLinks: NavLink[] = [
  { href: "/", label: "Главная" },
  { href: "/services", label: "Услуги" },
  { href: "/works", label: "Работы" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const logout = useAuthStore((state) => state.logout);
  const { setTheme, resolvedTheme } = useTheme();
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = useMemo(() => {
    if (isAuthenticated) {
      return [
        ...publicNavLinks,
        {
          href: "/dashboard",
          label: "Панель управления",
          icon: LayoutDashboard,
        },
      ];
    }
    return publicNavLinks;
  }, [isAuthenticated]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    await logout();
    toast.success("Вы успешно вышли из системы");
    router.push("/");
  };

  return (
    <nav className="border-border/40 bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 transition-opacity hover:opacity-90"
          >
            <Image
              src="/logo.png"
              alt="Логотип Aristarh Studio"
              width={36}
              height={36}
              priority
              className="h-9 w-9 rounded-lg object-cover"
            />
            <span className="from-primary to-accent bg-linear-to-r bg-clip-text text-xl font-bold text-transparent">
              Aristarh Studio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <div className="flex items-center gap-10">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "hover:text-primary relative flex items-center gap-1.5 py-2 text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {link.label}
                    {pathname === link.href && (
                      <span className="bg-primary absolute right-0 bottom-0 left-0 h-0.5 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {!isLoading && (
              <div className="flex items-center gap-3">
                {isClient && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="hover:bg-muted"
                    onClick={() =>
                      setTheme(resolvedTheme === "dark" ? "light" : "dark")
                    }
                    aria-label="Сменить тему"
                  >
                    {resolvedTheme === "dark" ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </Button>
                )}
                {isAuthenticated ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="group hover:bg-destructive/10 hover:text-destructive cursor-pointer gap-2 transition-all duration-200 hover:translate-y-0"
                  >
                    <LogOut className="h-4 w-4 transition-transform" />
                    Выйти
                  </Button>
                ) : (
                  <Button variant="default" size="sm" asChild>
                    <Link href="/auth/login">Вход для админа</Link>
                  </Button>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex items-center justify-center rounded-lg p-2 transition-colors md:hidden"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <div className="md:hidden">
        <div
          className={cn(
            "fixed inset-0 top-16 z-40 bg-black/30 transition-opacity duration-300",
            isMenuOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          )}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />

        <div
          id="mobile-menu"
          className={cn(
            "border-border/40 bg-background/98 absolute top-16 right-0 left-0 z-50 border-t shadow-lg backdrop-blur-xl transition-all duration-300 ease-out will-change-transform",
            isMenuOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-3 opacity-0"
          )}
        >
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium transition-colors",
                    pathname === link.href
                      ? "bg-primary/20 text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {link.label}
                </Link>
              );
            })}
            <Separator />

            <div className="space-y-1 pt-1">
              {isClient && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setTheme(resolvedTheme === "dark" ? "light" : "dark")
                  }
                  className="w-full cursor-pointer justify-start gap-2 hover:translate-y-0"
                >
                  {resolvedTheme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  {resolvedTheme === "dark" ? "Светлая тема" : "Темная тема"}
                </Button>
              )}
              <Separator />
              {!isLoading && (
                <div>
                  {isAuthenticated ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="group hover:bg-destructive/10 hover:text-destructive w-full cursor-pointer justify-start gap-2 transition-all duration-200 hover:translate-y-0"
                    >
                      <LogOut className="h-4 w-4" />
                      Выйти
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      asChild
                      className="w-full cursor-pointer"
                    >
                      <Link
                        href="/auth/login"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Вход для админа
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
