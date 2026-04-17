"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { signInSchema, type SignInSchema } from "@/schemas/auth-schemas";
import { getGoogleAuthUrl, signIn } from "@/services/auth-service";
import { toErrorMessage } from "@/lib/http-errors";

interface LoginFormProps {
  redirectPath: string;
}

export function LoginForm({ redirectPath }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);

    try {
      const session = await signIn(values);

      if (session.user.role !== "ADMIN") {
        setError("Acesso permitido apenas para administradores.");
        return;
      }

      router.push(redirectPath);
      router.refresh();
    } catch (caughtError) {
      setError(toErrorMessage(caughtError));
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-shell-foreground-dim">Luguel Control</p>
        <h1 className="mt-2 text-3xl font-bold">Admin Access</h1>
        <p className="mt-2 text-sm text-shell-foreground-dim">
          Entre com conta administrativa para acessar moderacao e controle da plataforma.
        </p>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm text-shell-foreground-dim">Email</label>
            <Input type="email" placeholder="admin@luguel.com" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="mt-1 text-xs text-danger">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm text-shell-foreground-dim">Senha</label>
            <Input type="password" placeholder="********" {...form.register("password")} />
            {form.formState.errors.password && (
              <p className="mt-1 text-xs text-danger">{form.formState.errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full gap-2" loading={form.formState.isSubmitting}>
            <LogIn className="h-4 w-4" />
            Entrar
          </Button>
        </form>

        <Button
          variant="secondary"
          className="mt-3 w-full"
          loading={googleLoading}
          onClick={async () => {
            setGoogleLoading(true);
            setError(null);

            try {
              const url = await getGoogleAuthUrl();
              window.location.href = url;
            } catch (caughtError) {
              setError(toErrorMessage(caughtError));
              setGoogleLoading(false);
            }
          }}
        >
          Entrar com Google
        </Button>

        {error && (
          <div className="mt-3">
            <ErrorState message={error} />
          </div>
        )}
      </Card>
    </div>
  );
}
