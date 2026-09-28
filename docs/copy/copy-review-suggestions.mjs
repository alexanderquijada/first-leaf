// Suggestions for the copy review (docs/copy/COPY-REVIEW.md), rebuilt by `npm run copy:review`.
// Keys are row ids ("file:key", or "data:..." for data text). A row is APPROVED while its text
// matches docs/copy/approved.json (Alex's sign-off) and DRAFT otherwise. After a round of
// approvals: apply the wording, run `npm run copy:review -- --approve`, and trim this file.

export const INTRO = (total) => `
# Copy review · Phase 6

**Status:** Phase 2's copy sign-off is closed (Alex, Sept. 25). A row is **APPROVED** while its text still matches what Alex signed off (\`docs/copy/approved.json\`) and **DRAFT** when it is new or changed since, so DRAFT rows are exactly what needs a look. Nothing in the "Suggested rewrite" column has been applied.

**What this covers:** all ${total} pieces of text a person can read or hear in First Leaf: every string in the copy files and the text that comes from the data (alerts, the ten investments, the story's sentences, the glossary). Built by \`npm run copy:review\` from the live pages.

**How to read a row**

- **Where it appears:** the screens where it was found on the laptop (1280px) and phone (390px) layouts, and where it lives (\`file:key\`, or \`data:\` for data files).
- **Text as shown:** as rendered for Rosa's normal account. Strings not on a captured screen are filled with example values, and say so.
- **Grade:** Flesch-Kincaid, as rule L5 scores it; "label" means 3 words or fewer. The limit is 8. Only CoinGecko's fixed credit is exempt.
- **Other scenario versions:** the "Nothing needs you" and brand-new accounts.
- **Suggested rewrite / Why:** a suggestion to approve, or a note on why the row changed.
`;

// Phase 6 (Alex's review round, Sept. 28): new and changed rows are DRAFT until Alex approves.
// Every row whose text changed shows as DRAFT automatically; these notes say why.
export const CHANGED = {
  'shared:beneficiaryFlow.title': 'New in Phase 6: the beneficiary alert replaces the removed deposit stories; this is its sheet.',
  'shared:beneficiaryFlow.intro': 'New in Phase 6: the beneficiary sheet explains what it sets.',
  'shared:beneficiaryFlow.saved': 'New in Phase 6: the confirmation after saving a beneficiary.',
  'alerts:remindLater': 'New in Phase 6: the second choice on the beneficiary alert.',
  'alerts:remindedStatus': 'New in Phase 6: what "Remind me later" confirms.',
  'data:attention.beneficiary-missing.title': 'New in Phase 6: the one thing that needs Rosa in the default account.',
  'data:attention.beneficiary-missing.body': 'New in Phase 6: explains what a beneficiary is and why brokerages ask.',
  'data:attention.beneficiary-missing.nextStep': 'New in Phase 6: offers the choice, never pushes it.',
  'story:title': 'Renamed in Phase 6: "Your money story" is now "Your Journey".',
  'story:next': 'New in Phase 6: every section ends with a button to the next one.',
  'learn:title': 'Renamed in Phase 6: "Words" is now "Finance Terms".',
  'home:balance.vsPutIn': 'Changed in Phase 6: the sentence moved inside the dark balance card on every size.',
  'data:glossary.invested.short': 'New in Phase 6: "Invested" is the term on the dark card, from Investor.gov.',
}

export const SUGGEST = {
  // ---- carried from earlier reviews, not yet ruled ----
  'home:chart.nowDown': { rewrite: 'On {date}, your balance was {balance}. That is {earned} less than the {moneyIn} you put in.', why: 'Shows only when the balance is below what you put in, exactly when a reader is worried.' },
  'home:mix.set': { rewrite: ' · you set {set}%', why: '"35% set" reads like shorthand. Optional.' },
};

export const TOP = [
  'Approve the Phase 6 rows (all DRAFT): the beneficiary alert and its sheet, the Your Journey sections, the Finance Terms entries and their sources, and the renamed navigation.',
  'Optional, carried from Phase 2: the below-what-you-put-in chart sentence ([[home:chart.nowDown]]) and "you set" on the mix card ([[home:mix.set]]).',
];

export const CONSISTENCY = `
**One name for one idea.** FYIs are "Good to know" as a badge and as a section, on the laptop and the phone. Everything else checked in Phases 2 and 3 still passes.

**Finance Terms.** Only real finance terms are term buttons, each with a source on Investor.gov, SEC.gov, FINRA.org, SIPC.org, IRS.gov or ConsumerFinance.gov (rules L1 and L6). The page and the navigation say \"Finance Terms\"; the word \"chapter\" is gone (Your Journey has sections).

**SIPC.** Only the general fact appears, in three places: the account notice, the Finance Terms entry and the crypto investment pages. G6 and the site crawl block membership and protection claims, "FDIC" and any "not … advice" wording.
`;
