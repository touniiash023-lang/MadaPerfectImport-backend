// genHash.cjs
const bcrypt = require("bcryptjs");

const plain = "TONY123456789";
const saltRounds = 10;

bcrypt.hash(plain, saltRounds, (err, hash) => {
  if (err) {
    console.error("Erreur:", err);
    process.exit(1);
  }
  console.log("Hash généré ->", hash);
});
