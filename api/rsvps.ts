import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { desc } from "drizzle-orm";

// ── Schema (inline para evitar dependências de workspace no bundle) ──
const rsvpsTable = pgTable("rsvps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Conexão reutilizada entre invocações ──
let _db: ReturnType<typeof drizzle> | null = null;
function getDb() {
  if (!_db) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    _db = drizzle(pool);
  }
  return _db;
}

// ── Handler Vercel Serverless Function ──
export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const db = getDb();

  // POST /api/rsvps — salvar confirmação
  if (req.method === "POST") {
    const { name, answer } = req.body ?? {};
    if (!name || !["sim", "nao"].includes(answer)) {
      res.status(400).json({ error: "Dados inválidos" });
      return;
    }
    try {
      const [rsvp] = await db
        .insert(rsvpsTable)
        .values({ name: String(name).trim(), answer: String(answer) })
        .returning();
      res.status(201).json(rsvp);
    } catch {
      res.status(500).json({ error: "Erro ao salvar confirmação" });
    }
    return;
  }

  // GET /api/rsvps — listar confirmações (admin)
  if (req.method === "GET") {
    try {
      const rsvps = await db
        .select()
        .from(rsvpsTable)
        .orderBy(desc(rsvpsTable.createdAt));
      const sim = rsvps.filter((r: any) => r.answer === "sim").length;
      const nao = rsvps.filter((r: any) => r.answer === "nao").length;
      res.json({ total: rsvps.length, sim, nao, rsvps });
    } catch {
      res.status(500).json({ error: "Erro ao buscar confirmações" });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
