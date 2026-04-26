const path = require("path");
const { readJson } = require("../utils/jsonStore");

const plansPath = path.join(__dirname, "..", "data", "plans.json");

async function getPlans(req, res, next) {
  try {
    const plans = await readJson(plansPath, []);
    const { category } = req.query;

    const filtered = category ? plans.filter((plan) => plan.category === category) : plans;

    res.json({
      success: true,
      data: filtered,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPlans,
};
