"use client";

import { useActionState } from "react";
import { entrar, type EstadoLogin } from "./actions";

export function FormLogin() {
  const [estado, acao, pendente] = useActionState<EstadoLogin, FormData>(entrar, {});

  return (
    <form action={acao} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-medium">
        E-mail
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          defaultValue={estado.email}
          className="rounded border border-zinc-300 px-3 py-2 font-normal"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Senha
        <input
          name="senha"
          type="password"
          required
          autoComplete="current-password"
          className="rounded border border-zinc-300 px-3 py-2 font-normal"
        />
      </label>
      {estado.erro && (
        <p role="alert" className="rounded bg-red-50 px-3 py-2 text-sm text-red-800">
          {estado.erro}
        </p>
      )}
      <button
        type="submit"
        disabled={pendente}
        className="rounded bg-zinc-900 px-4 py-2 font-medium text-white disabled:opacity-60"
      >
        {pendente ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
