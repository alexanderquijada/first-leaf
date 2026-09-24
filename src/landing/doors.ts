// The three case-study doors. Descriptions are the one-sentence summaries in
// BRIEF.md's "Find your brief" table.
export const doors = [
  {
    code: 'P301',
    name: 'Operational dashboard',
    to: '/p301',
    description:
      "Rosa's Sunday weekly review on her laptop: what needs her, how her money is doing, and what every word means.",
  },
  {
    code: 'P302',
    name: 'Interactive data story',
    to: '/p302',
    description: 'A scroll story that argues one point: starting early beats starting big.',
  },
  {
    code: 'P303',
    name: 'Mobile experience',
    to: '/p303',
    description:
      'A 60-second check-in on her phone between patients: does anything need me, and why did my balance move?',
  },
] as const
