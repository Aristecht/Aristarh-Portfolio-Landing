"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth/auth.store";

import { Loader2 } from "lucide-react";
import { ProjectsManager } from "@/components/features/dashboard/ProjectsManager";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/Tabs";
import { PricesManager } from "@/components/features/dashboard/PricesManager";

export default function DashboardPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [isValidated, setIsValidated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const validate = async () => {
      await checkAuth();
      setIsValidated(true);
    };

    validate();
  }, [checkAuth]);

  useEffect(() => {
    if (isValidated && !isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isValidated, isLoading, isAuthenticated, router]);

  if (isLoading || !isValidated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <p className="text-muted-foreground mt-2">
          Управление проектами и услугами
        </p>
      </div>

      <Tabs defaultValue="projects" className="w-full px-5 sm:px-0">
        <div className="mb-6 flex justify-center">
          <TabsList className="grid w-full max-w-sm grid-cols-2 sm:max-w-md">
            <TabsTrigger value="projects">Проекты</TabsTrigger>
            <TabsTrigger value="prices">Услуги</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="projects">
          <ProjectsManager />
        </TabsContent>

        <TabsContent value="prices">
          <PricesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
