# First Leaf

![First Leaf](docs/brand/first-leaf-lockup.svg)

An invented investing app for people who have never invested before. It is **one app**, reviewed as **three Protogen case studies**, each a lens on it: an operational dashboard (P301), an interactive data story (P302) and a mobile experience (P303).

> **For reviewers:** First Leaf is an invented company for a design case study. Rosa, her accounts and every person are invented. The stock and crypto **names and tickers are real** (Apple, Microsoft, NVIDIA, Costco, Nike, Amazon, Tesla, Bitcoin, Ethereum, Solana). **Crypto prices are real**, from CoinGecko. **Stock prices are modeled**: each stock's daily path is random but forced through its real closing price on Sept. 19, 2025, March 2, 2026 and Sept. 18, 2026 (sources in [docs/research/PRICE-ANCHORS.md](docs/research/PRICE-ANCHORS.md)), because free stock-data licenses don't allow public display. Dividends are the companies' real per-share amounts and dates. This is for learning only. It is not financial advice.
>
> Inside the site, First Leaf is designed to read like a real investing app, so it carries no disclaimer and never says "demo" or "case study" on screen. The only data notes are the ones a real finance app shows: "Powered by CoinGecko API" next to crypto prices (their attribution guide requires it), and a note on stock charts that daily stock prices are modeled between those real closes. Everything a reviewer needs to know about the project is on this page.

**Live site:** https://first-leaf.vercel.app · **Plan:** [BRIEF.md](BRIEF.md) · **Progress:** [STATUS.md](STATUS.md)

---

## For reviewers

First Leaf opens straight into Rosa's app. Each case study is a lens on that one app and is reviewed on its own: jump to yours.

**Scenarios (by URL only).** The app has no demo menu. Add one of these to any address, and it carries through navigation and into the phone view:

| Scenario | Add to the address | What it shows |
|---|---|---|
| Rosa, six months in (default) | `?scenario=normal` | One thing needs her: she hasn't named a beneficiary yet |
| Nothing needs you | `?scenario=all-clear` | The same six months, with a beneficiary named, so nothing needs her |
| Brand-new account | `?scenario=brand-new` | Rosa has just opened her account and hasn't added money yet |

### P301 · Operational dashboard

- **Open:** https://first-leaf.vercel.app on a **laptop** (1280px or wider is best; works from 1024px)
- **Read:** [BRIEF.md](BRIEF.md) §1–3 and §6, then [docs/briefs/P301-BRIEF.md](docs/briefs/P301-BRIEF.md)
- **Code:** `src/features/home/`, `alerts/`, `activity/`, `funds/` · **History:** commits starting `[P301]`
- **Try these:**
  1. On Home, the dark balance card comes first, with **Needs your attention** beside it. Click *"Name a beneficiary for your account"*. Read the alert and open a dotted-underlined finance term, such as **Beneficiary**. Then use **Add a beneficiary**, fill in a name and relationship, and choose **Save**. The alert moves to **Handled** by itself, with **Undo**.
  2. On the balance chart, switch **1 month / 3 months / Since March**, then click **Show as table**.
  3. In the rail, go to **Investments → AAPL**, then **BTC**. Compare the data notes under each price chart, read the **Volatility: X of 5** rating, and find the SIPC notice on the crypto page.
  4. Go to **Activity** and filter by type: *Deposits*, *Buys*, then *Dividends*.
  5. Check every scenario: https://first-leaf.vercel.app/?scenario=normal · https://first-leaf.vercel.app/?scenario=all-clear · https://first-leaf.vercel.app/?scenario=brand-new

### P302 · Interactive data story

- **Open:** https://first-leaf.vercel.app/story (**Your Journey**) on a laptop or a phone
- **Read:** [BRIEF.md](BRIEF.md) §1–3 and §6, then [docs/briefs/P302-BRIEF.md](docs/briefs/P302-BRIEF.md)
- **Code:** `src/features/story/`, `practice/`, `learn/` · **History:** commits starting `[P302]`
- **Try these:**
  1. Use the **section tabs 1–4** under the title (click them, or use the arrow keys and Enter), and the **Next** button at the end of each section.
  2. In section 1, turn **the layers** (what you put in and what it earned) off and on, then change the time range to **1 month**.
  3. In section 2, **show and hide the dip's events** on the chart.
  4. In section 3, move **Theo's sliders** (his start age and his monthly amount) with your arrow keys until he passes Nia.
  5. In section 4, choose **Go to Practice**. Buy $200 of any investment with practice money, choose **New order** and sell part of it, try the **Time machine**, then **Start over**.
  6. Go to **Finance Terms**, search for "crypto" and open **Cryptocurrency**.
  7. Check every scenario: https://first-leaf.vercel.app/story?scenario=normal · https://first-leaf.vercel.app/story?scenario=all-clear · https://first-leaf.vercel.app/story?scenario=brand-new

### P303 · Mobile experience

- **Open:** https://first-leaf.vercel.app/p303 on a laptop (only the real app, inside a phone frame), or open https://first-leaf.vercel.app on your phone
- **Read:** [BRIEF.md](BRIEF.md) §1–3 and §6, then [docs/briefs/P303-BRIEF.md](docs/briefs/P303-BRIEF.md)
- **Code:** `src/layouts/` (the phone shell and bottom tab bar) and the phone parts of each feature · **History:** commits starting `[P303]`
- **Try these:**
  1. Click **Phone view** in the top bar, or use the link above. **Back to full view** (top left) returns to the page you came from.
  2. Without scrolling, read the dark balance card on top (how much did her balance move this week?), then the "needs you" card under it (does anything need Rosa?).
  3. Tap the "needs you" card to open *"Name a beneficiary for your account"*, and look at its **Finance terms on this screen** chips. Then go back to Home (the browser's Back button, or the **Home** tab). The card now shows *Seen*.
  4. Tap **Why it moved**, then tap an investment to see its piece of the change.
  5. On **Term of the Day**, tap **Read more**, close it, then tap **Next term**.
  6. Use the bottom tab bar to reach **Practice** and buy an investment with practice money.
  7. Check every scenario in the phone view: https://first-leaf.vercel.app/p303?scenario=normal · https://first-leaf.vercel.app/p303?scenario=all-clear · https://first-leaf.vercel.app/p303?scenario=brand-new

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
| `src/features/` | One folder per screen family: home, alerts, activity, funds (Investments), story, practice, learn, not-found |
| `tests/` | Playwright tests, axe accessibility scans and the shared console/NaN guard |
| `scripts/` | Data generator, validator + self-test, folder-boundary check, icon check, deploy and live-site checks |

## How the work is organized (AI scaffolding)

This project was planned in Claude (chat) and built by Claude Code, in phases. Each phase ends with a commit per case study and a pushed, verified deploy. The context docs (`BRIEF.md`, `CLAUDE.md`, `STATUS.md`, `docs/`) are updated every session, so the history of decisions is in the repo, not in a chat.

## Data and validation

All data is generated by `scripts/generate-data.mjs`, which reads saved price files and never uses the network:

- **Crypto (BTC, ETH, SOL):** real CoinGecko daily prices for the 12 months ending Sept. 18, 2026, fetched once by `scripts/fetch-crypto.mjs` into `src/shared/data/raw/` with the fetch date and source. The Demo API key lives only in `.env.local` (git-ignored) and never reaches the site. Crypto prices by [CoinGecko](https://www.coingecko.com).
- **Stocks (AAPL, MSFT, NVDA, COST, NKE, AMZN, TSLA):** a seeded random path in log price (a bridge) forced exactly through the real close on three dates, moving with each stock's typical daily volatility. The anchor closes and dividend facts, each with its public source, are in [docs/research/PRICE-ANCHORS.md](docs/research/PRICE-ANCHORS.md).
- **Rosa's account** is simulated from her deposits and auto-invest rules on top of those prices, so every number agrees everywhere.

`npm run validate` checks every rule: the math adds up, the same numbers agree across every lens and every scenario, the stocks hit their anchors exactly (P1), the crypto matches the saved CoinGecko series (P2), every sentence Your Journey says about Rosa is recomputed from her history (R1–R4), only the approved lineup's real names appear, every highlighted finance term has a Finance Terms entry with a cited source (L1, L6), there's no advice language and no project or disclaimer language on screen (G6), and every learner-facing text reads at grade 8 or below. `npm run validate:selftest` proves each rule catches a deliberately broken dataset. A pre-commit hook runs every check before each commit, and a Playwright crawl confirms no project language appears anywhere on screen.

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
