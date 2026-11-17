import { cookies } from "next/headers";
import { COOKIE_SESSAO, verificarToken, type Sessao } from "./jwt";

export async function obterSessao(): Promise<Sessao | null> {
  const store = await cookies();
  return verificarToken(store.get(COOKIE_SESSAO)?.value);
}
