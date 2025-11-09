import express from "express";
import db from "../db.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const router = express.Router();

// ➕ Ajouter une facture
router.post("/", async (req, res) => {
  try {
    const { client_id, type, produits } = req.body;

    // Calcul du total
    const total = produits.reduce(
      (acc, p) => acc + p.quantite * p.prix_unitaire,
      0
    );

    const [result] = await db.query(
      "INSERT INTO factures (client_id, date_facture, type, total) VALUES (?, NOW(), ?, ?)",
      [client_id, type, total]
    );

    const factureId = result.insertId;

    // Détails
    for (const p of produits) {
      await db.query(
        "INSERT INTO facture_details (facture_id, produit, quantite, prix_unitaire) VALUES (?, ?, ?, ?)",
        [factureId, p.nom, p.quantite, p.prix_unitaire]
      );
    }

    res.json({ ok: true, factureId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Erreur lors de la création" });
  }
});

// 🧾 Générer un PDF
router.get("/:id/pdf", async (req, res) => {
  try {
    const { id } = req.params;

    const [[facture]] = await db.query(
      "SELECT f.*, c.nom AS client_nom, c.adresse, c.telephone, c.email FROM factures f JOIN clients c ON f.client_id = c.id WHERE f.id = ?",
      [id]
    );

    const [details] = await db.query(
      "SELECT * FROM facture_details WHERE facture_id = ?",
      [id]
    );

    if (!facture) return res.status(404).send("Facture introuvable");

    const doc = new PDFDocument();
    const filePath = path.join("uploads", `facture_${id}.pdf`);
    doc.pipe(fs.createWriteStream(filePath));

    // --- ENTÊTE ---
    doc.fontSize(20).text("Mada Perfect Import", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(12).text("NIF : 123456789 | STAT : 987654321");
    doc.text("Adresse : Antananarivo, Madagascar");
    doc.moveDown(1);
    doc.text(`Type : ${facture.type}`, { align: "right" });
    doc.text(`Date : ${facture.date_facture}`, { align: "right" });
    doc.moveDown(1);

    // --- CLIENT ---
    doc.fontSize(14).text("Client :", { underline: true });
    doc.fontSize(12).text(facture.client_nom);
    doc.text(facture.adresse);
    doc.text(`Tel : ${facture.telephone}`);
    doc.text(`Email : ${facture.email}`);
    doc.moveDown(1);

    // --- TABLEAU PRODUITS ---
    doc.fontSize(14).text("Détails de la facture :", { underline: true });
    doc.moveDown(0.5);
    details.forEach((d) => {
      doc.fontSize(12).text(
        `${d.produit} — ${d.quantite} x ${d.prix_unitaire.toFixed(2)} = ${(d.quantite * d.prix_unitaire).toFixed(2)}`
      );
    });

    doc.moveDown(1);
    doc.fontSize(14).text(`TOTAL : ${facture.total.toFixed(2)} Ar`, {
      align: "right",
      underline: true,
    });

    doc.end();
    res.json({ ok: true, file: filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

export default router;
