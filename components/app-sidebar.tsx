"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  StatusIcon,
  AgentsIcon,
  ApisIcon,
  MessagingIcon,
  MarketIcon,
  StatsIcon,
  SettingsIcon,
  MenuIcon,
  CloseIcon
} from "./icons/nav";

type Route = 
  | "/" 
  | "/status"
  | "/agents"
  | "/agents/new"
  | "/apis"
  | "/apis/new"
  | "/messaging"
  | "/marketplace"
  | "/statistics"
  | "/settings";

interface NavItem {
  name: string;
  href: Route;
  icon: (props: { className?: string }) => JSX.Element;
  description: string;
}

const navigation: NavItem[] = [
  {
    name: "Status",
    href: "/status",
    icon: StatusIcon,
    description: "Status dos serviços"
  },
  {
    name: "Agentes",
    href: "/agents",
    icon: AgentsIcon,
    description: "Gerenciamento de agentes"
  },
  {
    name: "APIs",
    href: "/apis",
    icon: ApisIcon,
    description: "Integrações"
  },
  {
    name: "Mensagens",
    href: "/messaging",
    icon: MessagingIcon,
    description: "Central de mensagens"
  },
  {
    name: "Marketplace",
    href: "/marketplace",
    icon: MarketIcon,
    description: "Gestão de pedidos"
  },
  {
    name: "Estatísticas",
    href: "/statistics",
    icon: StatsIcon,
    description: "Métricas e relatórios"
  },
  {
    name: "Configurações",
    href: "/settings",
    icon: SettingsIcon,
    description: "Configurações do sistema"
  }
] as const;

export default function AppSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Botão do Menu Mobile */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 right-4 z-50 h-10 w-10 md:hidden"
      >
        {isMobileMenuOpen ? (
          <CloseIcon className="h-5 w-5" />
        ) : (
          <MenuIcon className="h-5 w-5" />
        )}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-background transition-transform duration-200 ease-in-out",
          {
            "translate-x-0": isMobileMenuOpen,
            "-translate-x-full md:translate-x-0": !isMobileMenuOpen,
          }
        )}
      >
        <div className="flex h-full flex-col border-r">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-x-3" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="text-xl font-medium">🤖</span>
              <span className="text-lg font-semibold">Agent Model</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "group flex items-center gap-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  title={item.description}
                >
                  <item.icon
                    className={cn("h-5 w-5 shrink-0", {
                      "text-primary-foreground": isActive,
                      "text-muted-foreground/70 group-hover:text-accent-foreground": !isActive,
                    })}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-x-3">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-muted-foreground">Sistema online</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay para Mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
