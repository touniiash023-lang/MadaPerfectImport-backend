// Clients routes placeholder
const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req,res)=>{
  const r = await db.query('SELECT * FROM clients ORDER BY id DESC LIMIT 100');
  res.json(r.rows);
});

router.post('/', auth, async (req,res)=>{
  const {name, phone, email, address} = req.body;
  const r = await db.query('INSERT INTO clients (name, phone, email, address) VALUES ($1,$2,$3,$4) RETURNING *',[name,phone,email,address]);
  res.json(r.rows[0]);
});

module.exports = router;
