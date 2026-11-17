import { Suspense } from "react";
import { redirect } from "next/navigation";
import { obterSessao } from "@/server/auth/sessao";
import { sair } from "@/app/login/actions";

async function UsuarioLogado() {
  const sessao = await obterSessao();
  if (!sessao) redirect("/login");

  return (
    <div className="flex items-center gap-4">
      <p className="text-sm text-zinc-800 dark:text-zinc-100">
        {sessao.nome} <span className="text-zinc-600 dark:text-zinc-300">({sessao.perfil})</span>
      </p>
      <form action={sair}>
        <button type="submit" className="rounded border border-zinc-400 px-3 py-1 text-sm text-zinc-900 dark:border-zinc-500 dark:text-zinc-100">
          Sair
        </button>
      </form>
    </div>
  );
}

export default function EstoquePage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Estoque</h1>
        <Suspense fallback={<p className="text-sm text-zinc-600 dark:text-zinc-300">Carregando...</p>}>
          <UsuarioLogado />
        </Suspense>
      </header>
    </main>
  );
}
