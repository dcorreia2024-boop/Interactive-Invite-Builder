import { Router } from "express";
import { db, rsvpsTable, insertRsvpSchema } from "@workspace/db";
import { desc } from "drizzle-orm";

const rsvpsRouter = Router();

// POST /api/rsvps — salvar confirmação
rsvpsRouter.post("/rsvps", async (req, res) => {
  const parsed = insertRsvpSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Dados inválidos", details: parsed.error.issues });
    return;
  }

  try {
    const [rsvp] = await db.insert(rsvpsTable).values(parsed.data).returning();
    res.status(201).json(rsvp);
  } catch (err) {
    res.status(500).json({ error: "Erro ao salvar confirmação" });
  }
});

// GET /api/rsvps — listar todas as confirmações (admin)
rsvpsRouter.get("/rsvps", async (_req, res) => {
  try {
    const rsvps = await db
      .select()
      .from(rsvpsTable)
      .orderBy(desc(rsvpsTable.createdAt));

    const sim = rsvps.filter((r) => r.answer === "sim").length;
    const nao = rsvps.filter((r) => r.answer === "nao").length;

    res.json({ total: rsvps.length, sim, nao, rsvps });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar confirmações" });
  }
});

export default rsvpsRouter;
