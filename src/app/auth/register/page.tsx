"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createAccountSchema,
  type TypeCreateAccountSchema,
} from "@/schemas/auth/create-admin.schema";
import { Button } from "@/components/common/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/Form";
import { Input } from "@/components/common/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/common/Card";
import { Alert, AlertDescription } from "@/components/common/Alert";
import { Loader2, Shield } from "lucide-react";
import { authApi } from "@/libs/api";
import { useAuthStore } from "@/store/auth/auth.store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminRegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const form = useForm<TypeCreateAccountSchema>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: TypeCreateAccountSchema) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.register(data);
      const adminData = response.user || response.admin;
      const accessToken = response.access_token;

      if (adminData && accessToken) {
        login(adminData, accessToken);
        toast.success("Регистрация успешна!");
        router.push("/dashboard");
      } else {
        toast.success("Регистрация успешна! Теперь вы можете войти в систему.");
        router.push("/auth/login");
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Ошибка регистрации. Попробуйте еще раз.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100dvh-4rem)] w-full items-center justify-center overflow-hidden bg-linear-to-br from-slate-950 via-blue-950 to-slate-900 p-3 sm:p-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-accent/15 absolute -top-40 -left-40 h-72 w-72 animate-pulse rounded-full blur-3xl duration-8000 sm:-top-32 sm:-left-32 sm:h-80 sm:w-80"></div>
        <div className="bg-primary/12 absolute -right-40 -bottom-40 h-72 w-72 animate-pulse rounded-full blur-3xl duration-7000 sm:-right-32 sm:-bottom-32 sm:h-80 sm:w-80"></div>
        <div className="bg-primary/8 absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl sm:h-96 sm:w-96"></div>
        <div className="bg-accent/8 absolute -top-20 right-0 h-60 w-60 rounded-full opacity-40 blur-2xl"></div>
        <div className="bg-accent/5 absolute top-1/3 -left-20 h-56 w-56 animate-pulse rounded-full blur-2xl duration-8000"></div>
      </div>

      {/* Content */}
      <Card className="relative z-10 w-full max-w-sm transition-shadow duration-300 hover:shadow-xl sm:max-w-lg">
        <CardHeader className="from-muted/50 rounded-t-2xl bg-linear-to-b to-transparent px-4 py-4 text-center sm:px-6 sm:py-6">
          <div className="from-accent/20 to-primary/20 border-accent/30 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border bg-linear-to-br shadow-md backdrop-blur-sm sm:mb-4 sm:h-14 sm:w-14">
            <Shield className="text-accent/80 h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <CardTitle className="from-foreground to-foreground/80 bg-linear-to-r bg-clip-text text-xl font-bold sm:text-2xl">
            Регистрация администратора
          </CardTitle>
          <CardDescription className="mt-1.5 text-xs leading-relaxed sm:mt-2 sm:text-sm">
            Создайте учетную запись администратора для доступа к панели
            управления
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pt-2 sm:pt-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">
                      Email адрес
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Пароль</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <Alert
                  variant="destructive"
                  className="bg-destructive/5 border-destructive/30 animate-in fade-in-50 slide-in-from-top-2"
                >
                  <AlertDescription className="text-destructive/90 text-xs sm:text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="h-10 w-full text-sm font-semibold shadow-md hover:shadow-lg sm:h-11 sm:text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin sm:h-5 sm:w-5" />
                    Регистрация...
                  </>
                ) : (
                  "Зарегистрироваться"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <div className="border-border/30 mt-0 border-t px-4 pt-4 pb-4 text-center text-xs sm:px-6 sm:pt-6 sm:pb-6 sm:text-sm">
          <p className="text-muted-foreground">
            Уже есть аккаунт?{" "}
            <a
              href="/auth/login"
              className="text-primary hover:text-primary/80 font-semibold transition-colors duration-200"
            >
              Войти
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
