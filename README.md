# Radio Donations Live

A real-time, on-air donation board for community radio stations that use
**Bloomerang Fundraising (formerly Qgiv)**. New donations appear live during your
pledge drive — with the donor's name, amount, campaign, and any shoutout they
left — plus a sound effect and a "read on-air" checkbox so programmers know
what's already been thanked.

It polls your Bloomerang/Qgiv reporting API every minute and pushes new
donations to the browser over WebSockets. Put it on the screen in your on-air
room and you've replaced the "run back and forth from the phone bank"
problem (and the duct-taped Google Sheet).

This is a configurable, open-source version of the board WYXR (Memphis) built
for its own drives.

---

## Deploy in one click (Render)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

> Replace the link above with `https://render.com/deploy?repo=https://github.com/YOUR_ORG/radio-donations-live` once you've pushed this to GitHub.

1. Click the button. Render reads `render.yaml` and provisions a web service +
   Redis + a small persistent disk for the database.
2. When prompted, fill in:
   - **`QGIV_API_TOKEN`** — your Bloomerang/Qgiv token (see below)
   - **`STATION_NAME`** — e.g. `KKFI`
   - **`STATION_TIMEZONE`** — e.g. `America/Chicago` ([list](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones))
   - **`DASHBOARD_USER`** / **`DASHBOARD_PASSWORD`** — the login for the board
   - **`GOAL_AMOUNT`** *(optional)* — your drive goal in dollars; leave blank to hide the progress bar
   - **`APP_HOST`** *(optional)* — your custom domain, once you set one up
3. Click apply. First deploy takes a few minutes. Your board is at the
   `*.onrender.com` URL Render gives you (or your custom domain).

The free plan works for trying it out but **sleeps when no one is watching** —
fine off-drive, but upgrade the web service to `starter` before a live drive so
it never naps mid-pledge.

---

## Getting your Bloomerang / Qgiv API token

The sync pulls from the Qgiv reporting API (Bloomerang kept it after acquiring
Qgiv). In your admin:

1. Go to **Integrations → API** (or contact Bloomerang/Qgiv support).
2. Create a **permanent token with access to *all forms*** — otherwise donations
   to forms other than your main one won't show up.
3. Paste it as `QGIV_API_TOKEN`.

---

## Configuration reference

Everything is set via environment variables — see [`.env.example`](.env.example):

| Variable | Required | Purpose |
|---|---|---|
| `QGIV_API_TOKEN` | yes | Bloomerang/Qgiv reporting API token ("all forms") |
| `STATION_NAME` | yes | Name shown in the header and title |
| `DASHBOARD_USER` / `DASHBOARD_PASSWORD` | yes | HTTP Basic Auth for the board |
| `STATION_TIMEZONE` | | Localizes donation timestamps (default `America/New_York`) |
| `GOAL_AMOUNT` | | Drive goal in dollars; enables the progress bar |
| `DRIVE_START_DATE` | | Only count donations on/after this date (`YYYY-MM-DD`) toward the goal |
| `APP_HOST` | | Your custom domain (host + WebSocket origin allowlist) |
| `SHOUTOUT_QUESTION` | | The exact donation-form question used as the on-air shoutout |
| `STATION_LOGO_URL` | | URL to your logo (falls back to a generic mark) |
| `ACCENT_COLOR` | | Hex color for the default logo |

The progress bar computes itself from donations the app has synced
(`total raised / goal`), so there's no separate CMS or spreadsheet to wire up.

---

## How it works

```
Bloomerang/Qgiv API  --poll every 60s-->  TransactionSyncJob (Sidekiq)
                                                | saves new donations
                                                v
                                          SQLite  -->  ActionCable (Redis)
                                                              | WebSocket
                                                              v
                                                   Live React board in the
                                                   on-air room (sounds +
                                                   read-on-air checkboxes)
```

- **Ruby on Rails 6.1**, React 18, ActionCable, Sidekiq.
- **SQLite** on a persistent disk — plenty for a single station's drive volume.
- One Render service runs both Puma (web) and the Sidekiq worker; they share the
  database file.

---

## Local development

Requires Ruby 2.7.2, Node 14+, and Redis (optional locally).

```bash
bundle install
yarn install
cp .env.example .env   # fill in QGIV_API_TOKEN at minimum
bundle exec rake db:setup

# in separate terminals:
bundle exec rails s
bundle exec sidekiq    # only needed to test the live sync
```

Visit http://localhost:3000/transactions and log in with your
`DASHBOARD_USER` / `DASHBOARD_PASSWORD`.

> Note: this app targets Ruby **2.7.2** to match its origin. If Render's native
> Ruby runtime no longer offers 2.7.x, you can either bump the Ruby version in
> `.ruby-version` and `Gemfile` (and re-test) or deploy via a container instead.

---

## Contributing

Built by and for community radio. PRs welcome — if your station adapts it or
fixes something, send it back so the next station benefits.

Licensed under the [MIT License](LICENSE).
