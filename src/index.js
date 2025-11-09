import express from "express";
import cors from "cors";
import produitsRoutes from "./routes/produits.js";
import db from "./db.js"; // Connexion à MySQL

const app = express();

app.use(cors());
app.use(express.json());

// Route test principale
app.get("/", (req, res) => {
  res.send("✅ API Mada Perfect Import fonctionne !");
});

// Routes produits
app.use("/api/produits", produitsRoutes);

const PORT = process.env.PORT || 4002;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Serveur backend actif sur le port ${PORT}`);
});
