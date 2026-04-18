import { neon } from "@neondatabase/serverless";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const sql = neon(process.env.DATABASE_URL!);

  // POST /api/rsvps — salvar confirmação
  if (req.method === "POST") {
    const { name, answer } = req.body ?? {};
    if (!name || !["sim", "nao"].includes(answer)) {
      res.status(400).json({ error: "Dados inválidos" });
      return;
    }
    try {
      const rows = await sql(
        `INSERT INTO rsvps (name, answer) VALUES ($1, $2) RETURNING *`,
        [String(name).trim(), String(answer)]
      );
      res.status(201).json(rows[0]);
    } catch {
      res.status(500).json({ error: "Erro ao salvar confirmação" });
    }
    return;
  }

  // GET /api/rsvps — listar confirmações (admin)
  if (req.method === "GET") {
    try {
      const rows = await sql(
        `SELECT * FROM rsvps ORDER BY created_at DESC`
      );
      const sim = rows.filter((r: any) => r.answer === "sim").length;
      const nao = rows.filter((r: any) => r.answer === "nao").length;
      res.json({ total: rows.length, sim, nao, rsvps: rows });
    } catch {
      res.status(500).json({ error: "Erro ao buscar confirmações" });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
