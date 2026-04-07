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

router.get("/praias/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`SELECT * FROM praia WHERE id = ${id}`);
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao buscar praias" });
  }
});

export default router;
