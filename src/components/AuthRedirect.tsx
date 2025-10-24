"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Ainda carregando

    if (session?.user?.role === "admin") {
      // Se já está autenticado como admin, redireciona para dashboard
      router.push("/dashboard");
    }
  }, [session, status, router]);

  return null; // Componente invisível
}
