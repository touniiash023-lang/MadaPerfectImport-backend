import express from 'express';
import db from '../db.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

// GET /api/produits
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, price, description, lien, image FROM products ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/produits
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, lien } = req.body;
    const image = req.file ? '/uploads/' + req.file.filename : null;
    const [result] = await db.query('INSERT INTO products (name, price, description, lien, image) VALUES (?, ?, ?, ?, ?)', [name, price, description, lien, image]);
    res.json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur insertion' });
  }
});

// PUT /api/produits/:id
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, lien } = req.body;
    let image = null;
    if (req.file) image = '/uploads/' + req.file.filename;

    if (image) {
      await db.query('UPDATE products SET name=?, price=?, description=?, lien=?, image=? WHERE id=?', [name, price, description, lien, image, id]);
    } else {
      await db.query('UPDATE products SET name=?, price=?, description=?, lien=? WHERE id=?', [name, price, description, lien, id]);
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur update' });
  }
});

// DELETE /api/produits/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM products WHERE id=?', [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur delete' });
  }
});

export default router;