import express from "express";
import db from "../db.js";

const router = express.Router();

// Récupérer tous les produits
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM produits");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors du chargement des produits" });
  }
});

// Ajouter un produit
router.post("/", async (req, res) => {
  try {
    const { nom, prix, description, lien, image } = req.body;
    await db.query(
      "INSERT INTO produits (nom, prix, description, lien, image) VALUES (?, ?, ?, ?, ?)",
      [nom, prix, description, lien, image]
    );
    res.json({ message: "Produit ajouté avec succès !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l’ajout du produit" });
  }
});

export default router;
