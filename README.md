# 🏟️ Live Football Scoreboard (TypeScript)

A simple, in-memory TypeScript module for tracking live football matches — including match creation, score updates, and summary reporting.

## 📦 Installation

```bash
# FIXME: TO BE DONE, NOT YET IMPLEMENTED
# npm install scoreboard
```

---

## ✨ Features

- Start a new match between two teams.
- Update scores in real-time.
- Finish and remove matches.
- Retrieve live match summaries.
- Prevent duplicate or reversed team matchups.

---

## 🚀 Usage Example

```ts
import { Scoreboard } from "./Scoreboard.ts";

const scoreboard = new Scoreboard();

// Start a new match
const match = scoreboard.startMatch("Spain", "Brazil");

// Update the score
scoreboard.updateScore(match.id, 3, 1);

// Get current summary
const summary = scoreboard.getSummary();
console.log(summary);

// Finish the match
scoreboard.finishMatch(match.id);
```

---

## 🧪 Running Tests

Uses [Vitest](https://vitest.dev/) for test coverage.

```bash
npm run test
```

---

## 📚 Sorting Rules

Matches in `getSummary()` are:

1. Ordered by total score (descending),
2. Tied scores are ordered by most recent `startTime`.

---

## 🛡 Error Handling

All operations throw clear errors when:

- The match ID is not found.
- A duplicate or reversed match is attempted.
- Score updates are applied to non-existent matches.

---
