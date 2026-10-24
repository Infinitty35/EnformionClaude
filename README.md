# Enformion Search Service

A small Express backend that wraps the Enformion people-search API, plus a
one-page web UI to search by name, phone, or email.

## Enformion mapping

Calls use `https://devapi.enformion.com` and the headers `galaxy-ap-name`,
`galaxy-ap-password`, and `galaxy-search-type`, as described in the
[EnformionGO quickstart](https://enformiongo.readme.io/reference/overview).
Paths and search types are set in `src/config.js` and can be overridden
from `.env`. A 4xx body from Enformion is returned unchanged.

| Route | Path | galaxy-search-type | Reference |
| --- | --- | --- | --- |
| name | `/PersonSearch` | `Person` | [Person Search](https://enformiongo.readme.io/reference/person-search) |
| phone | `/Phone/Enrich` | `DevAPICallerID` | [Caller ID](https://enformiongo.readme.io/reference/caller-id) |
| email | `/Email/Enrich` | `DevAPIEmailID` | [Email ID](https://enformiongo.readme.io/reference/email-id) |
| contact | `/Contact/Enrich` | `DevAPIContactEnrich` | [Contact Enrichment](https://enformiongo.readme.io/reference/contact-enrichment) |

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

- `POST /api/search/name` -- body: `{ firstName, lastName, middleName?, city?, state?, dob? }`. Sent as a Person Search with `Page: 1` and `ResultsPerPage: 10`. City and state are sent as `Addresses[].AddressLine2`.
- `POST /api/search/phone` -- body: `{ phone }` (any format, digits are extracted; must be 10 digits). Sent to Caller ID as `###-###-####`.
- `POST /api/search/email` -- body: `{ email }`
- `POST /api/search/contact` -- body with at least two of `firstName`/`lastName`, `phone`, `email`, and `addressLine1`/`addressLine2`. This is the quickstart Contact Enrichment call.

`GET /api/health` returns `{ "status": "ok" }`.

## Security notes

- Never commit `.env` -- it's gitignored. Only `.env.example` (with
  placeholder values) is tracked.
- The rate limiter is in-memory and per-process; put a real gateway/rate
  limiter in front of this if you deploy it publicly.
