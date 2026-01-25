# Implicit Association Test (IAT) Methodology

This document specifies the official IAT methodology based on Greenwald et al. (2003) [1] and Project Implicit guidelines [2]. Use this as a reference when implementing IAT variants.

---

## Block Structure

The standard IAT uses 7 blocks [1][3]:

| Block | Type | Categories | Trials | Purpose |
|-------|------|------------|--------|---------|
| 1 | Practice | Target A vs Target B | 20 | Learn target discrimination |
| 2 | Practice | Attribute A vs Attribute B | 20 | Learn attribute discrimination |
| 3 | Practice | Target A + Attr A vs Target B + Attr B | 20 | Combined task practice |
| 4 | **Test** | Target A + Attr A vs Target B + Attr B | 40 | Critical measurement block |
| 5 | Practice | Target B vs Target A (reversed) | 40 | Relearn reversed positions |
| 6 | Practice | Target B + Attr A vs Target A + Attr B | 20 | Reversed combined practice |
| 7 | **Test** | Target B + Attr A vs Target A + Attr B | 40 | Critical measurement block |

**Total: 200 trials**

### Block 5 Extended Practice

Block 5 uses 40 trials (not 20) to help participants unlearn the original key assignments. This reduces order effects [1].

---

## Counterbalancing (2×2 Design)

Two independent randomizations, each 50/50 [1][4]:

### 1. Target Side Assignment
- **Standard**: Target A on left (E key), Target B on right (I key)
- **Swapped**: Target B on left (E key), Target A on right (I key)

### 2. Pairing Order
- **Compatible first**: Blocks 3-4 have "expected" pairing (e.g., Flowers+Good)
- **Incompatible first**: Blocks 3-4 have "unexpected" pairing (e.g., Insects+Good)

This creates 4 conditions, each seen by ~25% of participants.

---

## Trial Procedure

### Stimulus Presentation
1. Display category labels at top of screen (left and right)
2. Present stimulus in center
3. Wait for response

### Response Handling [3]
1. Participant presses E (left) or I (right)
2. **If correct**: Record response, proceed to next trial after 250ms interval
3. **If incorrect**: Display red "X" and wait for correct response

### Error Handling ("Built-in Penalty")
When an error occurs [1][3]:
1. Show error feedback (red X)
2. Keep timer running
3. Wait for correct response
4. Record total time from stimulus onset to correct response
5. **Mark trial as ERROR** (even though correct response was eventually made)

This is called the "built-in penalty" — errors are penalized by the additional time needed to correct them.

---

## Response Time Thresholds

| Threshold | Value | Action |
|-----------|-------|--------|
| Too fast | < 300ms | Flag trial; exclude participant if >10% of trials are too fast [1] |
| Too slow | > 10,000ms | Exclude trial from analysis [1] |

### Participant Exclusion
Exclude participant's data entirely if more than 10% of trials have response times under 300ms. This indicates random responding or inattention [1].

---

## D-Score Calculation

The D-score measures the strength of implicit association. Range: approximately -2 to +2 [1].

### Algorithm (Improved D-Score, Greenwald 2003) [1]

```
D = (Mean_Incompatible - Mean_Compatible) / SD_pooled
```

Where:
- **Mean_Incompatible**: Average RT on blocks where "unexpected" pairing shares a key
- **Mean_Compatible**: Average RT on blocks where "expected" pairing shares a key
- **SD_pooled**: Standard deviation of all RTs across both conditions

### Which Blocks to Use

**Modern approach (recommended)** [1]: Use all combined blocks (3, 4, 6, 7)
- Provides more data and better reliability
- Compute D separately for practice (3 vs 6) and test (4 vs 7), then average

**Traditional approach**: Use only test blocks (4 and 7)
- Historically used, but modern algorithms include practice blocks

### Handling Errors

Two valid approaches [1]:

1. **Built-in penalty only**: Response time already includes error correction time. No additional penalty.

2. **D600 algorithm**: Add 600ms to error trial response times (on top of built-in penalty).

**Important**: Do NOT use both simultaneously.

### Step-by-Step Calculation [1]

1. Remove trials with RT > 10,000ms
2. Check if >10% of trials are < 300ms → exclude participant
3. For each trial, use RT (with built-in error penalty already included)
4. Separate trials by condition (compatible vs incompatible)
5. Calculate mean RT for each condition
6. Calculate pooled SD across all trials
7. Compute D = (Mean_Incompatible - Mean_Compatible) / SD_pooled
8. Clamp to range [-2, +2]

---

## Interpretation Thresholds

| D-Score Range | Interpretation |
|---------------|----------------|
| D < -0.65 | Strong preference for Target B |
| -0.65 ≤ D < -0.35 | Moderate preference for Target B |
| -0.35 ≤ D < -0.15 | Slight preference for Target B |
| -0.15 ≤ D ≤ 0.15 | Little to no preference |
| 0.15 < D ≤ 0.35 | Slight preference for Target A |
| 0.35 < D ≤ 0.65 | Moderate preference for Target A |
| D > 0.65 | Strong preference for Target A |

These thresholds follow conventions established by Project Implicit [2].

---

## Ethical Requirements

### Framing [2][5]
- Present as "educational self-reflection tool," not diagnostic
- Emphasize that results may differ from conscious beliefs
- Note that single IAT scores have low individual reliability (~0.50 test-retest) [5]

### Disclaimers [2]
- Results can vary between sessions
- Not suitable for hiring, selection, or consequential decisions
- Implicit preference ≠ prejudice or character judgment

### Do Not Share
Project Implicit recommends against sharing individual results publicly. Results are most meaningful at aggregate/group level [2].

---

## Implementation Checklist

- [x] 7-block structure with correct trial counts (20-20-20-40-40-20-40)
- [x] Error feedback (red X) shown on ALL blocks
- [x] Built-in error penalty (timer continues until correct response)
- [x] Track whether error occurred on each trial (separate from final response)
- [x] 2×2 counterbalancing (target side × pairing order)
- [x] Response time thresholds (300ms, 10,000ms)
- [x] Participant exclusion for >10% too-fast trials
- [x] D-score calculation using correct formula
- [x] Appropriate disclaimers and ethical framing
- [x] Links to educational resources

---

## Known Issues in Current Implementation

All major issues have been addressed. The following notes remain for future reference:

### Future Consideration: Blocks Used for D-Score
**Current**: Only blocks 4 and 7 (test blocks)

**Consider**: Modern algorithms recommend using all combined blocks (3, 4, 6, 7) for better reliability [1]. This would be a minor enhancement.

---

## References

[1] Greenwald, A. G., Nosek, B. A., & Banaji, M. R. (2003). Understanding and using the Implicit Association Test: I. An improved scoring algorithm. *Journal of Personality and Social Psychology*, 85(2), 197-216. https://doi.org/10.1037/0022-3514.85.2.197

[2] Project Implicit. (n.d.). *Implicit Association Test*. Harvard University. https://implicit.harvard.edu

[3] SoSciSurvey. (n.d.). *Implicit Association Test (IAT)*. SoSciSurvey Documentation. https://www.soscisurvey.de/help/doku.php/en:create:questions:iat

[4] Nosek, B. A., Greenwald, A. G., & Banaji, M. R. (2005). Understanding and using the Implicit Association Test: II. Method variables and construct validity. *Personality and Social Psychology Bulletin*, 31(2), 166-180. https://doi.org/10.1177/0146167204271418

[5] Nosek, B. A., Greenwald, A. G., & Banaji, M. R. (2007). The Implicit Association Test at age 7: A methodological and conceptual review. In J. A. Bargh (Ed.), *Social psychology and the unconscious: The automaticity of higher mental processes* (pp. 265-292). Psychology Press.
