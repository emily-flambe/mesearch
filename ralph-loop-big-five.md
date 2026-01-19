/ralph-wiggum:ralph-loop "Implement the Big Five (IPIP-NEO-120) personality test. CI must pass and PR must be created.

Steps each iteration:

1. **FIRST ITERATION ONLY - Create worktree:**
   ```bash
   cd /Users/emilycogsdill/Documents/GitHub/mesearch
   git fetch origin
   git worktree add ../mesearch-big-five -b feature/big-five-ipip-neo origin/main
   cd ../mesearch-big-five
   npm install
   ```
   All subsequent work happens in `/Users/emilycogsdill/Documents/GitHub/mesearch-big-five`

2. **Implement the Big Five test with these components:**

   a) **Data layer** (`frontend/data/big-five-items.ts`):
      - All 120 IPIP-NEO items from https://ipip.ori.org
      - TypeScript types for Item, Facet, Dimension
      - Each item includes: id, text, dimension, facet, isReversed
      - 5 dimensions (O, C, E, A, N), 6 facets each, 4 items per facet

   b) **Scoring logic** (`frontend/data/big-five-scoring.ts`):
      - Reverse scoring: (6 - response) for reversed items
      - Calculate dimension scores (mean of 24 items per dimension)
      - Calculate facet scores (mean of 4 items per facet)
      - Percentile conversion using IPIP norms from https://ipip.ori.org/newNorms.htm
      - Reference: https://github.com/rubynor/bigfive-web

   c) **Assessment component** (`frontend/components/BigFiveAssessment.tsx`):
      - Pre-test instructions screen
      - 5-point Likert scale (1=Strongly Disagree to 5=Strongly Agree)
      - Progress indicator (e.g., 'Question 45 of 120')
      - localStorage persistence for pause/resume
      - Mobile-responsive question display

   d) **Results component** (`frontend/components/BigFiveResults.tsx`):
      - Radar/spider chart for 5 dimensions (use CSS or SVG, no external chart libs)
      - Spectrum bars showing score position
      - Percentile display ('Higher than X% of people')
      - Expandable facet breakdown per dimension
      - Interpretive text based on score level

   e) **Routing** (update `frontend/App.tsx`):
      - Route `/test/big-five` to BigFiveAssessment
      - Route `/test/big-five/results` to BigFiveResults
      - Pass state/localStorage data between components

3. **Run local verification:**
   ```bash
   cd /Users/emilycogsdill/Documents/GitHub/mesearch-big-five
   npm run typecheck && npm run build:frontend
   ```

4. **If local verification passes, commit and push:**
   ```bash
   git add -A
   git commit -m 'Implement Big Five (IPIP-NEO-120) personality test

   - Add 120 IPIP items with dimension/facet/reverse-scoring metadata
   - Implement scoring logic with percentile conversion
   - Create assessment flow with progress and localStorage persistence
   - Add results display with radar chart and facet breakdown'
   git push -u origin feature/big-five-ipip-neo
   ```

5. **Create or update PR:**
   ```bash
   gh pr create --title 'Implement Big Five (IPIP-NEO-120) personality test' --body 'Closes #12

   ## Summary
   - Data layer with all 120 IPIP-NEO items and scoring metadata
   - Assessment flow with 5-point Likert scale and localStorage persistence
   - Scoring with reverse-score handling and percentile conversion
   - Results with radar chart, spectrum bars, and facet breakdown

   ## Test plan
   - [ ] Complete all 120 questions
   - [ ] Verify scores calculate correctly
   - [ ] Check localStorage persistence on refresh
   - [ ] Test mobile responsiveness
   - [ ] Verify radar chart renders correctly' || gh pr view
   ```

6. **Check CI status (SOURCE OF TRUTH):**
   ```bash
   gh pr checks --watch
   ```

7. **If CI passes, output <done>SIGNAL</done>**

8. **If CI fails, diagnose and fix:**
   ```bash
   gh run view --log-failed
   ```
   Then fix the issues and repeat from step 3.

Context:
- Working directory for all implementation: `/Users/emilycogsdill/Documents/GitHub/mesearch-big-five`
- Tech stack: React 19, TypeScript, Tailwind v4, Vite, Cloudflare Workers
- Existing routing uses react-router-dom v7
- Dark/light theme via CSS variables (see existing App.tsx patterns)
- No external chart libraries - use CSS/SVG for radar chart
- Likert scale: 1=Strongly Disagree, 2=Disagree, 3=Neutral, 4=Agree, 5=Strongly Agree
- Reverse scoring formula: (6 - response)
- IPIP items are public domain - reference https://ipip.ori.org/newBigFive.htm

Key files to create/modify:
- frontend/data/big-five-items.ts (new) - 120 items with metadata
- frontend/data/big-five-scoring.ts (new) - scoring and percentile logic
- frontend/components/BigFiveAssessment.tsx (new) - question flow UI
- frontend/components/BigFiveResults.tsx (new) - results display
- frontend/App.tsx - add routes for /test/big-five and /test/big-five/results

CRITICAL: Task is ONLY complete when:
1. PR exists on GitHub
2. CI checks pass (typecheck + build:frontend)
3. All 120 items are included with correct metadata
4. Scoring handles reverse-scored items correctly

Output <done>SIGNAL</done> when PR exists AND CI passes.

If stuck after 5 attempts on the same error, describe the blocker and try an alternative approach." --completion-promise "SIGNAL" --max-iterations 25
