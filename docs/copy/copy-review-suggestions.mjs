// Suggestions for the copy review (docs/copy/COPY-REVIEW.md), rebuilt by `npm run copy:review`.
// Keys are row ids ("file:key", or "data:..." for data text). Only rewrites that make text
// clearer for a nervous first-time investor, fix a consistency problem, or keep a rule.
// After each round of Alex's approvals: apply the approved wording, move the row into CHANGED
// (or delete its suggestion), then rebuild the table.

export const INTRO = (total) => `
# Copy review · Phase 2.5

**Status: every row is DRAFT, waiting for Alex.** This table **supersedes the Phase 2 table** (Sept. 24). Phase 2's approved rewrites 1 to 6 and 8 to 10 are applied; rows they changed say so in the "Why" column ("Changed by approved rewrite N"). Rewrite 7 (the fee sentence) is moot: the fee alert is gone. Nothing in the "Suggested rewrite" column below has been applied.

**What this covers:** all ${total} pieces of text a person can read or hear in First Leaf. That includes every string in the copy files (\`src/shared/copy.json\`, \`src/layouts/copy.json\`, \`src/features/*/copy.json\`) and the text that comes from the data (alerts, the ten investments, the story's sentences, the glossary). Built by \`npm run copy:review\` from the live pages.

**How to read a row**

- **Where it appears:** the screens where it was found on the laptop (1280px) and phone (390px) layouts. The small code is where it lives, \`file:key\` (\`data:\` for the data files).
- **Text as shown:** exactly as rendered for Rosa's normal account, taken from the live pages. Only when a string isn't on any captured screen (an error, a dialog step, a value in a table cell) is it filled with example values, and it says so.
- **Grade:** the Flesch-Kincaid grade as rule L5 scores it. A leading label of 3 words or fewer ("Example:") is set aside, and "label" means every sentence is 3 words or fewer (exempt). The limit is 8. The two data-source credits keep fixed wording and are exempt from the grade only.
- **Other scenario versions:** what the same text says for the "Nothing needs you" account and the brand-new account.
- **Suggested rewrite / Why:** a suggestion to approve, or a note that an approved rewrite changed the row. A dash with no note means keep it as it is.
`;

// Rows that Phase 2's approved rewrites changed (already on screen).
const R = (n) => `Changed by approved rewrite ${n} (Phase 2).`;
export const CHANGED = {
  'story:keepGoing.theoGuess': R(1),
  'data:glossary.deposit.example': R(2),
  'home:phone.fundMoveUp': `${R(3)} The ending "a $X rise" is new; see the recommended rewrites.`,
  'home:phone.fundMoveDown': `${R(3)} The ending "a $X drop" is new; see the recommended rewrites.`,
  'story:titles.1': R(4),
  'home:welcome.step1': R(5),
  'shared:moneyFlow.timing': R(5),
  'shared:moneyFlow.confirmDeposit': R(5),
  'story:titles.6': R(6),
  'story:practice.claim': R(6),
  'practice:order.sold': R(6),
  'data:glossary.practice-mode.short': R(6),
  'data:glossary.practice-mode.example': R(6),
  'practice:banner': 'Changed by ruling B (Phase 2.5): "Practice money. Nothing here touches your account."',
  'shared:practiceErrors.noneOwned': R(8),
  'shared:ranges.1m.label': `${R(9)} Measured at 390px: the three buttons fit on one row, each 48px tall.`,
  'shared:ranges.3m.label': R(9),
  'shared:alerts.nothing': R(10),
  'home:phone.nothing': R(10),
  'shared:alerts.countMany': R(10),
  'shared:alerts.countOne': R(10),
};

export const SUGGEST = {
  // ---- new in Phase 2.5, needs approval ----
  'home:phone.fundMoveDown': { rewrite: 'Approve as shown: "…added up to a $10.99 drop."', why: 'Rewrite 3 approved the opening "Price changes across everything you own added up to…". Filled with the change word, it read "added up to down $10.99", so it ends with "a $10.99 drop" (or "rise"). Needs your OK.' },
  'funds:facts.shares': { rewrite: 'For crypto: "How much you own"', why: '"Shares" of Bitcoin reads oddly (0.00136690 shares). Stocks keep "Shares"; crypto could say "How much you own".' },
  'home:phone.whyShort': { rewrite: 'The market: {market}. No dividends this week. (when there are none)', why: '"Dividends: no change." reads as if dividends could go up or down. Phase 2 suggested "Dividends paid you {dividends}"; this adds the no-dividend version.' },
  'shared:dataNotes.stock': { rewrite: 'Optional: "Daily stock prices are modeled. They match the real closes on Sept. 19, 2025, March 2, 2026 and Sept. 18, 2026."', why: 'Your wording from ruling B is kept exactly (grade 9.2, exempt as a fixed credit). Two shorter sentences would read lower, if you want that.' },
  'data:attention.sipc-crypto.title': { rewrite: 'Approve as shown', why: 'New account notice (the "regulatory alerts" example). Worded from sipc.org. It says what SIPC covers without claiming First Leaf is a member firm; you may want that stated or avoided.' },
  'data:rosaStory.dip': { rewrite: 'Approve as shown', why: 'New dip sentence (data-driven dip): "From May 11 to May 26, falling prices took $34.89 off your balance. That is a drop of 4.2%."' },
  'data:glossary.sipc-protection.detail': { rewrite: 'Approve as shown', why: 'New word, checked against sipc.org ($500,000 including $250,000 cash; no cover for price drops or for crypto that is not a security).' },
  'data:glossary.crypto.short': { rewrite: 'Approve as shown', why: 'New word (crypto), with Bitcoin and SIPC protection. All DRAFT.' },
  'data:funds.AAPL.about': { rewrite: 'Approve all ten', why: 'New one-line descriptions for the ten investments ("What it is"). Plain facts about each company or coin, no opinions.' },
  'home:phone.byFundTitle': { rewrite: 'Approve as shown', why: 'New: "The market, investment by investment" scored grade 10.0, so it is shortened to a label.' },
  // ---- carried from Phase 2 (not yet ruled) ----
  'shared:severity.fyi': { rewrite: 'Good to know', why: '"FYI" is an abbreviation, and its section is called "Just so you know". One name for one idea.' },
  'shared:alerts.fyiTitle': { rewrite: 'Good to know', why: 'Matches the badge (see the row above).' },
  'activity:facts.requestedOn': { rewrite: 'Asked for on', why: 'Every other deposit, and the alert, say "Asked for on". One word per idea.' },
  'home:chart.nowDown': { rewrite: 'On {date}, your balance was {balance}. That is {earned} less than the {moneyIn} you put in.', why: 'Shows only when the balance is below what you put in, exactly when a reader is worried. The current wording is hard to follow.' },
  'home:mix.set': { rewrite: ' · you set {set}%', why: '"35% set" reads like shorthand. Optional.' },
  'not-found:title': { rewrite: 'We could not find that page.', why: 'The other four "could not find" messages don\'t use a contraction. Pick one style.' },
};

export const TOP = [
  'Approve the ending of rewrite 3: "…added up to a $10.99 drop." / "…a $10.99 rise." ([[home:phone.fundMoveDown]]). Filled with the change word, it read "added up to down $10.99".',
  'Approve the new SIPC notice ([[data:attention.sipc-crypto.title]]) and the new word "SIPC protection" ([[data:glossary.sipc-protection.detail]]). Decide whether the app should say, or avoid saying, that First Leaf is a SIPC member.',
  'Approve the ten "What it is" descriptions ([[data:funds.AAPL.about]] and the nine rows after it).',
  'Approve the new words: Stock, Crypto, Bitcoin ([[data:glossary.crypto.short]]).',
  'Crypto pages: "Shares" → "How much you own" ([[funds:facts.shares]]). "0.00136690 shares" of Bitcoin reads oddly.',
  '"Dividends: no change." → "No dividends this week." when there are none ([[home:phone.whyShort]]).',
  'Approve the data-driven dip sentence ([[data:rosaStory.dip]]).',
  'Optional: split the stock data note into two shorter sentences ([[shared:dataNotes.stock]]). Your wording is kept exactly until you say otherwise.',
  '"FYI" → "Good to know", matching its section ([[shared:severity.fyi]], [[shared:alerts.fyiTitle]]). Carried from Phase 2.',
  '"Requested on" → "Asked for on" ([[activity:facts.requestedOn]]). Carried from Phase 2.',
];

export const CONSISTENCY = `
Each finding points to its rows. Rows without a suggestion passed.

**Voice.** Every screen speaks to "you". Rosa's name appears only in the greeting and the brand-new welcome. The Deposit example no longer names her (approved rewrite 2). Passes.

**One word per idea.**
- *Practice money:* one name everywhere on screen (approved rewrite 6). "Pretend money" stays only in the Practice word's other names, for search. Passes.
- *Investment vs. fund:* "fund" is gone from the screen. The page is "Your investments", the column is "Investment", and the kind is "Stock" or "Crypto". Passes.
- *Shares for crypto:* stocks and crypto share the label "Shares" ([[funds:facts.shares]]).
- *Deposit timing:* one sentence everywhere, "It should arrive in 1 to 3 business days." (approved rewrite 5). Passes.
- *Needs you:* the laptop and phone both say "Nothing needs you right now." and "N things need you." (approved rewrite 10). Passes.
- *FYI vs. Just so you know:* still two names ([[shared:severity.fyi]]).

**No disclaimer (ruling B).** No "simulated", "concept", "not real" or "not investment advice" anywhere. Rule G6 and the site crawl check this. The only data notes are the CoinGecko credit ("Powered by CoinGecko API", the wording their terms and attribution guide both accept) and the stock data note.

**Sentence case, dates, money.** Passes. "1 month" and "3 months" replace "1M" and "3M" (approved rewrite 9). Dates follow AP style. Money follows the house format; rule L5 checks every sentence.

**Every value labeled.** Passes (L5). Values in table cells and lists are labeled by their column or heading.

**Error messages.** The "nothing to sell" error now says what to do (approved rewrite 8). Passes.
`;
