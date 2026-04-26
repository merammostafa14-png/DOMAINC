const express = require("express");
const { getDomainServices, searchDomain } = require("../controllers/domainsController");

const router = express.Router();

router.get("/services", getDomainServices);
router.post("/search", searchDomain);

module.exports = router;
