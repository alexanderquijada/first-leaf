# First Leaf

A made-up investing app for people who have never invested before. It is **one app**, reviewed as **three Protogen case studies**, each a lens on it: an operational dashboard (P301), an interactive data story (P302) and a mobile experience (P303).

> **Disclaimer:** First Leaf is a made-up company for a design case study. Every fund, price, account and person here is fictional. This is for learning only. It is not financial advice.
>
> Inside the site, First Leaf is designed to read like a real investing app, so it never says "demo" or "case study" on screen. Its footer carries a short risk disclosure: *"Investing involves risk, including losing money you put in. First Leaf is a concept app: accounts, funds and prices shown are simulated. Nothing here is investment advice."* Everything a reviewer needs to know about the project is on this page.

**Live site:** https://first-leaf.vercel.app · **Plan:** [BRIEF.md](BRIEF.md) · **Progress:** [STATUS.md](STATUS.md)

---

## For reviewers

First Leaf opens straight into Rosa's app. Each case study is a lens on that one app and is reviewed on its own: jump to yours.

**Scenarios (by URL only).** The app has no demo menu. Add one of these to any address, and it carries through navigation and into the phone view:

| Scenario | Add to the address | What it shows |
|---|---|---|
| Rosa, 7 months in (default) | `?scenario=normal` | A few things need her: a returned deposit, a goal behind plan, cash waiting, a fee change |
| Nothing needs you | `?scenario=all-clear` | A calmer account: every deposit went through and auto-invest stayed on |
| Brand-new account | `?scenario=brand-new` | Rosa has just opened her account and hasn't added money yet |

### P301 · Operational dashboard

- **Open:** https://first-leaf.vercel.app on a **laptop** (1280px or wider is best; works from 1024px)
- **Read:** [BRIEF.md](BRIEF.md) §1–3 and §6, then [docs/briefs/P301-BRIEF.md](docs/briefs/P301-BRIEF.md)
- **Code:** `src/features/home/`, `alerts/`, `activity/`, `funds/` · **History:** commits starting `[P301]`
- **Try these:**
  1. On Home, look at **Needs your attention**. Click *"Your $150 deposit from Sept. 1 was sent back."* Read the alert, open a dotted-underlined word, try **Try the deposit again**, then **Mark as handled**.
  2. On the balance chart, switch **1M / 3M / All**, then click **Show as table**.
  3. In the rail, go to **Funds → FL-GREEN**. Find the yearly fee and its Oct. 1 change.
  4. Go to **Activity**. Filter to *Deposits* and find the returned one. Then choose *Dividends* + *Returned* to see the empty state.
  5. Check every scenario: https://first-leaf.vercel.app/?scenario=normal · https://first-leaf.vercel.app/?scenario=all-clear · https://first-leaf.vercel.app/?scenario=brand-new

### P302 · Interactive data story

- **Open:** https://first-leaf.vercel.app/story on a laptop or a phone (the chart pins beside the text from 1024px)
- **Read:** [BRIEF.md](BRIEF.md) §1–3 and §6, then [docs/briefs/P302-BRIEF.md](docs/briefs/P302-BRIEF.md)
- **Code:** `src/features/story/`, `practice/`, `learn/` · **History:** commits starting `[P302]`
- **Try these:**
  1. In chapter 1, switch **What you put in vs. what it earned**, then change the time range to **1M**.
  2. In chapter 3, **show and hide the July events** on the chart.
  3. In chapter 4, filter the mix to **bonds**.
  4. In chapter 5, **make a guess**, move the **start-age slider** with your arrow keys, raise Theo's amount until he catches up, and switch **Smooth / Bumpy**.
  5. In chapter 6, follow the link into **Practice**. Buy $200 of any fund with pretend money, sell part of it, try the **Time machine**, then **Start over**.
  6. Go to **Words**, search for "fee" and open **Yearly fee**.
  7. Check every scenario: https://first-leaf.vercel.app/story?scenario=normal · https://first-leaf.vercel.app/story?scenario=all-clear · https://first-leaf.vercel.app/story?scenario=brand-new

### P303 · Mobile experience

- **Open:** https://first-leaf.vercel.app/?view=phone on a laptop (the real app inside a phone frame), or open https://first-leaf.vercel.app on your phone
- **Read:** [BRIEF.md](BRIEF.md) §1–3 and §6, then [docs/briefs/P303-BRIEF.md](docs/briefs/P303-BRIEF.md)
- **Code:** `src/layouts/` (the phone shell and bottom tab bar) and the phone parts of each feature · **History:** commits starting `[P303]`
- **Try these:**
  1. Click **Phone view** in the top bar, or use the link above.
  2. Without scrolling: does anything need Rosa, and how much did her balance move this week?
  3. Tap the "needs you" card, read the alert and its **Words on this screen**, then go back. It now shows as *Seen*.
  4. Tap **Why it moved**, then tap a fund to see its share of the change.
  5. Open **Word of the day**, then **Next word**.
  6. Use the bottom tab bar to reach **Practice** and buy a fund with pretend money.
  7. Check every scenario in the phone view: https://first-leaf.vercel.app/?scenario=normal&view=phone · https://first-leaf.vercel.app/?scenario=all-clear&view=phone · https://first-leaf.vercel.app/?scenario=brand-new&view=phone

---

## Repo map

| Path | What it is |
|---|---|
| `BRIEF.md` | The shared plan: product, person, data rules, style, tech, guardrails |
| `docs/briefs/` | One self-contained lens brief per case study |
| `STATUS.md` | Where the project is, every decision, and what went wrong |
| `CLAUDE.md` | Build rules for Claude Code (the AI that writes the code) |
| `docs/CLAUDE-CODE-PROMPTS.md` | Every phase prompt, plus redirect prompts for common problems |
| `docs/SETUP.md` | One-time machine setup (`setup.sh`) |
| `docs/research/` | Research behind the terms, alerts and rules |
| `.claude/` | Claude Code permissions for this repo |
| `src/shared/` | Data, design tokens, components and state used everywhere |
| `src/layouts/` | The desktop, tablet and phone shells, navigation and Phone preview |
| `src/features/` | One folder per screen family: home, alerts, activity, funds, story, practice, learn, about |
| `tests/` | Playwright tests, axe accessibility scans and the shared console/NaN guard |
| `scripts/` | Data generator, validator + self-test, folder-boundary check, icon check, deploy and live-site checks |

## How the work is organized (AI scaffolding)

This project was planned in Claude (chat) and built by Claude Code, in phases. Each phase ends with a commit per case study and a pushed, verified deploy. The context docs (`BRIEF.md`, `CLAUDE.md`, `STATUS.md`, `docs/`) are updated every session, so the history of decisions is in the repo, not in a chat.

## Data and validation

All data is fictional and generated by `scripts/generate-data.mjs`. `npm run validate` checks **42 rules**: the math adds up, the same numbers agree across every lens and every demo scenario, no real tickers or brands appear, there's no advice language, and every learner-facing text reads at grade 8 or below. `npm run validate:selftest` proves each rule catches a deliberately broken dataset (65 cases, including every real defect found so far).

## Run it locally

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build (what Vercel runs)
npm run validate     # data rules
npm run test:e2e     # Playwright tests (first time: npx playwright install chromium)
npm run check        # every local check in one go: build, data rules, boundaries, icons, tests
npm run check:live   # the live site answers and runs the same build as this checkout
```

## Credits

Fonts, illustrations and icons are listed in [docs/CREDITS.md](docs/CREDITS.md).

## License

[MIT](LICENSE)
