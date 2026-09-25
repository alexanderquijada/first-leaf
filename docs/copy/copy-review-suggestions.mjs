// Suggestions for the copy review (docs/copy/COPY-REVIEW.md), rebuilt by `npm run copy:review`.
// Keys are row ids ("file:key", or "data:..." for data text). A row is APPROVED while its text
// matches docs/copy/approved.json (Alex's sign-off) and DRAFT otherwise. After a round of
// approvals: apply the wording, run `npm run copy:review -- --approve`, and trim this file.

export const INTRO = (total) => `
# Copy review · Phase 5

**Status:** Phase 2's copy sign-off is closed (Alex, Sept. 25). A row is **APPROVED** while its text still matches what Alex signed off (\`docs/copy/approved.json\`) and **DRAFT** when it is new or changed since, so DRAFT rows are exactly what needs a look. Nothing in the "Suggested rewrite" column has been applied.

**What this covers:** all ${total} pieces of text a person can read or hear in First Leaf: every string in the copy files and the text that comes from the data (alerts, the ten investments, the story's sentences, the glossary). Built by \`npm run copy:review\` from the live pages.

**How to read a row**

- **Where it appears:** the screens where it was found on the laptop (1280px) and phone (390px) layouts, and where it lives (\`file:key\`, or \`data:\` for data files).
- **Text as shown:** as rendered for Rosa's normal account. Strings not on a captured screen are filled with example values, and say so.
- **Grade:** Flesch-Kincaid, as rule L5 scores it; "label" means 3 words or fewer. The limit is 8. Only CoinGecko's fixed credit is exempt.
- **Other scenario versions:** the "Nothing needs you" and brand-new accounts.
- **Suggested rewrite / Why:** a suggestion to approve, or a note on why the row changed.
`;

// Rows new in Phase 5: each fixes something an independent reviewer found. DRAFT until Alex approves.
const REV = (lens, what) => `New in Phase 5: the ${lens} reviewer found ${what}.`
export const CHANGED = {
  'alerts:facts.triedAgain': REV('P301', 'that a returned deposit could be retried again and again; the alert now shows the retry as a fact'),
  'alerts:facts.pendingSince': REV('P301', 'that a returned deposit could be retried again and again; this is the retry fact\'s value'),
  'funds:lossNote': REV('P301', 'no "ups and downs are normal" note for a loss on a laptop, which the brief promises'),
  'story:sinceMarch.chartTitle1m': REV('P302', 'that chapter 1\'s title said "since March" with 1 month selected'),
  'story:sinceMarch.chartTitle3m': REV('P302', 'that chapter 1\'s title said "since March" with 3 months selected'),
  'story:sinceMarch.layersOn': REV('P302', 'that the layers toggle changed no sentence (the brief: each toggle says what the chart now shows)'),
  'story:sinceMarch.layersOff': REV('P302', 'that the layers toggle changed no sentence'),
  'story:dip.eventsOn': REV('P302', 'that the events toggle changed no sentence'),
  'story:dip.eventsOff': REV('P302', 'that the events toggle changed no sentence'),
  'story:keepGoing.showAnswer': REV('P302', 'that the answer showed before any guess; the guess stays optional through this button'),
  'story:keepGoing.splitTitle': REV('P302', 'that 5c had no chart splitting Nia\'s money into put in and growth'),
  'story:keepGoing.niaMoney': REV('P302', 'the missing 5c chart; this is its line'),
  'story:keepGoing.niaPutIn': REV('P302', 'the missing 5c chart; this is its line'),
  'story:keepGoing.daySplit': REV('P302', 'the missing 5c chart; this is its read-out'),
  'story:keepGoing.colMoney': REV('P302', 'the missing 5c, 5d and 5g charts; this is a table column'),
  'story:keepGoing.colPutIn': REV('P302', 'the missing 5c chart; this is a table column'),
  'story:keepGoing.oneTitle': REV('P302', 'that 5d had no chart'),
  'story:keepGoing.saver': REV('P302', 'that 5d had no chart; this is its line'),
  'story:keepGoing.dayOne': REV('P302', 'that 5d and 5g had no charts; this is their read-out'),
  'story:keepGoing.yourTitle': REV('P302', 'that 5g had no chart'),
  'story:keepGoing.you': REV('P302', 'that 5g had no chart; this is its line'),
  'story:keepGoing.catchTitle': REV('P302', 'that 5e had no chart (and two charts would share one title)'),
  'story:closing.title': REV('P302', 'that the story had no closing takeaway'),
  'story:closing.sources': REV('P302', 'that the closing had no sources'),
  'alerts:pausedUntilToday': REV('P301', 'that "What happened" still said auto-invest "has been paused" after it was turned on'),
  'funds:dividends.exDateWord': REV('P301', 'that "ex-dividend date" had no explanation; the word is now a term button (same words)'),
  'data:glossary.ex-dividend-date.term': REV('P301', 'that "ex-dividend date" had no explanation; this is its new glossary word'),
  'data:glossary.ex-dividend-date.short': REV('P301', 'that "ex-dividend date" had no explanation; this is its new glossary word'),
  'data:glossary.ex-dividend-date.detail': REV('P301', 'that "ex-dividend date" had no explanation; this is its new glossary word'),
  'data:glossary.ex-dividend-date.example': REV('P301', 'that "ex-dividend date" had no explanation; this is its new glossary word'),
}

export const SUGGEST = {
  // ---- carried from earlier reviews, not yet ruled ----
  'home:chart.nowDown': { rewrite: 'On {date}, your balance was {balance}. That is {earned} less than the {moneyIn} you put in.', why: 'Shows only when the balance is below what you put in, exactly when a reader is worried.' },
  'home:mix.set': { rewrite: ' · you set {set}%', why: '"35% set" reads like shorthand. Optional.' },
};

export const TOP = [
  'Approve the new Phase 5 rows (all DRAFT, all grade 8 or below). Each fixes a reviewer finding; the "Why" column says which.',
  'Optional, carried from Phase 2: the below-what-you-put-in chart sentence ([[home:chart.nowDown]]) and "you set" on the mix card ([[home:mix.set]]).',
];

export const CONSISTENCY = `
**One name for one idea.** FYIs are "Good to know" as a badge and as a section, on the laptop and the phone. Everything else checked in Phases 2 and 3 still passes.

**SIPC.** Only the general fact appears, in three places: the account notice, the glossary word and the crypto investment pages. G6 and the site crawl block membership and protection claims, "FDIC" and any "not … advice" wording.
`;
