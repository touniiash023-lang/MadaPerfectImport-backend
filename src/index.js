import express from "express";
import cors from "cors";
import dashboardRoutes from "./routes/dashboard.js";
import produitsRoutes from "./routes/produits.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/produits", produitsRoutes);

const PORT = process.env.PORT || 4002;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Serveur backend actif sur http://localhost:${PORT}`);
});


