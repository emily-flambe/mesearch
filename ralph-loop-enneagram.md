/ralph-wiggum:ralph-loop 'Implement Enneagram personality test using OSPP (Open Source Psychometrics Project) items. CI passing on GitHub Actions is the source of truth.

Steps each iteration:

1. First iteration only - Create worktree:
   cd /Users/emilycogsdill/Documents/GitHub/mesearch
   git fetch origin
   git worktree add ../mesearch-enneagram -b feature/enneagram origin/main
   cd ../mesearch-enneagram
   cp ../mesearch/.env* . 2>/dev/null || true
   npm install

   All subsequent work happens in /Users/emilycogsdill/Documents/GitHub/mesearch-enneagram

2. Run verification: npm run typecheck && npm run build:frontend

3. If verification fails, fix issues and repeat step 2

4. When verification passes, commit changes:
   git add -A && git commit -m "Add Enneagram personality test with OSPP items"

5. Push and create PR:
   git push -u origin HEAD
   gh pr create --title "Add Enneagram personality test" --body "Implements Enneagram test using OSPP items with 9 type scoring, wing calculation, and results display. Framed as self-discovery tool (not scientifically validated). Attribution: Open Source Psychometrics Project, CC BY-NC-SA."

6. Check CI status: gh pr checks --watch

7. If CI passes, output <done>SIGNAL</done>

8. If CI fails:
   gh run view --log-failed
   Fix based on CI errors and repeat from step 2

Implementation requirements:

Data layer (create these files in frontend/data/):
- enneagram-items.ts: 36 items from OSPP (4 per type), 5-point Likert scale (1=Strongly Disagree to 5=Strongly Agree)
- enneagram-types.ts: 9 type definitions with names, descriptions, core fears, core desires, growth/stress directions
- enneagram-scoring.ts: Functions to calculate raw scores per type, normalize to percentages, identify primary type, calculate wing scores (adjacent types)

Component (create frontend/components/EnneagramResults.tsx):
- Display all 9 type scores as bar chart or visual ranking
- Show primary type with description
- Show wing scores (the two types adjacent to primary)
- Show fit percentages for each type
- Include prominent disclaimer: Self-Discovery Tool - Not Scientifically Validated
- Attribution: Items from Open Source Psychometrics Project (CC BY-NC-SA)

Update frontend/App.tsx:
- Add route for /test/enneagram that renders the assessment
- Assessment flow: introduction -> questions (one at a time or paginated) -> results
- Store responses in component state
- Calculate and display results using scoring functions

Enneagram type reference:
1. Reformer (perfectionist, principled)
2. Helper (caring, interpersonal)
3. Achiever (success-oriented, adaptive)
4. Individualist (sensitive, withdrawn)
5. Investigator (intense, cerebral)
6. Loyalist (committed, security-oriented)
7. Enthusiast (busy, fun-loving)
8. Challenger (powerful, dominating)
9. Peacemaker (easygoing, self-effacing)

Wing scoring: Each type has two wings (adjacent numbers). Type 1 wings are 9 and 2. Type 9 wings are 8 and 1. Show wing as Type Xw Y format (e.g., 4w5 means Type 4 with 5 wing).

Tech stack:
- React 19 with TypeScript
- Tailwind CSS 4 (use existing design system variables from index.css)
- Match existing card-premium, btn-gold, btn-ghost styling patterns
- Use existing ThemeProvider context

Key files:
- frontend/App.tsx (modify)
- frontend/data/enneagram-items.ts (create)
- frontend/data/enneagram-types.ts (create)
- frontend/data/enneagram-scoring.ts (create)
- frontend/components/EnneagramResults.tsx (create)

CRITICAL: Task is only complete when:
1. PR exists on GitHub
2. CI checks pass (typecheck + build)
3. All 9 types have scoring implemented
4. Results show all type scores, primary type, wings, and disclaimer

Output <done>SIGNAL</done> when PR exists and CI passes.

If stuck after 5 attempts on same error, try alternative approach or simplify implementation.' --completion-promise "SIGNAL" --max-iterations 25
