import express from "express";
import db from "../db.js";

const router = express.Router();

// ➕ Ajouter un client
router.post("/", async (req, res) => {
  const { nom, adresse, telephone, email } = req.body;
  try {
    await db.query(
      "INSERT INTO clients (nom, adresse, telephone, email) VALUES (?, ?, ?, ?)",
      [nom, adresse, telephone, email]
    );
    res.json({ ok: true, message: "Client ajouté avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Erreur lors de l'ajout" });
  }
});

// 📋 Récupérer tous les clients
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM clients ORDER BY id DESC");
    res.json({ ok: true, clients: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

// ✏️ Modifier un client
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nom, adresse, telephone, email } = req.body;
  try {
    await db.query(
      "UPDATE clients SET nom=?, adresse=?, telephone=?, email=? WHERE id=?",
      [nom, adresse, telephone, email, id]
    );
    res.json({ ok: true, message: "Client modifié avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

// ❌ Supprimer un client
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM clients WHERE id=?", [id]);
    res.json({ ok: true, message: "Client supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

export default router;
