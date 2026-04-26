const express = require("express");
const { getPlans } = require("../controllers/plansController");

const router = express.Router();

router.get("/", getPlans);

module.exports = router;
