import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/server/db";
import { criarToken, type Sessao } from "@/server/auth/jwt";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido."),
  senha: z.string().min(1, "Informe a senha."),
});

export type ResultadoLogin =
  | { ok: true; token: string; sessao: Sessao }
  | { ok: false; erro: string };

const ERRO_CREDENCIAIS = "E-mail ou senha incorretos.";

export async function login(entrada: unknown): Promise<ResultadoLogin> {
  const dados = loginSchema.safeParse(entrada);
  if (!dados.success) {
    return { ok: false, erro: dados.error.issues[0]?.message ?? ERRO_CREDENCIAIS };
  }

  const usuario = await prisma.usuario.findUnique({ where: { email: dados.data.email } });
  if (!usuario || !usuario.ativo) return { ok: false, erro: ERRO_CREDENCIAIS };

  const senhaConfere = await bcrypt.compare(dados.data.senha, usuario.senhaHash);
  if (!senhaConfere) return { ok: false, erro: ERRO_CREDENCIAIS };

  const sessao: Sessao = { id: usuario.id, nome: usuario.nome, perfil: usuario.setor };
  return { ok: true, token: await criarToken(sessao), sessao };
}
