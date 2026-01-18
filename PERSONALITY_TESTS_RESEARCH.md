# Personality Tests Research for Web App Implementation

## Executive Summary

This document provides research on personality assessments for building a web app that allows users to take tests one-off or track results over time with an account. Tests are organized by scientific rigor, with implementation resources for each.

---

## TIER 1: Scientifically Validated Tests

These tests have strong empirical support and should form the foundation of your platform.

### Big Five / Five Factor Model (OCEAN)

**Scientific Status:** Gold standard in personality psychology, backed by decades of peer-reviewed research across cultures and languages.

**What It Measures:**
- **Openness to Experience** - Creativity, curiosity, appreciation for art and ideas
- **Conscientiousness** - Organization, dependability, self-discipline
- **Extraversion** - Sociability, assertiveness, positive emotionality
- **Agreeableness** - Cooperation, trust, empathy
- **Neuroticism** - Emotional instability, anxiety, moodiness

**Psychometric Properties:**
- Internal consistency: typically α > .80
- Test-retest reliability: > .70 over 4 months
- Strong predictive validity for life outcomes (job performance, relationship satisfaction, health)

**Implementation Resources:**

#### IPIP (International Personality Item Pool)
The IPIP is a **public domain** collection managed by the Oregon Research Institute containing 3,329 items across 250+ scales. Items can be copied, edited, translated, or used for any purpose without permission or fees.

- **Official Site:** https://ipip.ori.org
- **Available Versions:**
  - 50-item Big Five Markers (quick assessment)
  - 100-item IPIP-NEO
  - 120-item IPIP-NEO (recommended balance of brevity and reliability)
  - 300-item IPIP-NEO (full assessment with 30 facets)

- **Scoring Keys:** Available at https://ipip.ori.org/newScoringInstructions.htm
- **Norms:** Available at https://ipip.ori.org/newNorms.htm

#### Open-Source Code Implementations

**1. bigfive-web (Node.js/Next.js)**
- Repository: https://github.com/rubynor/bigfive-web (active development)
- Original: https://github.com/Alheimsins/bigfive-web
- Live demo: https://bigfive-test.com
- License: MIT
- Stack: Next.js, MongoDB
- Features: Multi-language support, result storage, shareable results

**2. five-factor-e (Python)**
- Repository: https://github.com/NeuroQuestAi/five-factor-e
- License: Open source
- Features: Pure Python, no dependencies, supports both 120 and 300 item versions
- Includes complete scoring algorithms with facet-level analysis

**3. personality_test_api (Ruby/Rails)**
- Repository: https://github.com/cheljoh/personality_test_api
- Hosted API: https://personalitytest.herokuapp.com/api/v1/questions
- Returns JSON with 50 questions and scoring

#### Commercial APIs

**Sentino Personality API**
- Website: https://sentino.org/api/
- Supports: Big Five, NEO, RIASEC, MBTI, DISC, HEXACO
- Built on IPIP item pool
- Provides scores, quantiles, confidence metrics, and interpretive insights

#### Datasets for Norming/Research

**Open Source Psychometrics Project**
- URL: https://openpsychometrics.org/_rawdata/
- Contains: Raw data from 50-item IPIP Big Five (19,000+ cases)
- Quality: Equal to or better than Amazon Mechanical Turk data
- Format: CSV with codebooks

---

### HEXACO Model

**Scientific Status:** Strong and growing research support. Developed from cross-cultural lexical studies that found six (not five) factors consistently emerge.

**What It Measures:**
- **Honesty-Humility** - Sincerity, fairness, modesty, lack of greed (unique to HEXACO)
- **Emotionality** - Fearfulness, anxiety, dependence, sentimentality
- **Extraversion** - Social self-esteem, boldness, sociability, liveliness
- **Agreeableness** - Forgiveness, gentleness, flexibility, patience
- **Conscientiousness** - Organization, diligence, perfectionism, prudence
- **Openness to Experience** - Aesthetic appreciation, inquisitiveness, creativity

**Key Advantage:** The Honesty-Humility factor predicts unethical behavior, workplace deviance, and "dark triad" traits better than Big Five alone.

**Psychometric Properties:**
- Internal consistency: Good to excellent (median α = .87)
- Test-retest reliability: Substantial
- Self-observer convergent correlations: Average above .50

**Implementation Resources:**

#### Official Materials
- **Website:** https://hexaco.org
- **Available Versions:**
  - 60-item (10 items per dimension) - suitable when time is short
  - 100-item (recommended for most research)
  - 200-item (for higher facet-level reliability)
  - 24-item Brief HEXACO Inventory (screening only)

- **Scoring Keys:** https://hexaco.org/downloads/ScoringKeys_60.pdf
- **Languages:** 30+ translations available
- **Cost:** Free for non-profit academic research

**Important Limitation:** The authors do not allow hosting on publicly searchable survey sites. Your implementation must be either password-protected or not discoverable via search engines.

---

### VIA Character Strengths

**Scientific Status:** Developed by Christopher Peterson and Martin Seligman as the positive psychology counterpart to the DSM. Strong research base with over 13 million surveys administered.

**What It Measures:** 24 character strengths grouped under 6 virtues:

| Virtue | Character Strengths |
|--------|---------------------|
| Wisdom | Creativity, Curiosity, Judgment, Love of Learning, Perspective |
| Courage | Bravery, Perseverance, Honesty, Zest |
| Humanity | Love, Kindness, Social Intelligence |
| Justice | Teamwork, Fairness, Leadership |
| Temperance | Forgiveness, Humility, Prudence, Self-Regulation |
| Transcendence | Appreciation of Beauty, Gratitude, Hope, Humor, Spirituality |

**Psychometric Properties:**
- Internal consistency: All scales α > .70
- Test-retest reliability: > .70 over 4 months
- Good convergent and discriminant validity

**Implementation Resources:**

#### Official Access
- **Website:** https://www.viacharacter.org
- **Survey Length:** 96 questions (revised version) or 240 questions (original)
- **Time:** ~10-15 minutes
- **Cost:** Free basic survey; detailed reports are paid
- **Researcher Access:** Available through VIA Pro Dashboard

**Note:** This is a proprietary instrument. You would need to either:
1. Direct users to VIA's official survey
2. Partner with VIA Institute for embedded access
3. Create your own character strengths assessment (not using VIA items)

---

## TIER 2: Popular But Scientifically Limited

These tests have widespread popularity and user demand but significant psychometric limitations. Include them for engagement while being transparent about their scientific status.

### Myers-Briggs Type Indicator (MBTI)

**Scientific Status:** Widely criticized by academic psychologists despite enormous popularity.

**What It Claims to Measure:** 4 dichotomies producing 16 personality types:
- Extraversion (E) vs. Introversion (I)
- Sensing (S) vs. Intuition (N)
- Thinking (T) vs. Feeling (F)
- Judging (J) vs. Perceiving (P)

**Scientific Problems:**
- **Poor test-retest reliability:** 39-76% of people get different types when retested after 5 weeks
- **No bimodal distributions:** People cluster around the middle of each dimension, not at extremes
- **Dichotomous scoring loses information:** Someone scoring 51% extraversion is categorized the same as 99%
- **Limited predictive validity:** Does not reliably predict job performance or life outcomes
- **Most supporting research** comes from the Myers-Briggs Foundation's own journal

**Why Include It:** Users expect it. It's culturally ubiquitous. Frame it as "for fun/self-reflection" rather than scientific.

**Implementation Resources:**

#### Open Extended Jungian Type Scales (OEJTS)
A free, open-source alternative that produces MBTI-equivalent results.

- **Website:** https://openpsychometrics.org/tests/OEJTS/
- **Data Available:** Yes, at openpsychometrics.org/_rawdata/
- **License:** Creative Commons Attribution-NonCommercial-ShareAlike

#### Other Open Implementations
- **Repository:** https://github.com/GitCMDR/OpenSourcePersonality
- Uses OEJTS data for machine learning classification

**Recommendation:** If implementing, show users their dimensional scores (how far along each spectrum) rather than just types. This is more accurate and enables meaningful tracking over time.

---

### Enneagram

**Scientific Status:** Very limited empirical support. Popular in spiritual, self-help, and some corporate contexts.

**What It Claims to Measure:** 9 personality types, each with:
- Core fear and desire
- Typical behavior patterns
- "Wings" (adjacent types that modify the core type)
- Integration/disintegration paths (how types behave under stress/growth)

| Type | Name | Core Motivation |
|------|------|-----------------|
| 1 | The Reformer | Desire to be right, improve things |
| 2 | The Helper | Desire to be loved, needed |
| 3 | The Achiever | Desire to be successful, admired |
| 4 | The Individualist | Desire to be unique, authentic |
| 5 | The Investigator | Desire to be competent, understand |
| 6 | The Loyalist | Desire to be secure, supported |
| 7 | The Enthusiast | Desire to be satisfied, fulfilled |
| 8 | The Challenger | Desire to be powerful, in control |
| 9 | The Peacemaker | Desire to be at peace, harmonious |

**Scientific Problems:**
- Factor analyses typically find fewer than 9 factors
- No clustering studies confirm the 9 types
- Mixed evidence for reliability and validity
- Originated from mystical/spiritual traditions, not empirical research
- Rated as "probably discredited" by majority of APA doctoral members surveyed

**Why Include It:** Extremely popular, especially among younger demographics. Users find it engaging and "accurate feeling" even if not scientifically validated.

**Implementation Resources:**

#### OSPP Enneagram of Personality Scales
- **Website:** https://openpsychometrics.org/tests/OEPS/
- Free, open-source implementation
- Data available for research

#### Riso-Hudson Enneagram Type Indicator (RHETI)
- **Proprietary** (Enneagram Institute)
- 144 forced-choice questions
- Better psychometric properties than most Enneagram tests
- Still limited compared to Big Five

**Recommendation:** Present as self-exploration tool. Consider showing how Enneagram types correlate with Big Five dimensions (research exists on this) to provide scientific grounding.

---

### DISC Assessment

**Scientific Status:** High reliability but low validity for predicting real-world outcomes.

**What It Measures:**
- **Dominance** - Direct, results-oriented, forceful
- **Influence** - Enthusiastic, optimistic, collaborative
- **Steadiness** - Patient, reliable, team-oriented
- **Conscientiousness** - Analytical, reserved, systematic

**Psychometric Properties:**
- Test-retest reliability: .86-.89 (good)
- Internal consistency: α = .87 (good)
- Predictive validity for job performance: Low/none

**Scientific Concerns:**
- Widely regarded as pseudoscience by academic psychologists
- DISC dimensions are not independent (correlate with each other)
- Can be better explained as combinations of Big Five traits
- Developed from 1920s theory without modern psychometric validation

**Implementation Notes:**
- Most DISC implementations are proprietary/commercial
- The underlying theory (Marston's DISC) is in public domain
- Creating your own DISC-style assessment is legally possible but would need validation

---

## TIER 3: Other Tests to Consider

### Short-Form Assessments

**Ten-Item Personality Inventory (TIPI)**
- 10 questions measuring Big Five
- Very quick (~1 minute)
- Lower reliability than longer forms but useful for screening
- Public domain

**Big Five Inventory-2 Short Form (BFI-2-S)**
- 30 items
- Good balance of brevity and reliability
- Proprietary (requires permission)

### Domain-Specific Assessments

**RIASEC/Holland Codes (Career Interests)**
- 6 types: Realistic, Investigative, Artistic, Social, Enterprising, Conventional
- Well-validated for career guidance
- IPIP has RIASEC markers available

**Dark Triad (Narcissism, Machiavellianism, Psychopathy)**
- Short Dark Triad (SD3) - 27 items
- Dirty Dozen - 12 items
- Research instruments, use carefully

---

## Technical Implementation Guide

### Database Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Test definitions
CREATE TABLE tests (
    id VARCHAR(50) PRIMARY KEY,  -- e.g., 'ipip-neo-120', 'hexaco-60'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    scientific_tier INTEGER,  -- 1, 2, or 3
    item_count INTEGER,
    estimated_minutes INTEGER,
    is_active BOOLEAN DEFAULT true
);

-- Test items/questions
CREATE TABLE test_items (
    id SERIAL PRIMARY KEY,
    test_id VARCHAR(50) REFERENCES tests(id),
    item_number INTEGER,
    item_text TEXT NOT NULL,
    factor VARCHAR(50),  -- e.g., 'extraversion', 'openness'
    facet VARCHAR(50),   -- e.g., 'friendliness', 'excitement-seeking'
    is_reverse_scored BOOLEAN DEFAULT false,
    UNIQUE(test_id, item_number)
);

-- User test sessions
CREATE TABLE test_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),  -- NULL for anonymous
    test_id VARCHAR(50) REFERENCES tests(id),
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    is_complete BOOLEAN DEFAULT false
);

-- Raw responses (enables re-scoring)
CREATE TABLE test_responses (
    id SERIAL PRIMARY KEY,
    session_id UUID REFERENCES test_sessions(id),
    item_id INTEGER REFERENCES test_items(id),
    response_value INTEGER,  -- 1-5 Likert scale
    responded_at TIMESTAMP DEFAULT NOW()
);

-- Computed scores
CREATE TABLE test_scores (
    id SERIAL PRIMARY KEY,
    session_id UUID REFERENCES test_sessions(id),
    score_type VARCHAR(20),  -- 'dimension' or 'facet'
    score_name VARCHAR(50),  -- e.g., 'extraversion'
    raw_score DECIMAL(5,2),
    percentile INTEGER,
    t_score DECIMAL(5,2),
    computed_at TIMESTAMP DEFAULT NOW()
);
```

### Scoring Algorithm (Python Example)

```python
from typing import Dict, List
from dataclasses import dataclass

@dataclass
class ScoringKey:
    factor: str
    facet: str
    is_reverse: bool
    item_id: int

def score_likert_item(response: int, is_reverse: bool) -> int:
    """Score a 1-5 Likert item, handling reverse scoring."""
    if is_reverse:
        return 6 - response  # 1->5, 2->4, 3->3, 4->2, 5->1
    return response

def calculate_dimension_scores(
    responses: Dict[int, int],  # item_id -> response value
    scoring_keys: List[ScoringKey]
) -> Dict[str, float]:
    """Calculate dimension (factor) scores from raw responses."""

    factor_scores = {}
    factor_counts = {}

    for key in scoring_keys:
        if key.item_id not in responses:
            continue

        score = score_likert_item(responses[key.item_id], key.is_reverse)

        if key.factor not in factor_scores:
            factor_scores[key.factor] = 0
            factor_counts[key.factor] = 0

        factor_scores[key.factor] += score
        factor_counts[key.factor] += 1

    # Return mean scores (1-5 scale)
    return {
        factor: factor_scores[factor] / factor_counts[factor]
        for factor in factor_scores
    }

def raw_to_percentile(raw_score: float, norms: Dict[str, tuple]) -> int:
    """Convert raw score to percentile using normative data.

    norms format: {factor: (mean, std_dev)}
    """
    # This is simplified - real implementation would use
    # actual percentile tables or z-score conversion
    mean, std = norms.get('default', (3.0, 0.7))
    z_score = (raw_score - mean) / std

    # Approximate percentile from z-score
    # In production, use scipy.stats.norm.cdf
    percentile = int(50 + (z_score * 34))
    return max(1, min(99, percentile))
```

### Test-Retest Analysis

```python
from scipy import stats
from typing import List, Tuple

def calculate_test_retest_change(
    scores_t1: Dict[str, float],
    scores_t2: Dict[str, float],
    reliable_change_threshold: float = 0.5  # In SD units
) -> Dict[str, dict]:
    """Analyze changes between two test administrations."""

    results = {}

    for dimension in scores_t1:
        if dimension not in scores_t2:
            continue

        change = scores_t2[dimension] - scores_t1[dimension]

        # Standard error of difference (simplified)
        # In production, use actual test reliability coefficient
        se_diff = 0.7 * (2 * (1 - 0.85)) ** 0.5  # Assuming r=.85

        # Reliable Change Index
        rci = change / se_diff

        results[dimension] = {
            'score_t1': scores_t1[dimension],
            'score_t2': scores_t2[dimension],
            'raw_change': change,
            'rci': rci,
            'is_significant': abs(rci) > 1.96,  # p < .05
            'direction': 'increase' if change > 0 else 'decrease' if change < 0 else 'stable'
        }

    return results
```

### Cross-Test Correlation Matrix

Research-based correlations between frameworks (approximate):

| Big Five | HEXACO | MBTI Dimension |
|----------|--------|----------------|
| Extraversion | Extraversion (.83) | E-I (.74) |
| Agreeableness | Agreeableness (.53) + Honesty-Humility (.42) | T-F (.44) |
| Conscientiousness | Conscientiousness (.85) | J-P (.49) |
| Neuroticism | Emotionality (.69) | - |
| Openness | Openness (.76) | S-N (.72) |
| - | Honesty-Humility | - |

Use these to show users how their results across different tests relate to each other.

---

## User Interface Recommendations

### Transparency About Scientific Status

Display badges or labels on each test:

- **"Research-Backed"** - Big Five, HEXACO, VIA
- **"Popular Assessment"** - MBTI, DISC
- **"Self-Discovery Tool"** - Enneagram

Include tooltips explaining what each means.

### Results Visualization

**For dimensional scores (Big Five, HEXACO):**
- Show continuous scales (not just categories)
- Display percentile ranks with confidence intervals
- Use radar/spider charts for profile overview

**For type-based tests (MBTI, Enneagram):**
- Still show underlying dimensional scores
- Display "fit" percentages for each type
- Avoid false precision

### Tracking Over Time

- Line charts showing score trajectories
- Highlight statistically significant changes
- Compare to population stability data (most traits are ~70-80% stable over time)

### Meta-Analysis Features

For users who've taken multiple tests:
- Show how different frameworks describe similar traits
- Highlight consistent themes across assessments
- Note any contradictions and explain possible reasons

---

## Legal and Ethical Considerations

### Public Domain Tests
- IPIP items: Fully public domain, no restrictions
- Original DISC theory: Public domain (1928)
- OEJTS: Creative Commons, requires attribution

### Restricted Tests
- HEXACO: Free for research only, no public survey sites
- VIA: Proprietary, requires partnership
- Official MBTI: Trademark protected, requires licensing
- NEO-PI-R: Proprietary, requires purchase

### Best Practices
1. **Cite sources** in your app (IPIP requests citation in publications)
2. **Don't claim clinical utility** for non-clinical tests
3. **Store data securely** - personality data is sensitive
4. **Allow data deletion** (GDPR compliance)
5. **Be transparent** about how results are calculated
6. **Avoid employment screening** with tests not validated for that purpose

---

## Recommended Implementation Roadmap

### Phase 1: Foundation
1. Implement IPIP-NEO-120 (Big Five) - your scientifically solid base
2. Build user accounts and result storage
3. Create basic result visualization

### Phase 2: Expanded Tests
4. Add OEJTS (MBTI-equivalent) for popular appeal
5. Add OSPP Enneagram for engagement
6. Implement test-retest tracking

### Phase 3: Advanced Features
7. Add HEXACO (with appropriate access restrictions)
8. Build cross-test analysis features
9. Implement comparative/longitudinal visualizations

### Phase 4: Insights
10. Create "meta-analysis" synthesis reports
11. Add research-backed interpretive content
12. Consider VIA partnership for character strengths

---

## Key References and Resources

### Official Test Sources
| Resource | URL | License |
|----------|-----|---------|
| IPIP | https://ipip.ori.org | Public Domain |
| HEXACO | https://hexaco.org | Free for Research |
| VIA Institute | https://www.viacharacter.org | Proprietary |
| Open Psychometrics | https://openpsychometrics.org | Varies by test |

### Open Source Implementations
| Repository | Language | Test |
|------------|----------|------|
| rubynor/bigfive-web | Node.js/Next.js | Big Five |
| NeuroQuestAi/five-factor-e | Python | Big Five |
| Alheimsins/b5-johnson-120-ipip-neo-pi-r | JavaScript | Big Five items |
| haghish/openpsychometrics | R/Data | Multiple tests |

### Academic References

**Big Five:**
- Goldberg, L. R. (1999). A broad-bandwidth, public domain, personality inventory measuring the lower-level facets of several five-factor models.
- Johnson, J. A. (2014). Measuring thirty facets of the Five Factor Model with a 120-item public domain inventory.

**HEXACO:**
- Lee, K., & Ashton, M. C. (2004). Psychometric properties of the HEXACO Personality Inventory.
- Ashton, M. C., & Lee, K. (2007). Empirical, theoretical, and practical advantages of the HEXACO model.

**MBTI Criticism:**
- Pittenger, D. J. (2005). Cautionary comments regarding the Myers-Briggs Type Indicator.
- Stein, R., & Swan, A. B. (2019). Evaluating the validity of Myers-Briggs Type Indicator theory.

**Enneagram:**
- Rasta, M. et al. (2021). The Enneagram: A systematic review of the literature. *PubMed*

---

*Document compiled January 2026. Scientific consensus may evolve - verify current research before implementation.*
