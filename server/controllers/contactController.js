const path = require("path");
const { readJson, writeJson } = require("../utils/jsonStore");

const contactsPath = path.join(__dirname, "..", "data", "contacts.json");

async function submitContact(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, subject, and message are required.",
      });
    }

    const contacts = await readJson(contactsPath, []);
    const entry = {
      id: `contact_${Date.now()}`,
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
    };

    contacts.push(entry);
    await writeJson(contactsPath, contacts);

    res.status(201).json({
      success: true,
      message: "Your request has been received. We will follow up shortly.",
      data: entry,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  submitContact,
};
