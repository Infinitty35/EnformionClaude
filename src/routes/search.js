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
  const phone = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  const result = await enformion.searchPhone({ Phone: phone });
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
    Page: 1,
    ResultsPerPage: 10,
  };
  if (middleName) payload.MiddleName = middleName.trim();
  if (dob) payload.Dob = dob.trim();
  const line2 = [city, state]
    .filter((part) => typeof part === 'string' && part.trim())
    .map((part) => part.trim())
    .join(', ');
  if (line2) payload.Addresses = [{ AddressLine2: line2 }];

  const result = await enformion.searchPerson(payload);
  res.status(result.ok ? 200 : result.status).json(result.data);
});

// Contact Enrichment from the EnformionGO quickstart. At least two of
// name, phone, address, or email are required by Enformion.
router.post('/contact', async (req, res) => {
  const body = req.body || {};
  const payload = {};
  if (typeof body.firstName === 'string' && body.firstName.trim()) payload.FirstName = body.firstName.trim();
  if (typeof body.middleName === 'string' && body.middleName.trim()) payload.MiddleName = body.middleName.trim();
  if (typeof body.lastName === 'string' && body.lastName.trim()) payload.LastName = body.lastName.trim();
  if (typeof body.phone === 'string' && body.phone.trim()) payload.Phone = body.phone.trim();
  if (typeof body.email === 'string' && body.email.trim()) payload.Email = body.email.trim();
  const addressLine1 = typeof body.addressLine1 === 'string' ? body.addressLine1.trim() : '';
  const addressLine2 = typeof body.addressLine2 === 'string' ? body.addressLine2.trim() : '';
  if (addressLine1 || addressLine2) {
    payload.Address = { addressLine1, addressLine2 };
  }

  const identifierCount = [
    payload.FirstName || payload.LastName,
    payload.Phone,
    payload.Email,
    payload.Address,
  ].filter(Boolean).length;
  if (identifierCount < 2) {
    return res.status(400).json({
      error: 'contact enrichment requires at least two of name, phone, address, or email',
    });
  }

  const result = await enformion.searchContact(payload);
  res.status(result.ok ? 200 : result.status).json(result.data);
});

module.exports = router;
