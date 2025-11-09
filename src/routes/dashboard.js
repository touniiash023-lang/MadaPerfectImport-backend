import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [dailySales] = await db.query(
      "SELECT SUM(amount) AS total FROM factures WHERE DATE(date) = CURDATE()"
    );
    const [monthlySales] = await db.query(
      "SELECT SUM(amount) AS total FROM factures WHERE MONTH(date) = MONTH(CURDATE())"
    );
    const [clients] = await db.query("SELECT COUNT(*) AS total FROM clients");
    const [products] = await db.query("SELECT COUNT(*) AS total FROM produits");

    res.json({
      dailySales: dailySales[0].total || 0,
      monthlySales: monthlySales[0].total || 0,
      totalClients: clients[0].total,
      totalProducts: products[0].total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
