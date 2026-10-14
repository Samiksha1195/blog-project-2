const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'blog-backend' });
});

app.get('/posts', async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [rows] = await connection.execute(
      'SELECT * FROM posts ORDER BY id DESC'
    );

    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Could not retrieve blog posts' });
  }
});

app.listen(5000, '0.0.0.0', () => {
  console.log('Backend running on port 5000');
});
