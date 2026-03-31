import { Router } from "express";
import pool from "../../db/connection.js";

const router = Router();

router.get("/praias", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM praia");
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao buscar praias" });
  }
});

router.get("/praias/:id", (req, res) => {
  const { id } = req.params;
  res.send(`Detalhes da Praia com ID: ${id}`);
});

export default router;
