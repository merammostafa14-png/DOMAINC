const crypto = require("crypto");

function deriveHash(password, salt) {
  return crypto.createHash("sha256").update(`${salt}${password}`).digest("hex");
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = deriveHash(password, salt);

  return {
    salt,
    hash,
  };
}

function verifyPassword(password, salt, expectedHash) {
  const computedHash = deriveHash(password, salt);
  const expectedBuffer = Buffer.from(expectedHash, "hex");
  const computedBuffer = Buffer.from(computedHash, "hex");

  if (expectedBuffer.length !== computedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, computedBuffer);
}

function createToken(user) {
  return Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString("base64url");
}

module.exports = {
  hashPassword,
  verifyPassword,
  createToken,
};
