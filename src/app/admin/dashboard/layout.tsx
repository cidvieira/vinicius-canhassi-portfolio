"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardLayout } from "@/components/Dashboard/dashboard-layout";
import { LoadingSpinner } from "@/components/Dashboard/ui/loading-spinner";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && (status !== "authenticated" || session?.user?.role !== "admin")) {
      router.push("/admin/login");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <LoadingSpinner />
    );
  }

  if (status === "authenticated" && session?.user?.role === "admin") {
    return (
        <>
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </>
    );
  }

  return null;
}