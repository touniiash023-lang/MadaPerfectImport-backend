const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// GET /api/products
router.get('/', auth, async (req, res) => {
  const q = 'SELECT * FROM products ORDER BY id DESC LIMIT 100';
  const r = await db.query(q);
  res.json(r.rows);
});

// POST /api/products
router.post('/', auth, async (req, res) => {
  const { sku, name, brand, family, unit } = req.body;
  const q = `INSERT INTO products (sku, name, brand, family, unit) VALUES ($1,$2,$3,$4,$5) RETURNING *`;
  const r = await db.query(q, [sku, name, brand, family, unit]);
  res.json(r.rows[0]);
});

module.exports = router;
