import express from "express";
import cors from "cors";
import produitsRoutes from "./routes/produits.js";
import db from "./db.js"; // ton fichier de connexion MySQL

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// route test
app.get("/api", (req, res) => res.send("✅ API active"));
});

// route principale produits
app.use("/api/produits", produitsRoutes);

// démarrage du serveur
const PORT = process.env.PORT || 4002;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Serveur backend actif sur le port ${PORT}`);
});
