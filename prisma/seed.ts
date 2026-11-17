import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Setor } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL }),
});

const usuarios: { nome: string; email: string; setor: Setor }[] = [
  { nome: "Usuário Estoque", email: "estoque@erp.com", setor: Setor.ESTOQUE },
  { nome: "Usuário Vendas", email: "vendas@erp.com", setor: Setor.VENDAS },
  { nome: "Usuário Financeiro", email: "financeiro@erp.com", setor: Setor.FINANCEIRO },
  { nome: "Usuário RH", email: "rh@erp.com", setor: Setor.RH },
  { nome: "Usuário Diretoria", email: "diretoria@erp.com", setor: Setor.DIRETORIA },
];

async function main() {
  const senhaHash = await bcrypt.hash("senha123", 10);
  for (const u of usuarios) {
    await prisma.usuario.upsert({
      where: { email: u.email },
      update: { nome: u.nome, setor: u.setor, senhaHash, ativo: true },
      create: { ...u, senhaHash },
    });
  }
  console.log(`Seed concluído: ${usuarios.length} usuários.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
