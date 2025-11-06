const express = require('express');
const router = express.Router();
const db = require('../db');
const { compare } = require('../utils/hash');
const jwt = require('jsonwebtoken');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const r = await db.query('SELECT * FROM users WHERE username=$1', [username]);
    if (r.rows.length === 0) return res.status(401).json({ error: 'Utilisateur introuvable' });
    const user = r.rows[0];
    const ok = await compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Mot de passe incorrect' });
    const token = jwt.sign({ id: user.id, role_id: user.role_id, username: user.username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
    return res.json({ accessToken: token, user: { id: user.id, username: user.username, full_name: user.full_name } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
