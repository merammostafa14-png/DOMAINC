const express = require("express");
const { login, register } = require("../controllers/authController");
const verifyAuth = require("../utils/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", verifyAuth, (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.user_metadata.full_name,
      },
    },
  });
});

module.exports = router;
