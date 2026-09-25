// Suggestions for the copy review (docs/copy/COPY-REVIEW.md), rebuilt by `npm run copy:review`.
// Keys are row ids ("file:key", or "data:..." for data text). A row is APPROVED while its text
// matches docs/copy/approved.json (Alex's sign-off) and DRAFT otherwise. After a round of
// approvals: apply the wording, run `npm run copy:review -- --approve`, and trim this file.

export const INTRO = (total) => `
# Copy review · Phase 3

**Status:** Phase 2's copy sign-off is closed (Alex, Sept. 25). A row is **APPROVED** while its text still matches what Alex signed off (\`docs/copy/approved.json\`) and **DRAFT** when it is new or changed since, so DRAFT rows are exactly what needs a look. Nothing in the "Suggested rewrite" column has been applied.

**What this covers:** all ${total} pieces of text a person can read or hear in First Leaf: every string in the copy files and the text that comes from the data (alerts, the ten investments, the story's sentences, the glossary). Built by \`npm run copy:review\` from the live pages.

**How to read a row**

- **Where it appears:** the screens where it was found on the laptop (1280px) and phone (390px) layouts, and where it lives (\`file:key\`, or \`data:\` for data files).
- **Text as shown:** as rendered for Rosa's normal account. Strings not on a captured screen are filled with example values, and say so.
- **Grade:** Flesch-Kincaid, as rule L5 scores it; "label" means 3 words or fewer. The limit is 8. Only CoinGecko's fixed credit is exempt.
- **Other scenario versions:** the "Nothing needs you" and brand-new accounts.
- **Suggested rewrite / Why:** a suggestion to approve, or a note on why the row changed.
`;

// Rows changed in Phase 3 (the reason is shown in the "Why" column).
const R = (n) => `Changed by ruling ${n} (Sept. 25).`;
export const CHANGED = {
  'shared:dataNotes.stock': `${R(1)} Alex's wording; grade 4.8, no exemption.`,
  'data:attention.sipc-crypto.title': `${R(2)} The general fact only; never implies First Leaf is a member.`,
  'data:attention.sipc-crypto.body': `${R(2)} Alex's wording, verified against sipc.org.`,
  'data:glossary.sipc-protection.detail': `${R(2)} Alex's wording.`,
  'funds:sipc.body': `${R(2)} Alex's wording.`,
  'funds:facts.amount': `${R(5)} Crypto shows "Amount" with its unit ("0.00161928 BTC").`,
  'activity:facts.requestedOn': 'Approved rewrite 10 (Phase 2.5 review).',
  'data:rosaStory.dip': `${R(3)} Seed 10: May 21 to June 5, 9.5%.`,
};

export const SUGGEST = {
  // ---- new in Phase 3, DRAFT: needs approval ----
  'shared:mixGroups.summary': { rewrite: 'Approve as shown', why: 'New: the sentence above the stocks / crypto / cash bar ("Your balance by kind: Stocks 61%, Crypto 17%, Cash 22%.").' },
  'practice:order.reviewBuyCrypto': { rewrite: 'Approve as shown', why: 'New (ruling 5): crypto is reviewed in coins: "Buy $100.00 of BTC at $80,873.58 for one BTC. That is about 0.00123649 BTC." Same for sell.' },
  'practice:col.shares': { rewrite: 'Approve as shown', why: 'New (ruling 5): the Practice column is "Owned", with "0.5950 shares" or "0.00247299 BTC" in each row, because one column holds both.' },
  'activity:facts.paid': { rewrite: 'Approve as shown', why: 'New (ruling 5): a buy\'s dollar row is "You paid", so a crypto buy doesn\'t show two "Amount" rows.' },
  'home:phone.whyMarket': { rewrite: 'Approve as shown', why: 'New (ruling 6): "Why it moved" on the phone is one sentence per piece, and a $0.00 piece is left out. This week: "The market: down $1.67."' },
  'funds:priceNowCrypto': { rewrite: 'Approve as shown', why: 'New (ruling 5): a crypto you don\'t own shows "Price: $80,873.58 for one BTC." instead of "a share".' },
  'data:funds.AAPL.about': { rewrite: 'Approve all ten', why: 'Corrected in Phase 3 (ruling 9): each checked against its 10-K or project site (docs/research/DESCRIPTIONS.md); judgment words removed.' },
  'data:glossary.sipc-protection.short': { rewrite: 'Approve as shown', why: 'Rewritten with ruling 2: "Protection for stocks and cash at a member brokerage that fails." The example is rewritten too.' },
  // ---- a conflict for Alex ----
  'shared:severity.fyi': { rewrite: 'Needs a decision', why: 'Approved rewrite 9 made the badge and its section "Good to know", but ruling 8 names the section "Just so you know", and the rulings win. Both are left as they were; pick one name for both.' },
  // ---- carried from earlier reviews, not yet ruled ----
  'home:chart.nowDown': { rewrite: 'On {date}, your balance was {balance}. That is {earned} less than the {moneyIn} you put in.', why: 'Shows only when the balance is below what you put in, exactly when a reader is worried.' },
  'home:mix.set': { rewrite: ' · you set {set}%', why: '"35% set" reads like shorthand. Optional.' },
};

export const TOP = [
  'Approve the group-bar sentence: "Your balance by kind: Stocks 61%, Crypto 17%, Cash 22%." ([[shared:mixGroups.summary]]).',
  'Approve the crypto wording from ruling 5: the review sentence in coins ([[practice:order.reviewBuyCrypto]]), the "Owned" column ([[practice:col.shares]]), "You paid" on buys ([[activity:facts.paid]]) and the unowned-crypto price line ([[funds:priceNowCrypto]]).',
  'Approve the one-sentence-per-piece "Why it moved" on the phone ([[home:phone.whyMarket]]).',
  'Approve the ten corrected "What it is" descriptions ([[data:funds.AAPL.about]] and the nine rows after it).',
  'Approve the SIPC word\'s new short line and example ([[data:glossary.sipc-protection.short]]).',
  'Decide one name for FYIs: "Just so you know" (ruling 8) or "Good to know" (rewrite 9) ([[shared:severity.fyi]]).',
];

export const CONSISTENCY = `
**What changed since the sign-off.** The rulings replaced some approved text word for word: the stock data note, the SIPC fact, "Amount" for crypto, and the Nia and Theo "not a plan or advice" line, which is removed. Those rows are marked with the ruling. New sentences added to carry the rulings, and the rewritten descriptions, are DRAFT.

**SIPC.** Only the general fact appears, in three places: the account notice, the glossary word and the crypto investment pages. G6 and the site crawl block "Member SIPC", "SIPC member", "protected by SIPC", "SIPC-protected" and "FDIC", as well as any "not … advice" wording.

**One name for one idea.** "FYI" (the badge) and "Just so you know" (its section) are still two names; see the decision above. Everything else checked in Phase 2 still passes.
`;
