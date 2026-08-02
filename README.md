# Enformion Search Service

A small Express backend that wraps the Enformion people-search API, plus a
one-page web UI to search by name, phone, or email.

## IMPORTANT: verify against the real docs before going live

This environment's network policy blocked outbound access to
`enformiongo.readme.io` and `enformion.com` while this project was built, so
the integration below (endpoint paths, header names, request field names)
is based on general knowledge of Enformion's API rather than a fetch of the
live docs. **Before using this against real data**, open
https://enformiongo.readme.io/reference/overview yourself and confirm:

- Base URL (`ENFORMION_BASE_URL` in `.env`, currently defaults to
  `https://devapi.enformion.com`)
- Endpoint paths for person/phone/email search (`ENFORMION_PATH_*`)
- The `galaxy-search-type` header value expected per endpoint
  (`ENFORMION_SEARCH_TYPE_*`)
- The exact JSON field names each endpoint expects (`FirstName`, `LastName`,
  `Phone`, `Email`, etc.) -- these are set in `src/routes/search.js`

Everything above is centralized in `src/config.js` (overridable via `.env`)
and `src/routes/search.js`, so if the real docs differ, that's the only
place to change. If a search returns a 4xx from Enformion, the error body
is passed straight through to the UI/response so you can see exactly what
Enformion rejected.

## Setup

```bash
npm install
cp .env.example .env
# edit .env and fill in ENFORMION_API_KEY_NAME / ENFORMION_API_PASSWORD
npm start
```

Then open http://localhost:3000 for the web UI.

## API

All endpoints are `POST`, accept and return JSON, and proxy straight to
Enformion (rate-limited to 30 requests/minute per IP to protect API usage).

- `POST /api/search/name` -- body: `{ firstName, lastName, middleName?, city?, state?, dob? }`
- `POST /api/search/phone` -- body: `{ phone }` (any format, digits are extracted; must be 10 digits)
- `POST /api/search/email` -- body: `{ email }`

`GET /api/health` returns `{ "status": "ok" }`.

## Security notes

- Never commit `.env` -- it's gitignored. Only `.env.example` (with
  placeholder values) is tracked.
- The rate limiter is in-memory and per-process; put a real gateway/rate
  limiter in front of this if you deploy it publicly.
