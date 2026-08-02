const express = require('express');
const rateLimit = require('express-rate-limit');
const enformion = require('../enformionClient');
const { validatePhoneInput, validateEmailInput, validateNameInput } = require('../validators');

const router = express.Router();

// Protects the paid Enformion API from accidental abuse/loops.
router.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

router.post('/phone', async (req, res) => {
  const error = validatePhoneInput(req.body);
  if (error) return res.status(400).json({ error });

  const digits = String(req.body.phone).replace(/\D/g, '');
  const result = await enformion.searchPhone({ Phone: digits });
  res.status(result.ok ? 200 : result.status).json(result.data);
});

router.post('/email', async (req, res) => {
  const error = validateEmailInput(req.body);
  if (error) return res.status(400).json({ error });

  const result = await enformion.searchEmail({ Email: req.body.email.trim() });
  res.status(result.ok ? 200 : result.status).json(result.data);
});

router.post('/name', async (req, res) => {
  const error = validateNameInput(req.body);
  if (error) return res.status(400).json({ error });

  const { firstName, middleName, lastName, city, state, dob } = req.body;
  const payload = {
    FirstName: firstName.trim(),
    LastName: lastName.trim(),
  };
  if (middleName) payload.MiddleName = middleName.trim();
  if (dob) payload.Dob = dob.trim();
  if (city || state) {
    payload.Addresses = [{ City: city || '', State: state || '' }];
  }

  const result = await enformion.searchPerson(payload);
  res.status(result.ok ? 200 : result.status).json(result.data);
});

module.exports = router;
