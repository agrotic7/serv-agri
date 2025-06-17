const pool = require('./db');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'PUT') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { id, title, date, excerpt, fullContent, image, isFeatured } = JSON.parse(event.body);
    const { rows } = await pool.query(
      'UPDATE actualites SET title = $1, date = $2, excerpt = $3, fullContent = $4, image = $5, isFeatured = $6 WHERE id = $7 RETURNING *',
      [title, date, excerpt, fullContent, image, isFeatured, id]
    );
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(rows[0]),
    };
  } catch (error) {
    console.error('Error updating actualite:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
}; 