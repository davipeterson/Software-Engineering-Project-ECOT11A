import { Suspense } from "react";
import { redirect } from "next/navigation";
import { obterSessao } from "@/server/auth/sessao";
import { sair } from "@/app/login/actions";

async function UsuarioLogado() {
  const sessao = await obterSessao();
  if (!sessao) redirect("/login");

  return (
    <div className="flex items-center gap-4">
      <p className="text-sm text-zinc-700">
        {sessao.nome} <span className="text-zinc-500">({sessao.perfil})</span>
      </p>
      <form action={sair}>
        <button type="submit" className="rounded border border-zinc-300 px-3 py-1 text-sm">
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
        <Suspense fallback={<p className="text-sm text-zinc-500">Carregando...</p>}>
          <UsuarioLogado />
        </Suspense>
      </header>
    </main>
  );
}
