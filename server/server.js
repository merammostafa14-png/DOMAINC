require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const plansRoutes = require("./routes/plansRoutes");
const domainsRoutes = require("./routes/domainsRoutes");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();
const rootDir = path.join(__dirname, "..");
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});
app.use(express.urlencoded({ extended: true }));

app.use("/api/plans", plansRoutes);
app.use("/api/domains", domainsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use(express.static(rootDir));

app.get("/api/hosting", (req, res) => {
  res.json([
    { name: "Basic Plan", price: "$5" },
    { name: "Pro Plan", price: "$10" }
  ]);
});

app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

app.listen(port, () => {
  console.log(`DOMAINC server listening on http://localhost:${port}`);
});
