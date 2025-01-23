require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const apiController = require('./apiController');
const pool = require('./db');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());

const corsOptions = {
  origin: 'http://127.0.0.1:5500',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

async function seedDatabase() {
  const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { text: "Get busy living or get busy dying.", author: "Stephen King" },
    { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", author: "Martin Luther King Jr." },
    { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", author: "Ralph Waldo Emerson" },
    { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
    { text: "It is never too late to be what you might have been.", author: "George Eliot" },
    { text: "The best way to predict the future is to create it.", author: "Abraham Lincoln" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "You must be the change you wish to see in the world.", author: "Mahatma Gandhi" }
  ];

  try {
    const res = await pool.query('SELECT COUNT(*) FROM quotes.quotes');
    if (res.rows[0].count === '0') {
      for (const quote of quotes) {
        await pool.query(
          'INSERT INTO quotes.quotes (text, author) VALUES ($1, $2)',
          [quote.text, quote.author]
        );
      }
    }
  } catch (err) {
    console.error("Error seeding database: ", err);
  }
}

pool.connect()
  .then(client => {
    seedDatabase();
    client.release();
  })
  .catch(err => console.error('Error connecting to PostgreSQL', err.stack));

app.use('/api/quotes', apiController);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
