require('dotenv').config();

if (!process.env.ENFORMION_API_KEY_NAME || !process.env.ENFORMION_API_PASSWORD) {
  console.warn(
    'Warning: ENFORMION_API_KEY_NAME / ENFORMION_API_PASSWORD are not set. ' +
      'Copy .env.example to .env and fill in your credentials before searching.'
  );
}

module.exports = {
  port: process.env.PORT || 3000,
  enformion: {
    baseUrl: process.env.ENFORMION_BASE_URL || 'https://devapi.enformion.com',
    apKeyName: process.env.ENFORMION_API_KEY_NAME || '',
    apPassword: process.env.ENFORMION_API_PASSWORD || '',
    paths: {
      person: process.env.ENFORMION_PATH_PERSON || '/PersonSearch',
      phone: process.env.ENFORMION_PATH_PHONE || '/PhoneSearch',
      email: process.env.ENFORMION_PATH_EMAIL || '/EmailSearch',
    },
    searchTypes: {
      person: process.env.ENFORMION_SEARCH_TYPE_PERSON || 'DevAPIPersonSearch',
      phone: process.env.ENFORMION_SEARCH_TYPE_PHONE || 'DevAPIPhoneSearch',
      email: process.env.ENFORMION_SEARCH_TYPE_EMAIL || 'DevAPIEmailSearch',
    },
  },
};
