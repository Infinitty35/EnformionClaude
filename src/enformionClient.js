const axios = require('axios');
const config = require('./config');

// Paths and galaxy-search-type values come from the EnformionGO reference:
// Person Search, Caller ID, Email ID, and Contact Enrichment.
// Override them with ENFORMION_PATH_* / ENFORMION_SEARCH_TYPE_* if needed.

const client = axios.create({
  baseURL: config.enformion.baseUrl,
  timeout: 15000,
});

async function callEnformion(path, searchType, body) {
  try {
    const response = await client.post(path, body, {
      headers: {
        'Content-Type': 'application/json',
        'galaxy-ap-name': config.enformion.apKeyName,
        'galaxy-ap-password': config.enformion.apPassword,
        'galaxy-search-type': searchType,
      },
    });
    return { ok: true, status: response.status, data: response.data };
  } catch (err) {
    if (err.response) {
      return { ok: false, status: err.response.status, data: err.response.data };
    }
    return { ok: false, status: 502, data: { message: `Enformion request failed: ${err.message}` } };
  }
}

module.exports = {
  searchPerson(body) {
    return callEnformion(config.enformion.paths.person, config.enformion.searchTypes.person, body);
  },
  searchPhone(body) {
    return callEnformion(config.enformion.paths.phone, config.enformion.searchTypes.phone, body);
  },
  searchEmail(body) {
    return callEnformion(config.enformion.paths.email, config.enformion.searchTypes.email, body);
  },
  searchContact(body) {
    return callEnformion(config.enformion.paths.contact, config.enformion.searchTypes.contact, body);
  },
};
