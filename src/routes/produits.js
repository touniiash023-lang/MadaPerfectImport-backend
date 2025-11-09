import express from "express";
import db from "../db.js";

const router = express.Router();

// ✅ Route pour récupérer tous les produits
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM produits");
    res.json(rows);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des produits :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ Route pour ajouter un produit
router.post("/", async (req, res) => {
  try {
    const { nom, prix, description, lien, image } = req.body;

    if (!nom || !prix) {
      return res.status(400).json({ message: "Le nom et le prix sont requis." });
    }

    await db.query(
      "INSERT INTO produits (nom, prix, description, lien, image) VALUES (?, ?, ?, ?, ?)",
      [nom, prix, description || "", lien || "", image || ""]
    );

    res.json({ message: "✅ Produit ajouté avec succès !" });
  } catch (error) {
    console.error("❌ Erreur lors de l’ajout du produit :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;


