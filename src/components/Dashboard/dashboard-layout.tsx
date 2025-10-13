"use client"

import type React from "react"
import { signOut } from "next-auth/react";
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/Dashboard/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/Dashboard/ui/sheet"
import { cn } from "@/lib/utils"
import { Menu, User, ImageIcon, Video, LogOut, Home, ArrowLeft } from "lucide-react"
import Image from "next/image"
import logo from "../../../public/images/vinicius-canhassi.svg"
import Link from "next/link";

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    name: "Sobre Mim",
    href: "/admin/dashboard/sobre-mim",
    icon: User,
  },
  {
    name: "Projetos (Arte)",
    href: "/admin/dashboard/projetos-arte",
    icon: ImageIcon,
  },
  {
    name: "Projetos (Vídeo)",
    href: "/admin/dashboard/projetos-video",
    icon: Video,
  },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    signOut({
      callbackUrl: "/admin/login", 
    });
  }

  const isSubPage = pathname !== "/admin/dashboard"

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <span className="sr-only">Vinicius Canhassi</span>
        <Image className="w-52" src={logo} alt="Vinicius Canhassi Dashboard" />
      </div>
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href} passHref>
              <Button
                key={item.name}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start my-1",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
                onClick={() => {
                  if (mobile) setSidebarOpen(false)
                }}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:bg-sidebar">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 bg-primary text-white shadow-lg hover:bg-primary/90"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 bg-sidebar">
          <Sidebar mobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="pt-16 lg:pt-0">            
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
