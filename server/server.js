
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
    const city = request.query.city?.trim();

    if (!city || city.length < 2) {
        return response.json([]);
    }

    try {
       
        const terms = city
            .replace(/,/g, " ")
            .split(/\s+/)
            .filter(Boolean);

        const conditions = [];
        const values = [];

        terms.forEach((term, i) => {
            values.push(`%${term}%`);

            conditions.push(`
                search_text ILIKE $${i + 1}
            `);
        });

        const cityNameParameter = values.length + 1;
        values.push(terms[0]);

        const query = `
            SELECT
                index,
                country,
                name,
                state,
                county,
                normalized_name,
                country_name,
                lat,
                lng
            FROM worldtime

            WHERE ${conditions.join(" AND ")}

            ORDER BY
                CASE
                    WHEN lower(name) = lower($${cityNameParameter})
                    THEN 0
                    ELSE 1
                END,
                name,
                country_name,
                state

            LIMIT 15;
        `;

        const result = await con.query(query, values);

        response.json(result.rows);

    } catch (e) {
        console.error(e);

        response.status(500).json({
            message: "Search failed"
        });
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

