function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validatePhoneInput(body) {
  const digits = String(body.phone || '').replace(/\D/g, '');
  if (digits.length !== 10) {
    return 'phone must be a 10-digit US phone number';
  }
  return null;
}

function validateEmailInput(body) {
  const email = String(body.email || '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'email must be a valid email address';
  }
  return null;
}

function validateNameInput(body) {
  if (!isNonEmptyString(body.firstName) || !isNonEmptyString(body.lastName)) {
    return 'firstName and lastName are required';
  }
  return null;
}

module.exports = { validatePhoneInput, validateEmailInput, validateNameInput };
