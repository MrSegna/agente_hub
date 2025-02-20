"use client"

import { Brain, BarChart, MessageSquare, Store } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()

  const navigation = [
    {
      title: "Navegação",
      items: [
        {
          title: "Agentes",
          icon: Brain,
          href: "/",
          isActive: pathname === "/",
        },
        {
          title: "Estatísticas",
          icon: BarChart,
          href: "/statistics",
          isActive: pathname === "/statistics",
        },
        {
          title: "Mensagens",
          icon: MessageSquare,
          href: "/messaging",
          isActive: pathname === "/messaging",
        },
        {
          title: "Marketplace",
          icon: Store,
          href: "/marketplace",
          isActive: pathname === "/marketplace",
        },
      ],
    },
  ]

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        {navigation.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <Link href={item.href} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
