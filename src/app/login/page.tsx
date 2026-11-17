import type { Metadata } from "next";
import { FormLogin } from "./FormLogin";

export const metadata: Metadata = { title: "Entrar | ERP" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-xl font-semibold">ERP de Gestão Integrada</h1>
        <p className="mb-6 text-sm text-zinc-600">Entre com seu e-mail e senha.</p>
        <FormLogin />
      </div>
    </main>
  );
}
