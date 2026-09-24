# CLAUDE.md: build rules for First Leaf

You are building **First Leaf**, **one app** reviewed as three Protogen case studies, each a lens on it: **P301** (operational dashboard: Home on a laptop, Alerts, Activity, Funds), **P302** (interactive data story: Your money story, Practice, Words) and **P303** (mobile experience: the whole app under 600px). See BRIEF.md §1–3. Alex is a senior product designer, not a developer. He reviews and redirects; you build. These rules are non-negotiable.

## 0. Start of every session

1. Read **STATUS.md** first. Summarize where we left off in 3–5 plain sentences, then **wait for Alex's go-ahead** before changing anything.
2. Read **BRIEF.md** and the brief for whichever case study the phase touches (`docs/briefs/P30X-BRIEF.md`).
3. Phase prompts live in `docs/CLAUDE-CODE-PROMPTS.md`. Do only what the current phase asks.

## 1. Scope

- **Never invent scope.** If it's not in the brief or the phase prompt, don't build it. If you think something is missing, say so in your report and let Alex decide.
- **Deviations are declared, not hidden.** If you do anything differently from the brief, say what, why, and what you'd recommend. Alex rules on it (ratify / decline / amend) and the ruling goes into the STATUS.md decision log.
- **Brief first.** For any change to agreed behavior: update the brief, commit that on its own, then implement in a second commit.
- **Copy is held for approval.** New or changed user-facing sentences go in your end-of-phase report under "Copy for approval." They can ship marked `DRAFT` in STATUS.md until Alex approves them.

## 2. Commits, pushes and deploys (do these without asking)

- **Commit and push at the end of every phase without asking.** Within a phase, commit each lens's work **separately**, with a prefix:
  `[P301]` Home on desktop, Alerts, Activity, Funds · `[P302]` Your money story, Practice, Words · `[P303]` the phone layout, phone navigation, Phone view and phone-specific screens · `[shared]` shared code, data, tokens, and layouts used at every size · `[docs]` briefs, STATUS, README only.
- Messages say what changed and why, in the present tense: `[P303] Add "Why it moved" waterfall with per-fund breakdown`. Never just "update", "fix", "wip" or "changes".
- After pushing, run `npm run check:deploy`. It waits until Vercel's **Production deployment of this exact commit** has succeeded. Report the short commit hash and the result. **A green badge is not proof.** Only a matching commit hash is.
- If check:deploy times out with the build stuck in "Initializing": Vercel's free plan builds one project at a time *across the whole account*. Another project may be holding the queue. Report it; don't try to fix it from the repo.
- **Never** force-push, `git reset --hard`, rewrite history, or delete branches. (Denied in `.claude/settings.local.json`.)

## 3. Verify, don't assert

Never say "this should work." Before claiming a phase is done, run all of these and paste the key lines of output into your report:

| Check | Command |
|---|---|
| Production build (the dev server hides type errors Vercel rejects) | `npm run build` |
| Data rules | `npm run validate` |
| Data rules can still fail | `npm run validate:selftest` |
| Case-study folder boundaries | `npm run check:boundaries` |
| Live site matches HEAD | `npm run check:deploy` (after push) |
| Live site serves the pages and the same build | `npm run check:live` (after check:deploy) |

- **Render it and look at it.** Take screenshots with Playwright at **390×844, 768×1024 and 1280×800** for every screen you touched, open them, and describe what you see. Some defects only show visually (an icon can be correct and still illegible at 20px).
- **Measure, then report numbers:** computed contrast ratios, rendered font sizes, touch-target sizes, and the grade level of any new copy.
- **A new validation rule must fail first.** Add a broken case to `scripts/validator-selftest.mjs`, show it FAIL, then show the real data PASS.
- **Every new check must be shown failing, on screen, before app code changes.** That covers tests, measurements and scripts, not just validator rules. When a check fails, look at the screen before touching app code: the check itself may be wrong.
- **No console errors, no NaN.** Every Playwright test fails on a console error, an uncaught page error, or visible text containing NaN, undefined, null or [object Object].

## 4. Data

- All data is fictional and lives in `src/shared/data/`. **Never hand-edit generated JSON.** Change `scripts/generate-data.mjs`, run `npm run data:generate`, then `npm run validate`. Only `glossary.json` is hand-written.
- There are **three accounts**, one per demo scenario (`account.json`, `account-all-clear.json`, `account-new.json`). `activity.json` and `attention.json` are keyed by account id. Screens always read the account for the **current scenario** through `useScenario`, never `account.json` directly.
- Run `npm run validate` at the end of every phase that touches data, and before every commit that touches data.
- The same person, balance and dates must mean the same thing in P301, P302 and P303 (rules X1, X2).

## 5. Finance guardrails (standing rules)

1. **Everything is invented:** funds, tickers (always `FL-XXXX`), prices, returns, people, accounts. **No real company names or real tickers**, not even with made-up numbers.
2. **Teach, never advise.** No call to action about a specific investment: no "you should buy/sell", "best fund", "switch to", "guaranteed", no "safe" without saying safe from what, no "most people…". Actions are only about money movement or settings (retry a deposit, add a one-time deposit, auto-invest on/off), always offered as a choice, or about learning. **Exception:** inside Practice, the buttons may say **Buy** and **Sell**, because the money is pretend and the banner says so.
3. **Real account vs. Practice are always visually separate.** Buying and selling happen only in Practice, under a persistent "Practice money, not real" banner.
4. **The risk disclosure is in the footer of every page:** *"Investing involves risk, including losing money you put in. First Leaf is a concept app: accounts, funds and prices shown are simulated. Nothing here is investment advice."* Use `meta.disclaimer`; never retype it. The README carries the full statement (fictional data, learning only, not financial advice).
5. **No real client data, no Slalom data, no real personal or financial data**, ever. No account or routing numbers.
6. **Inside the site, First Leaf reads like a real investing app.** No "made up", "demo", "case study", "for this project", "fictional" or "for reviewers" on screen (rule G6, plus a search of the built app's text). Reviewer and project explanations live only in README.md. Money actions end in realistic confirmations, never "nothing real happens" dialogs. The data rules behind the scenes never loosen.

## 6. Folder boundaries

```
src/shared/             → never imports from layouts/ or features/
src/layouts/            → may import from src/shared/ only (desktop, tablet and phone shells, navigation, Phone view)
src/features/<feature>/ → may import from its own folder and src/shared/ only; never from another feature or from layouts/
                          (features: home, alerts, activity, funds, story, practice, learn, not-found)
src/router/, App.vue, main.ts → may import anything; the router wires layouts and features together
```

If two features need the same thing, move it to `src/shared/`. `npm run check:boundaries` enforces this.

## 7. Build hygiene (learned the hard way on Pelipper Post)

- Scaffold into the **repo root**. `npm create vue@latest` makes a nested folder: move everything up, merge `package.json` (keep our scripts), delete the empty folder.
- Delete starter leftovers: HelloWorld, AboutView, the Vue logo, starter CSS that fights Vuetify.
- Install Vuetify as **`vuetify@^3`**. A bare install resolves to 4.x.
- Vuetify's styles beat custom CSS. When a layout fix "doesn't take," use Vuetify props and utility classes. **Never `!important`.**
- Beating a Vuetify rule takes a **two-class selector** (`.v-card.fl-thing`). Watch for `rounded="lg"` in component defaults (it brings its own `!important`) and for `v-container`'s max-width caps at each breakpoint.
- **Theme-based selectors silently fail in scoped styles** (`:global(.v-theme--x) .foo` doesn't match). Bind a class in the template instead.
- **Never silence Vite's chunk-size warning**, and **don't lazy-load what the first screen needs.**
- After any scaffold or generator runs, **diff and merge every file it overwrote** (package.json, .gitignore, index.html, README…), not just package.json.
- **Verify every `mdi-` icon name against the installed font** (`npm run check:icons`). A misspelled icon renders blank without an error.
- **Lazy-load every route except the first screen:** the app layout and Home load up front, everything else is lazy. State that must survive navigation (demo scenario, practice portfolio, seen flags) lives at **module scope** in its composable, not inside the function.
- `image-rendering: pixelated` is never a blanket rule.
- Fonts come from `@fontsource-variable/newsreader` and `@fontsource-variable/hanken-grotesk` behind CSS variables `--font-display`, `--font-text` and `--font-ui`, so swapping in licensed Klim fonts later is one change.

## 8. Accessibility is a gate

- Text under 18px (or under 14px bold) needs **4.5:1**. Larger text, icons and chart marks need **3:1**. Measure every tinted chip: saturated text on a pale tint of the same hue often fails below 2:1. Darkening a tint of the *same hue* as its text makes contrast worse, not better.
- Color is never the only signal (severity = icon + word + color; gains and losses = the word "up"/"down" in sentences, or a sign with the word in the accessible label in tables and charts, plus color).
- Categorical colors come from the tested palette in BRIEF.md §6. Never use a one-hue ramp for categories.
- Term explanations use the toggletip pattern: a real `<button>` opens and closes on click, tap, Enter or Space and closes on Esc, and the content is announced. **No hover-only content.**
- Keyboard works everywhere with a visible focus ring.
- **P303 touch targets:** every standalone control is at least 48×48px. A term inside a sentence uses WCAG 2.5.8's inline exception; every P303 detail screen also lists its terms as 48px chips under "Words on this screen". P303 body text has a line-height of at least 1.6.
- Bars over scrolling content are **opaque**.

## 9. Copy and layout rules

- Complete, natural sentences. No telegraphic fragments.
- Never label a value without saying what it measures ("Ups and downs: 4 of 5", not "High").
- Card copy must stay true under **every** filter and **every** demo scenario.
- Subtitles are optional and must earn their place. They may explain an unfamiliar visual encoding, never the arithmetic.
- Reading level: grade 8 or below for anything a learner reads (rule L2).
- At most two levels of cards; use separator lines at level three. No row ends in a large empty gap. Numbers in adjacent columns need a real gutter.

## 10. The reference project is READ-ONLY

Pelipper Post (`~/Projects/pelipper-post`) is a model for *patterns*, not content. You may read it. **Never edit, run scripts that write to, commit in, or push from that folder.** Edits there are denied in `.claude/settings.local.json`.

## 11. End-of-phase report (always this shape)

1. **What changed**, per case study, in plain language
2. **Verification**: pasted results of build, validate, selftest, boundaries, check:deploy (with commit hash), and measured values
3. **Screenshots** you took, and what you saw in them
4. **Commits**, in order, with hashes and prefixes
5. **Deviations** from the brief (or "None")
6. **Copy for approval** (or "None")
7. **What Alex should look at**, and what might still be wrong
8. Confirm you updated **STATUS.md** (phase table, NEXT STEP, decision log, known issues)
