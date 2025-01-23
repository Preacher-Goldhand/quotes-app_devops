const express = require('express');
const pool = require('./db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM quotes.quotes');
    res.json(result.rows);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/', async (req, res) => {
  const { text, author } = req.body;

  try {
    const result = await pool.query('INSERT INTO quotes.quotes (text, author) VALUES ($1, $2) RETURNING *', [text, author]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { text, author } = req.body;

  try {
    const result = await pool.query(
      'UPDATE quotes.quotes SET text = $1, author = $2 WHERE id = $3 RETURNING *',
      [text, author, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).send('Quote not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM quotes.quotes WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Quote not found');
    }
    res.status(204).send();
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
