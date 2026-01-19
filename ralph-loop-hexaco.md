/ralph-wiggum:ralph-loop 'Implement the HEXACO-60 personality test. CI passing is the source of truth.

Steps each iteration:

1. FIRST ITERATION ONLY - Create worktree and set up:
   cd /Users/emilycogsdill/Documents/GitHub/mesearch
   git fetch origin
   git worktree add ../mesearch-hexaco -b feature/hexaco-60 origin/main
   cd ../mesearch-hexaco
   cp ../mesearch/.env* . 2>/dev/null || true
   npm install

   ALL subsequent work happens in ../mesearch-hexaco

2. Implement HEXACO-60 assessment:
   - Create frontend/data/hexaco-items.ts with all 60 items
     - 6 dimensions: Honesty-Humility, Emotionality, Extraversion, Agreeableness, Conscientiousness, Openness
     - 10 items per dimension (4 facets x 2-3 items each)
     - Include: item text, dimension, facet, reverse-scoring flag
     - Reference: https://hexaco.org and https://hexaco.org/downloads/ScoringKeys_60.pdf
   - Create frontend/data/hexaco-scoring.ts with scoring logic
     - Reverse score items where flagged (6 - response for 5-point scale)
     - Calculate dimension means (average of 10 items)
     - Calculate facet means (average of 2-3 items per facet)
   - Create frontend/components/HexacoAssessment.tsx
     - 5-point Likert scale (Strongly Disagree to Strongly Agree)
     - Progress indicator showing completion
     - Add noindex meta tag to prevent search indexing
   - Create frontend/components/HexacoResults.tsx
     - Display all 6 dimension scores with descriptions
     - Highlight Honesty-Humility as unique HEXACO insight vs Big Five
     - Show facet breakdown within each dimension
   - Update frontend/App.tsx with routes for /test/hexaco and /test/hexaco/results

3. Run verification locally:
   cd ../mesearch-hexaco
   npm run typecheck && npm run build:frontend

4. If local verification passes, commit changes:
   cd ../mesearch-hexaco
   git add -A
   git commit -m "Add HEXACO-60 personality assessment

   - 60-item inventory measuring 6 dimensions
   - Scoring with dimension and facet means
   - Results highlighting Honesty-Humility insight
   - Protected from search indexing with noindex meta"

5. Push and create PR:
   cd ../mesearch-hexaco
   git push -u origin HEAD
   gh pr create --title "Add HEXACO-60 personality test" --body "Implements HEXACO-60 personality assessment.

   ## Changes
   - Data layer with 60 items, factor/facet metadata, reverse-scoring
   - Assessment flow with Likert scale and progress indicator
   - Scoring logic for dimension and facet means
   - Results page highlighting Honesty-Humility
   - noindex meta tag to prevent public discovery

   ## Verification
   - npm run typecheck passes
   - npm run build:frontend passes"

6. Check CI status:
   cd ../mesearch-hexaco
   gh pr checks --watch

7. If CI passes (all checks green), output <done>SIGNAL</done>

8. If CI fails, investigate:
   cd ../mesearch-hexaco
   gh run view --log-failed
   Fix the issues based on CI errors and repeat from step 3.

Context:
- Working directory for all work: ../mesearch-hexaco (NOT the main repo)
- Tech stack: Hono + React + Vite + Tailwind (Cloudflare Workers)
- Frontend is in frontend/ directory
- HEXACO official resources at hexaco.org
- Must include noindex meta tag on test pages to prevent public discovery
- Honesty-Humility is the key differentiator from Big Five - emphasize this in results

Key files to create/modify:
- frontend/data/hexaco-items.ts (new) - all 60 items with metadata
- frontend/data/hexaco-scoring.ts (new) - scoring logic
- frontend/components/HexacoAssessment.tsx (new) - test UI
- frontend/components/HexacoResults.tsx (new) - results display
- frontend/App.tsx - add routes

CRITICAL: Task is only complete when:
1. All work is done in ../mesearch-hexaco worktree
2. PR exists on GitHub
3. CI checks pass (typecheck and build)
4. noindex meta tag is present on assessment pages

Output <done>SIGNAL</done> ONLY when PR exists AND CI passes.

If stuck after 5 attempts on the same error, stop and report the blocker.' --completion-promise "SIGNAL" --max-iterations 25
