// Suggestions for the copy review (docs/copy/COPY-REVIEW.md), rebuilt by `npm run copy:review`.
// Keys are row ids ("file:key", or "data:..." for data text). A row is APPROVED while its text
// matches docs/copy/approved.json (Alex's sign-off) and DRAFT otherwise. After a round of
// approvals: apply the wording, run `npm run copy:review -- --approve`, and trim this file.

export const INTRO = (total) => `
# Copy review · Phase 4

**Status:** Phase 2's copy sign-off is closed (Alex, Sept. 25). A row is **APPROVED** while its text still matches what Alex signed off (\`docs/copy/approved.json\`) and **DRAFT** when it is new or changed since, so DRAFT rows are exactly what needs a look. Nothing in the "Suggested rewrite" column has been applied.

**What this covers:** all ${total} pieces of text a person can read or hear in First Leaf: every string in the copy files and the text that comes from the data (alerts, the ten investments, the story's sentences, the glossary). Built by \`npm run copy:review\` from the live pages.

**How to read a row**

- **Where it appears:** the screens where it was found on the laptop (1280px) and phone (390px) layouts, and where it lives (\`file:key\`, or \`data:\` for data files).
- **Text as shown:** as rendered for Rosa's normal account. Strings not on a captured screen are filled with example values, and say so.
- **Grade:** Flesch-Kincaid, as rule L5 scores it; "label" means 3 words or fewer. The limit is 8. Only CoinGecko's fixed credit is exempt.
- **Other scenario versions:** the "Nothing needs you" and brand-new accounts.
- **Suggested rewrite / Why:** a suggestion to approve, or a note on why the row changed.
`;

// Rows changed in Phase 4 (the reason is shown in the "Why" column).
export const CHANGED = {
  'shared:severity.fyi': 'Approved rewrite 9 (ruled Sept. 25): the badge and its section share one name, "Good to know".',
  'shared:alerts.fyiTitle': 'Approved rewrite 9 (ruled Sept. 25): "Good to know" everywhere, replacing "Just so you know".',
  'home:phone.fyiTitle': 'Approved rewrite 9 (ruled Sept. 25): the phone uses the same name as the laptop.',
};

export const SUGGEST = {
  // ---- carried from earlier reviews, not yet ruled ----
  'home:chart.nowDown': { rewrite: 'On {date}, your balance was {balance}. That is {earned} less than the {moneyIn} you put in.', why: 'Shows only when the balance is below what you put in, exactly when a reader is worried.' },
  'home:mix.set': { rewrite: ' · you set {set}%', why: '"35% set" reads like shorthand. Optional.' },
};

export const TOP = [
  'Optional, carried from Phase 2: the below-what-you-put-in chart sentence ([[home:chart.nowDown]]) and "you set" on the mix card ([[home:mix.set]]).',
];

export const CONSISTENCY = `
**One name for one idea.** FYIs are "Good to know" as a badge and as a section, on the laptop and the phone. Everything else checked in Phases 2 and 3 still passes.

**SIPC.** Only the general fact appears, in three places: the account notice, the glossary word and the crypto investment pages. G6 and the site crawl block membership and protection claims, "FDIC" and any "not … advice" wording.
`;
