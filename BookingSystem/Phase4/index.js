require("dotenv").config();
const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const { body, validationResult } = require("express-validator");

const app = express();
const PORT = process.env.IPORT || 5000;

// Timestamp helper
function timestamp() {
  const now = new Date();
  return now.toISOString().replace("T", " ").replace("Z", "");
}

// Sleep helper
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Middleware
app.use(express.json());

// Serve static files
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

// Views
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.get("/resources", (req, res) => {
  res.sendFile(path.join(publicDir, "resources.html"));
});

// PostgreSQL connection
const pool = new Pool({});

// Wait until DB is reachable
async function waitForDatabase(maxRetries = 10, delayMs = 3000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await pool.query("SELECT 1");
      console.log("Database connection successful.");
      return;
    } catch (err) {
      console.log(`Database not ready yet (attempt ${attempt}/${maxRetries}). Retrying...`);
      if (attempt === maxRetries) {
        throw err;
      }
      await sleep(delayMs);
    }
  }
}

// Create table automatically if missing
async function initDatabase() {
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS resources (
      id SERIAL PRIMARY KEY,
      name VARCHAR(30) NOT NULL,
      description VARCHAR(50) NOT NULL,
      available BOOLEAN NOT NULL,
      price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
      price_unit VARCHAR(10) NOT NULL CHECK (price_unit IN ('hour', 'day', 'week', 'month')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await waitForDatabase();
  await pool.query(createTableSql);
  console.log("Database table 'resources' is ready.");
}

// Validation rules
const resourceValidators = [
  body("action")
    .exists({ checkFalsy: true }).withMessage("action is required")
    .trim()
    .isIn(["create"])
    .withMessage("action must be 'create'"),

  body("resourceName")
    .exists({ checkFalsy: true }).withMessage("resourceName is required")
    .isString().withMessage("resourceName must be a string")
    .trim()
    .isLength({ min: 5, max: 30 }).withMessage("resourceName must be 5-30 characters")
    .matches(/^[A-Za-z0-9\s-]+$/).withMessage("resourceName may contain only letters, numbers, spaces, and hyphens"),

  body("resourceDescription")
    .exists({ checkFalsy: true }).withMessage("resourceDescription is required")
    .isString().withMessage("resourceDescription must be a string")
    .trim()
    .isLength({ min: 10, max: 50 }).withMessage("resourceDescription must be 10-50 characters")
    .not()
    .matches(/<[^>]*>/)
    .withMessage("resourceDescription must not contain HTML or script tags"),

  body("resourceAvailable")
    .exists().withMessage("resourceAvailable is required")
    .isBoolean().withMessage("resourceAvailable must be boolean")
    .toBoolean(),

  body("resourcePrice")
    .exists({ checkFalsy: true }).withMessage("resourcePrice is required")
    .isFloat({ min: 0 }).withMessage("resourcePrice must be a non-negative number")
    .toFloat(),

  body("resourcePriceUnit")
    .exists({ checkFalsy: true }).withMessage("resourcePriceUnit is required")
    .isString().withMessage("resourcePriceUnit must be a string")
    .trim()
    .isIn(["hour", "day", "week", "month"])
    .withMessage("resourcePriceUnit must be 'hour', 'day', 'week', or 'month'")
];

// POST /api/resources
app.post("/api/resources", resourceValidators, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.array().map((e) => ({
        field: e.path,
        msg: e.msg
      }))
    });
  }

  const {
    action,
    resourceName,
    resourceDescription,
    resourceAvailable,
    resourcePrice,
    resourcePriceUnit
  } = req.body;

  console.log("The client's POST request ", `[${timestamp()}]`);
  console.log("------------------------------");
  console.log("Action ➡️ ", action);
  console.log("Name ➡️ ", resourceName);
  console.log("Description ➡️ ", resourceDescription);
  console.log("Availability ➡️ ", resourceAvailable);
  console.log("Price ➡️ ", resourcePrice);
  console.log("Price unit ➡️ ", resourcePriceUnit);
  console.log("------------------------------");

  if (action !== "create") {
    return res.status(400).json({
      ok: false,
      error: "Only create is implemented right now"
    });
  }

  try {
    const insertSql = `
      INSERT INTO resources (name, description, available, price, price_unit)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, description, available, price, price_unit, created_at
    `;

    const params = [
      resourceName.trim(),
      resourceDescription.trim(),
      resourceAvailable,
      resourcePrice,
      resourcePriceUnit
    ];

    const { rows } = await pool.query(insertSql, params);

    return res.status(201).json({
      ok: true,
      data: rows[0]
    });
  } catch (err) {
    console.error("DB insert failed:", err);
    return res.status(500).json({
      ok: false,
      error: "Database error"
    });
  }
});

// 404 for unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  try {
    await initDatabase();
  } catch (err) {
    console.error("Database initialization failed:", err);
  }
});