"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { login } from "@/server/services/AuthService";
import { COOKIE_SESSAO, opcoesCookie } from "@/server/auth/jwt";

export type EstadoLogin = { erro?: string; email?: string };

export async function entrar(_estado: EstadoLogin, formData: FormData): Promise<EstadoLogin> {
  const email = String(formData.get("email") ?? "");
  const resultado = await login({ email, senha: formData.get("senha") ?? "" });
  if (!resultado.ok) return { erro: resultado.erro, email };

  (await cookies()).set(COOKIE_SESSAO, resultado.token, opcoesCookie());
  redirect("/estoque");
}

export async function sair() {
  (await cookies()).delete(COOKIE_SESSAO);
  redirect("/login");
}
