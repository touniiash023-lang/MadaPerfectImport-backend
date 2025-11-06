// Invoices routes placeholder
const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req,res)=>{
  const r = await db.query('SELECT * FROM invoices ORDER BY id DESC LIMIT 100');
  res.json(r.rows);
});

router.post('/', auth, async (req,res)=>{
  const {invoice_number, client_id, user_id, total_amount, status} = req.body;
  const r = await db.query('INSERT INTO invoices (invoice_number, client_id, user_id, total_amount, status) VALUES ($1,$2,$3,$4,$5) RETURNING *',[invoice_number,client_id,user_id,total_amount,status]);
  res.json(r.rows[0]);
});

module.exports = router;
