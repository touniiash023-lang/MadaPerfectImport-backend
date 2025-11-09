import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js"; // Vérifie que ton modèle s’appelle bien User.js

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ Connexion réussie à la base de données");

    const username = "admin";
    const password = "admin123";

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("⚠️ L’utilisateur admin existe déjà !");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      role: "admin"
    });

    await newUser.save();
    console.log("🎉 Compte admin créé avec succès !");
    console.log(`👉 Nom d’utilisateur : ${username}`);
    console.log(`👉 Mot de passe : ${password}`);

    process.exit();
  } catch (error) {
    console.error("❌ Erreur :", error);
    process.exit(1);
  }
};

createAdmin();
