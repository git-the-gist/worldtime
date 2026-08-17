
require("dotenv").config();

const Express = require('express');
const Cors = require('cors');
const BodyParser = require('body-parser');

const { Pool } = require('pg');
const server = Express();

server.use(BodyParser.json());
server.use(BodyParser.urlencoded({extended: true}));
server.use(Cors());

const con = new Pool({
  connectionString: process.env.DATABASE_URL
});

server.get("/search", async (request, response) => {
  const city = request.query.city;

  if (!city) {
    return response.json([]);
  }

  try {
    const query = `
      SELECT index, country, name, state, county, normalized_name, lat, lng
      FROM worldtime
      WHERE normalized_name ILIKE $1
      ORDER BY similarity(normalized_name, $2) DESC
    `;

    const values = [`%${city}%`, city];
    const result = await con.query(query, values);

    response.json(result.rows);
  } catch (e) {
    console.error(e);
    response.status(500).json({ message: e.message });
  }
});

async function startServer() {
  try {
    await con.connect();
    await con.query("CREATE EXTENSION IF NOT EXISTS pg_trgm");
    console.log("pg connected");

    server.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();

