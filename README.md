# Radio Donations Live

**A live, on-air donation board for community radio pledge drives.**

When a listener gives through **Bloomerang Fundraising (formerly Qgiv)**, their
donation pops onto a big screen in your on-air room within seconds — name,
amount, campaign, and the shoutout they left for their favorite DJ or show —
with a satisfying *cha-ching* sound. Your hosts can see what's coming in, read
donors on air, and check them off once they've thanked them.

No more running between the phone bank and the booth. No more duct-taped Google
Sheet. Just point a browser at the board and run your drive.

Built by [WYXR](https://wyxr.org) (Memphis) for its own drives, and made
configurable so any station can run it.

---

## What it does

- **Live donations, instantly.** New gifts appear on screen in real time over a
  WebSocket — no refreshing, no waiting.
- **Hear every gift.** A coin sound plays on each new donation, and a level-up
  fanfare when you cross a goal milestone. (There's an "Activate Sound" button to
  satisfy the browser before your drive starts.)
- **Read-on-air checkboxes.** Hosts tap a donation to mark it "read," so the next
  host knows who's already been thanked. Completed gifts dim and strike through.
- **Donor shoutouts and dedications front and center.** Whatever the donor typed
  into your donation form — a shoutout, a DJ pick, a dedication — shows under
  their name so your host can read it on air.
- **Recurring gifts stand out.** Monthly sustainers get a special animated banner
  so hosts can give them an extra shout.
- **A self-updating goal bar.** Set your dollar goal and a progress bar fills
  itself as gifts come in (no separate spreadsheet or website to wire up). Leave
  it blank to hide it.
- **Hourly pace at a glance.** A running tally shows how many gifts and how much
  came in this hour vs. last hour — great for hyping the room.
- **Your station's look.** Your name in the header, your logo, your accent color,
  and 20+ built-in display themes (tap the paintbrush, bottom-right) so it looks
  great on whatever screen you've got.
- **Anonymous donors handled gracefully.** Gifts marked anonymous show as
  "Anonymous Donor" instead of a blank name.
- **Always in sync.** Even if a live update is missed, the board re-checks your
  Bloomerang/Qgiv account every minute, so nothing slips through.

---

## Setting it up in your air room

1. **Pick a screen.** A spare monitor, a TV on the wall, or a laptop in the booth
   — anything that runs a modern browser (Chrome, Edge, Firefox, Safari).
2. **Open the board** at your station's URL and log in with the dashboard
   username/password you set during deploy. Leave the tab open and full-screen
   (`F11` on Windows/Linux, `Ctrl`+`Cmd`+`F` on Mac).
3. **Click "Activate Sound" once** at the start of your drive. Browsers block
   audio until someone interacts with the page — this one click unlocks the
   coin/level-up sounds for the whole session.
4. **Pick a theme** with the paintbrush button (bottom-right) so it's readable on
   your screen from across the room. Your choice is remembered on that screen.
5. **During the drive**, hosts tap a donation after reading it on air to check it
   off. New gifts always appear at the top with a sound.

> Tip: keep the board on a screen the whole on-air team can see, and put a second
> copy on the phone-bank computer so volunteers and hosts are looking at the same
> thing.

---

## Deploy in one click (Render)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/fourgrant/radio-donations-live)

1. Click the button. Render reads `render.yaml` and provisions a web service +
   Redis + a small persistent disk for the database.
2. When prompted, fill in:
   - **`QGIV_API_TOKEN`** — your Bloomerang/Qgiv token (see below)
   - **`STATION_NAME`** — e.g. `KKFI`
   - **`STATION_TIMEZONE`** — e.g. `America/Chicago` ([list](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones))
   - **`DASHBOARD_USER`** / **`DASHBOARD_PASSWORD`** — the login for the board
   - **`GOAL_AMOUNT`** *(optional)* — your drive goal in dollars; leave blank to hide the progress bar
   - **`APP_HOST`** *(optional)* — your custom domain, once you set one up
3. Click apply. The first deploy takes a few minutes. Your board is at the
   `*.onrender.com` URL Render gives you (or your custom domain).

The free plan is great for trying it out but **sleeps when no one's watching** —
fine off-drive, but bump the web service to `starter` before a live drive so it
never naps mid-pledge.

---

## Getting your Bloomerang / Qgiv API token

The board reads from the Qgiv reporting API (Bloomerang kept it after acquiring
Qgiv). In your admin:

1. Go to **Integrations → API** (or contact Bloomerang/Qgiv support).
2. Create a **permanent token with access to *all forms*** — otherwise gifts to
   forms other than your main one won't show up.
3. Paste it in as `QGIV_API_TOKEN`.

---

## Configuration reference

Everything is set via environment variables — see [`.env.example`](.env.example):

| Variable | Required | Purpose |
|---|---|---|
| `QGIV_API_TOKEN` | yes | Bloomerang/Qgiv reporting API token ("all forms") |
| `STATION_NAME` | yes | Name shown in the header and title |
| `DASHBOARD_USER` / `DASHBOARD_PASSWORD` | yes | Login for the board (HTTP Basic Auth) |
| `STATION_TIMEZONE` | | Localizes donation timestamps (default `America/New_York`) |
| `GOAL_AMOUNT` | | Drive goal in dollars; enables the progress bar |
| `DRIVE_START_DATE` | | Only count gifts on/after this date (`YYYY-MM-DD`) toward the goal |
| `APP_HOST` | | Your custom domain (host + WebSocket origin allowlist) |
| `SHOUTOUT_QUESTION` | | The exact donation-form question used as the on-air shoutout |
| `STATION_LOGO_URL` | | URL to your logo (falls back to a generic mark) |
| `ACCENT_COLOR` | | Hex color for the default logo |

The goal bar computes itself from gifts the app has synced
(`total raised / goal`), so there's nothing else to connect.

---

## How it works

```
Bloomerang/Qgiv API  --poll every 60s-->  TransactionSyncJob (Sidekiq)
                                                | saves new donations
                                                v
                                          SQLite  -->  ActionCable (Redis)
                                                              | WebSocket
                                                              v
                                                   Live board on the
                                                   air-room screen (sounds +
                                                   read-on-air checkboxes)
```

- **Ruby 3.3**, **Rails 6.1**, React 18, ActionCable, Sidekiq.
- **SQLite** on a persistent disk — plenty for a single station's drive volume.
- One Render service runs both Puma (web) and the Sidekiq worker; they share the
  database file.

---

## Local development

Requires Ruby **3.3.9**, Node 14+, and (optionally) Redis.

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

Run the tests with `bundle exec rspec`.

---

## Contributing

Built by and for community radio. PRs welcome — if your station adapts it or
fixes something, send it back so the next station benefits.

Licensed under the [MIT License](LICENSE).
