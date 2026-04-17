import { cookies } from "next/headers";

export interface AppSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: "LOCADOR" | "LOCATARIO" | "ADMIN";
  };
}

export async function getServerSession(): Promise<AppSession | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const response = await fetch(`${process.env.BACKEND_ORIGIN ?? "http://localhost:3333"}/api/v1/auth/session`, {
      method: "GET",
      headers: {
        cookie: cookieHeader
      },
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as AppSession;
  } catch {
    return null;
  }
}
