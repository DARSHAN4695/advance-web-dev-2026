require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Timestamp
function timestamp() {
  const now = new Date();
  return now.toISOString().replace("T", " ").replace("Z", "");
}

// Middleware
app.use(express.json());

const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

// Pages
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.get("/resources", (req, res) => {
  res.sendFile(path.join(publicDir, "resources.html"));
});

// API
app.post("/api/resources", (req, res) => {
  const {
    action = "",
    resourceName = "",
    resourceDescription = "",
    resourceAvailable = false,
    resourcePrice = 0,
    resourcePriceUnit = ""
  } = req.body || {};

  const resourceAction = String(action).trim();
  const name = String(resourceName).trim();
  const description = String(resourceDescription).trim();
  const available = Boolean(resourceAvailable);
  const price = Number.isFinite(Number(resourcePrice)) ? Number(resourcePrice) : 0;
  const unit = String(resourcePriceUnit).trim();

  console.log("The client's POST request", `[${timestamp()}]`);
  console.log("--------------------------");
  console.log("Action ➡️ ", resourceAction);
  console.log("Name ➡️ ", name);
  console.log("Description ➡️ ", description);
  console.log("Availability ➡️ ", available);
  console.log("Price ➡️ ", price);
  console.log("Price unit ➡️ ", unit);
  console.log("--------------------------");

  return res.json({
    ok: true,
    echo: {
      action: resourceAction,
      resourceName: name,
      resourceDescription: description,
      resourceAvailable: available,
      resourcePrice: price,
      resourcePriceUnit: unit
    }
  });
});

app.use("/api", (req, res) => {
  return res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});