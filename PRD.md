# Product Specification: Personality Test Platform

## Product Vision

A web application that offers a curated collection of personality assessments, allowing users to take tests casually or create accounts to track their results over time and discover insights across multiple frameworks.

**Core Value Proposition:** Unlike scattered free tests across the internet, this platform provides a unified experience where users can build a comprehensive picture of their personality, track how they change over time, and understand how different assessment frameworks relate to each other.

---

## User Personas

### Casual Explorer (Anonymous)
- Wants to take a quick personality test out of curiosity
- Found us through search or social media
- May not want to create an account
- Interested in shareable results

### Self-Discovery Seeker (Registered)
- Interested in deep self-understanding
- Wants to take multiple tests and compare results
- Values tracking changes over time
- Willing to invest time in longer assessments

### Personal Growth Tracker (Power User)
- Regularly retakes tests to monitor change
- Uses results for therapy, coaching, or self-improvement
- Wants exportable data
- Interested in research-backed insights

---

## Information Architecture

```
Home
├── Test Library
│   ├── Test Detail Page (per test)
│   └── Compare Tests
├── Take Test (assessment flow)
├── Results
│   ├── Single Result View
│   ├── Historical Comparison
│   └── Cross-Test Insights
├── My Profile (authenticated)
│   ├── Test History
│   ├── Saved Results
│   └── Settings
└── About
    ├── The Science
    └── FAQ
```

---

## Core User Flows

### Flow 1: Anonymous Test Taking

1. **Landing** → User arrives, sees featured tests
2. **Browse** → User explores test library, reads about options
3. **Select** → User chooses a test, sees overview (time, what it measures)
4. **Consent** → User acknowledges data usage, begins test
5. **Assessment** → User answers questions
6. **Results** → User views results with option to save
7. **Convert** → Prompt to create account to save results

### Flow 2: Registered User Journey

1. **Return** → User logs in, sees dashboard with history
2. **Discover** → User sees recommended next tests based on history
3. **Assess** → User takes new test or retakes previous
4. **Compare** → User views new results against historical data
5. **Synthesize** → User explores cross-test insights
6. **Share/Export** → User shares or downloads results

### Flow 3: Retest and Track

1. **Reminder** → User receives optional notification (3-6 months since last test)
2. **Retest** → User takes same test again
3. **Comparison** → Side-by-side view of then vs. now
4. **Insight** → Highlighted changes with context about typical stability

---

## Page Specifications

### Home / Landing Page

**Purpose:** Orient new visitors, provide quick path to value, re-engage returning users

**Content Sections:**

1. **Hero**
   - Headline: Clear value proposition about understanding yourself
   - Subhead: Mention both casual and tracking use cases
   - Primary CTA: "Take Your First Test" or "Explore Tests"
   - Secondary CTA: "Sign In" (for returning users)

2. **Featured Tests**
   - 3-4 test cards with:
     - Test name and icon
     - Time estimate
     - Scientific credibility badge
     - Brief description (1 sentence)
   - "View All Tests" link

3. **How It Works**
   - 3 steps: Take Tests → Build Your Profile → Track Over Time
   - Visual illustration of the journey

4. **Social Proof (if applicable)**
   - Number of tests taken
   - User testimonials about insights gained

5. **Science Credibility**
   - Brief statement about research-backed assessments
   - Link to "The Science" page

---

### Test Library

**Purpose:** Help users find the right test for their goals

**Layout:** Grid of test cards with filtering/sorting options

**Filter Options:**
- Time required (Quick: <5 min, Standard: 5-15 min, Comprehensive: 15+ min)
- Scientific rigor (Research-Backed, Popular Assessment, Self-Discovery)
- What it measures (Personality Traits, Character Strengths, Type/Style)
- "New to me" vs "Taken before" (for logged-in users)

**Test Card Contents:**
- Test name
- Icon/illustration representing the framework
- Scientific credibility badge (see Badge System below)
- Time estimate
- Number of questions
- Brief tagline
- "Start Test" button
- For logged-in users: Last taken date, "Retake" option

**Sort Options:**
- Recommended (personalized for logged-in users)
- Most Popular
- Quickest First
- Most Comprehensive

---

### Test Detail Page

**Purpose:** Help user decide if this test is right for them, set expectations

**Sections:**

1. **Header**
   - Test name and icon
   - Scientific credibility badge with tooltip explanation
   - Time and question count
   - "Start Test" button (sticky on scroll)

2. **Overview**
   - What this test measures (the dimensions/types)
   - Who it's for / when to take it
   - What you'll learn

3. **The Science** (expandable)
   - Brief history and development
   - Research backing (or lack thereof, stated honestly)
   - How it compares to other frameworks
   - Links to academic sources

4. **What to Expect**
   - Question format (Likert scale, forced choice, etc.)
   - Sample question (non-scored)
   - Tips for accurate results

5. **Your History** (logged-in users who've taken it)
   - Previous scores summary
   - "Retake" button with note about recommended interval
   - Link to full historical view

6. **Related Tests**
   - Other tests that complement this one
   - Tests that measure similar things differently

---

### Assessment Flow (Taking a Test)

**Design Principles:**
- Minimal distraction - no navigation, no sidebar
- Clear progress indication
- One question per screen on mobile, batched on desktop
- Easy to pause and resume (for logged-in users)

**Screens:**

1. **Pre-Test**
   - Test name and brief description
   - Time estimate
   - Instructions for responding honestly
   - "Begin" button

2. **Questions**
   - Progress bar (questions completed / total)
   - Current question text (large, readable)
   - Response options (typically 5-point scale)
   - Previous/Next navigation (optional going back)
   - "Save & Exit" option (logged-in users)
   
   **Response Scale Design:**
   - Labeled endpoints ("Strongly Disagree" to "Strongly Agree")
   - Visual buttons, not dropdowns
   - Selected state clearly indicated
   - Auto-advance to next question after selection (with brief delay)

3. **Completion**
   - Confirmation that responses are saved
   - "View Results" button
   - Brief loading state while scores compute

**Accessibility:**
- Keyboard navigation for all responses
- Screen reader friendly question/answer format
- High contrast mode available
- No time pressure or countdown

---

### Results Page (Single Test)

**Purpose:** Communicate results clearly, provide actionable understanding

**Layout:** Scrolling single page with distinct sections

**Sections:**

1. **Header**
   - Test name
   - Date taken
   - Share button (generates link or image)
   - Download button (PDF)
   - For logged-in: "Compare to Previous" button

2. **Summary**
   - Visual overview of all dimensions (radar chart or bar chart)
   - 1-2 sentence personality snapshot

3. **Dimension Breakdown**
   For each dimension measured:
   - Dimension name and icon
   - Score visualization (where you fall on the spectrum)
   - Percentile or descriptor (e.g., "Higher than 73% of people")
   - What this means (2-3 sentences)
   - Strengths associated with your score
   - Potential challenges
   - Expandable: Facet-level detail (if available)

4. **Patterns & Insights**
   - Notable combinations in your profile
   - How your dimensions interact
   - Research-backed correlations (e.g., "People with your profile tend to...")

5. **Context & Caveats**
   - Reminder about test limitations
   - Note about situational variability
   - Encouragement to use as starting point, not definition

6. **Next Steps**
   - Recommended related tests
   - For anonymous users: CTA to create account and save
   - For logged-in: Add to your profile, schedule retest reminder

---

### Historical Comparison View

**Purpose:** Show how a user's scores have changed across multiple takings of the same test

**Available for:** Logged-in users who've taken a test 2+ times

**Visualizations:**

1. **Timeline View**
   - Line chart with time on X-axis, score on Y-axis
   - One line per dimension
   - Hover to see exact scores and dates
   - Toggle dimensions on/off

2. **Side-by-Side Comparison**
   - Select two specific dates to compare
   - Bar charts showing each dimension
   - Change indicators (↑ ↓ or →)
   - Highlight statistically meaningful changes

3. **Change Summary**
   - Which dimensions changed most
   - Which remained stable
   - Context: "Most people's [dimension] changes less than X points over Y months"

4. **Reflection Prompts**
   - "What was happening in your life during [date range]?"
   - "Do these changes align with how you've felt?"

---

### Cross-Test Insights Page

**Purpose:** Synthesize results from multiple different tests into unified understanding

**Available for:** Users who've completed 2+ different tests

**Sections:**

1. **Your Personality Map**
   - Visual representation showing all dimensions from all tests
   - Color-coded by test/framework
   - Clustered by similarity (e.g., all extraversion-related together)

2. **Consistent Themes**
   - Traits that show up similarly across frameworks
   - "Multiple tests agree that you are..."
   - Confidence indicator based on convergence

3. **Framework Translations**
   - How your Big Five maps to your MBTI
   - How your Enneagram relates to your character strengths
   - Educational content about why frameworks differ

4. **Unique Perspectives**
   - What each framework uniquely reveals
   - Insights only available from specific tests
   - Recommendations for which framework to use when

5. **Contradictions & Nuance**
   - Cases where tests seem to disagree
   - Explanations (different aspects of same trait, situational differences)
   - Invitation for self-reflection

---

### User Dashboard / Profile

**Purpose:** Central hub for logged-in users to see their assessment history and manage their account

**Sections:**

1. **Welcome Back**
   - User's name
   - Quick stats (tests taken, days since last test)
   - Recommended action (new test to try, test due for retake)

2. **Recent Activity**
   - Last 3 tests taken with dates and quick score summary
   - Link to full history

3. **Your Profile Summary**
   - Synthesized personality snapshot (if enough data)
   - "Based on X tests, you tend to be..."
   - Visual personality map

4. **Test History**
   - Filterable/sortable list of all tests taken
   - Each entry shows: Test name, date, key scores, actions (View, Retake, Compare)

5. **Saved Results**
   - Results user explicitly bookmarked
   - Comparison snapshots they've saved

6. **Settings**
   - Email preferences (reminders, newsletter)
   - Retest reminder intervals
   - Data export
   - Delete account / data

---

## Design System Elements

### Scientific Credibility Badges

Three-tier system displayed on all test cards and detail pages:

**🔬 Research-Backed**
- Green badge
- Tooltip: "This assessment is widely used in academic research and has strong evidence for reliability and validity."
- Used for: Big Five (IPIP), HEXACO, VIA

**📊 Popular Assessment**
- Blue badge
- Tooltip: "This assessment is widely used but has limited scientific validation. Results should be considered as one perspective, not definitive."
- Used for: MBTI-style, DISC

**🔮 Self-Discovery Tool**
- Purple badge
- Tooltip: "This assessment is popular for personal exploration but lacks scientific validation. Use for reflection, not diagnosis."
- Used for: Enneagram

### Score Visualizations

**Spectrum Bar**
- Horizontal bar showing full range
- User's score marked with indicator
- Labels at endpoints
- Optional: population distribution overlay

**Radar/Spider Chart**
- Used for multi-dimension overview
- 5-7 axes maximum for readability
- Fill area shows profile shape

**Comparison Bars**
- Paired horizontal bars
- Color-coded for time periods
- Change arrows between them

### Color Palette

- **Primary:** Used for CTAs, key interactions
- **Dimension Colors:** Consistent color per personality dimension across all views
  - Extraversion: Warm orange
  - Agreeableness: Soft green
  - Conscientiousness: Steady blue
  - Neuroticism/Emotionality: Purple
  - Openness: Teal
- **Credibility Badge Colors:** Green (research), Blue (popular), Purple (self-discovery)
- **Change Indicators:** Green (increase), Red (decrease), Gray (stable)

### Typography

- **Headings:** Clean, modern sans-serif
- **Body:** Highly readable, comfortable for long question text
- **Scores/Numbers:** Tabular figures, slightly bolder weight
- **Quotes/Insights:** Subtle italic or different color

### Tone of Voice

- **Encouraging but not hyperbolic:** "Learn about yourself" not "Discover your TRUE self!"
- **Honest about limitations:** Acknowledge what tests can and can't tell you
- **Curious and open:** Frame results as starting points for reflection
- **Non-judgmental:** No score is "good" or "bad"
- **Scientifically grounded:** Reference research without being academic

---

## Mobile Considerations

### Assessment Experience
- One question per screen (full width)
- Large touch targets for response buttons
- Swipe gestures optional (tap still primary)
- Persistent progress bar at top
- Minimal chrome/navigation

### Results Viewing
- Collapse detailed sections by default
- Tap to expand
- Horizontal scroll for comparison tables
- Simplified charts optimized for portrait

### Navigation
- Bottom tab bar for main sections
- Hamburger menu for secondary pages
- Clear back navigation in flows

---

## Accessibility Requirements

- WCAG 2.1 AA compliance minimum
- All images have alt text
- All interactive elements keyboard accessible
- Color is never the only indicator (pair with icons/text)
- Minimum contrast ratios maintained
- Screen reader testing for assessment flow
- Reduced motion option for animations
- Text resizable without breaking layouts

---

## Key Metrics to Track

### Engagement
- Tests started vs. completed (dropout rate)
- Questions per session (for long tests)
- Return visits / active users
- Tests per user

### Conversion
- Anonymous → Registered user rate
- Free results → Premium/detailed report (if applicable)
- Single test → Multiple tests

### Retention
- Users who take 2+ tests
- Users who retake same test
- Time between visits

### Satisfaction
- Post-test rating ("How useful was this?")
- NPS for registered users
- Share rate

---

## Future Considerations (Out of Scope for V1)

- Social features (compare with friends, anonymous aggregate comparisons)
- Premium reports with deeper interpretation
- Integration with journaling or goal-tracking
- Practitioner/coach accounts to send tests to clients
- API access for researchers
- Validated translations for international users
- Workplace team features

---

## Open Questions for User Research

1. How do users feel about the scientific credibility badges? Do they influence test selection?
2. What's the ideal retest interval to suggest? Do users want reminders?
3. How much detail do users actually read in results? Where do they stop scrolling?
4. Do users understand cross-test insights, or is it confusing?
5. What would make users share their results?
6. How do users feel about taking 15+ minute tests? What's the dropout threshold?

---

*Document Version 1.0 | January 2026*
