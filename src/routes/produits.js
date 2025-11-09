import express from "express";
import db from "../db.js";

const router = express.Router();

// Liste des produits
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM produits");
    res.json(rows);
  } catch (error) {
    console.error("Erreur récupération produits :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;


