# Design Notebook: ThreadTracker

## P1: Design (2026-10-06)

**Initial idea.** A discussion board for a book, organized as a chart with chapters as rows and concepts as columns, for async book clubs, avoiding spoilers, and writing essays. Additionally, a vocab tracker.

**Comparables.** Fable already does spoiler-free chapter discussion, and Perusall and LitCharts come close to the chart. Thus, the new part is the literary element axis and exporting for essays, not spoiler prevention.

**Cutting scope.** Dropped the vocab tracker, as it addresses a different problem, and dropped book clubs to focus on English literature classes.

**LLM.** Considered an LLM to generate prompts or columns, but left it out for now, as it does not address the bad situation.

**Features.** Simplified spoiler prevention from many teacher settings to a tracker each student moves. Named the app ThreadTracker, but "Literary Element Chart" may be too close to LitCharts.

**Concepts.** My first draft was a data model (Post, Comments, User), so I rewrote it as Charting, Posting, Upvoting, Progressing, and Authenticating. Additionally, comments became posts, each post sits in exactly one cell, merging columns was dropped, and exporting is a reaction, not a concept.

**Open issues.** A post in an early row can still mention later events and spoil them. Additionally, deleting a post leaves its upvotes, and it is undecided who can add columns.