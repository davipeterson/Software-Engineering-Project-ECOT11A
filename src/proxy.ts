import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_SESSAO, criarToken, opcoesCookie, verificarToken } from "@/server/auth/jwt";

// Só valida o JWT. Nunca importar Prisma aqui.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessao = await verificarToken(request.cookies.get(COOKIE_SESSAO)?.value);

  if (pathname === "/login") {
    if (sessao) return NextResponse.redirect(new URL("/estoque", request.url));
    return NextResponse.next();
  }

  if (!sessao) {
    const resposta = NextResponse.redirect(new URL("/login", request.url));
    resposta.cookies.delete(COOKIE_SESSAO);
    return resposta;
  }

  // Renova o token a cada requisição: a sessão expira após 30 min sem atividade.
  const resposta = NextResponse.next();
  resposta.cookies.set(COOKIE_SESSAO, await criarToken(sessao), opcoesCookie());
  return resposta;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
