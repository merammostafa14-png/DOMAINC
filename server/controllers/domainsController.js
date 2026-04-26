const path = require("path");
const { readJson } = require("../utils/jsonStore");

const domainsPath = path.join(__dirname, "..", "data", "domains.json");

async function getDomainServices(req, res, next) {
  try {
    const domainsData = await readJson(domainsPath, { services: [] });

    res.json({
      success: true,
      data: domainsData.services || [],
    });
  } catch (error) {
    next(error);
  }
}

async function searchDomain(req, res, next) {
  try {
    const domainsData = await readJson(domainsPath, { tlds: [] });
    const query = String(req.body.query || "").trim().toLowerCase();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Domain query is required.",
      });
    }

    const baseName = query.replace(/\.[a-z0-9-]+$/i, "") || "domainc";
    const blockedWords = ["taken", "premium", "reserved"];
    const available = !blockedWords.some((word) => query.includes(word)) && query.length % 3 !== 0;

    const fallbackSuggestions = (domainsData.tlds || []).slice(0, 3).map((tld) => `${baseName}${tld.extension}`);

    res.json({
      success: true,
      data: {
        domain: query,
        available,
        message: available
          ? "This domain looks available. You can proceed to registration."
          : "This domain appears unavailable right now. Try one of these alternatives.",
        suggestions: fallbackSuggestions,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDomainServices,
  searchDomain,
};
