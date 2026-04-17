import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/server-session";

export default async function HomePage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  redirect("/dashboard");
}
