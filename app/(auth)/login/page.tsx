import { LoginForm } from "@/modules/auth/login-form";

interface LoginPageProps {
  searchParams?: Promise<{
    redirect?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const redirectPath = params?.redirect ?? "/dashboard";

  return <LoginForm redirectPath={redirectPath} />;
}
