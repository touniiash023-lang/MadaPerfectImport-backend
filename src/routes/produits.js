import express from "express";
import db from "../db.js";

const router = express.Router();

// Route pour récupérer tous les produits
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM produits");
    res.json(rows);
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route pour ajouter un produit
router.post("/", async (req, res) => {
  try {
    const { nom, prix, description, lien, image } = req.body;
    await db.query(
      "INSERT INTO produits (nom, prix, description, lien, image) VALUES (?, ?, ?, ?, ?)",
      [nom, prix, description, lien, image]
    );
    res.json({ message: "✅ Produit ajouté avec succès !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l’ajout du produit" });
  }
});

export default router;

