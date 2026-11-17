import { SignJWT, jwtVerify } from "jose";

// Este arquivo é usado pelo proxy: só jose, nunca Prisma.

export const COOKIE_SESSAO = "sessao";
export const DURACAO_SESSAO_SEGUNDOS = 30 * 60;

export const SETORES = ["ESTOQUE", "VENDAS", "FINANCEIRO", "RH", "DIRETORIA"] as const;
export type Perfil = (typeof SETORES)[number];

export type Sessao = {
  id: number;
  nome: string;
  perfil: Perfil;
};

function chave() {
  const segredo = process.env.JWT_SECRET;
  if (!segredo) throw new Error("JWT_SECRET não configurado");
  return new TextEncoder().encode(segredo);
}

export async function criarToken(sessao: Sessao): Promise<string> {
  return new SignJWT({ nome: sessao.nome, perfil: sessao.perfil })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(sessao.id))
    .setIssuedAt()
    .setExpirationTime(`${DURACAO_SESSAO_SEGUNDOS}s`)
    .sign(chave());
}

export async function verificarToken(token: string | undefined): Promise<Sessao | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, chave(), { algorithms: ["HS256"] });
    const id = Number(payload.sub);
    const { nome, perfil } = payload;
    if (!Number.isInteger(id) || typeof nome !== "string") return null;
    if (!SETORES.includes(perfil as Perfil)) return null;
    return { id, nome, perfil: perfil as Perfil };
  } catch {
    return null;
  }
}

export function opcoesCookie() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: DURACAO_SESSAO_SEGUNDOS,
  };
}
