const pool = require('./db');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { title, date, excerpt, fullContent, images, isFeatured } = JSON.parse(event.body);
    const { rows } = await pool.query(
      'INSERT INTO realisations (title, date, excerpt, fullContent, images, isFeatured) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, date, excerpt, fullContent, images, isFeatured]
    );
    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(rows[0]),
    };
  } catch (error) {
    console.error('Error adding realisation:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
}; 