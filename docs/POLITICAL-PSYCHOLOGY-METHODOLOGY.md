# Political Psychology Assessments Methodology

This document specifies the methodology for three validated political psychology instruments: Social Dominance Orientation (SDO7), Right-Wing Authoritarianism Very Short Authoritarian Scale (RWA-VSA), and Moral Foundations Questionnaire 2 (MFQ-2). Use this as a reference when implementing these assessments.

---

## Overview

### The Dual-Process Model of Political Attitudes

Political psychology research has converged on a "dual-process" model explaining ideological attitudes [1][2]. Two fundamental motivational dimensions predict most political, social, and intergroup attitudes:

1. **Social Dominance Orientation (SDO)** - Preference for group-based hierarchy and inequality
2. **Right-Wing Authoritarianism (RWA)** - Preference for social conformity, tradition, and submission to authority

These two dimensions are modestly correlated (typically r = .20-.40) but capture distinct psychological motivations [2]. Together, they predict prejudice, political ideology, policy preferences, and intergroup attitudes better than either alone.

The **Moral Foundations Questionnaire** complements this model by measuring the moral intuitions that underlie political reasoning, explaining *why* people with different ideologies often talk past each other on moral issues [3].

### Assessment Summary

| Test | Items | Time | Measures | Reliability |
|------|-------|------|----------|-------------|
| SDO7 | 16 | 3-5 min | Preference for group-based hierarchy (Dominance and Egalitarianism) | alpha = .89-.95 [4] |
| RWA-VSA | 6 | 1-2 min | Authoritarian attitudes (Submission, Aggression, Conventionalism) | alpha = .77-.83 [5] |
| MFQ-2 | 36 | 5-8 min | Six moral foundations grouped into Individualizing and Binding factors | alpha = .70-.90 per foundation [6] |

---

## Test 1: Social Dominance Orientation (SDO7)

### Citation

Ho, A. K., Sidanius, J., Kteily, N., Sheehy-Skeffington, J., Pratto, F., Henkel, K. E., Foels, R., & Stewart, A. L. (2015). The nature of social dominance orientation: Theorizing and measuring preferences for intergroup inequality using the new SDO7 scale. *Journal of Personality and Social Psychology*, 109(6), 1003-1028. https://doi.org/10.1037/pspi0000033

### Scale Structure

SDO7 measures two related but distinct subdimensions:

| Subdimension | Abbreviation | Description |
|--------------|--------------|-------------|
| **SDO-Dominance** | SDO-D | Support for overt group-based oppression and dominance hierarchies. Associated with "old-fashioned" prejudice, aggression toward outgroups, and zero-sum competition. |
| **SDO-Egalitarianism** | SDO-E | Opposition to group-based equality. Associated with subtle prejudice, opposition to redistributive policies, and legitimizing myths that justify inequality. |

Each subdimension has 8 items (4 pro-trait, 4 con-trait/reversed).

### Items

#### SDO-Dominance (SDO-D) Items

| # | Item Text | Direction | Reverse |
|---|-----------|-----------|---------|
| 1 | Some groups of people must be kept in their place. | Pro-dominance | No |
| 2 | It's probably a good thing that certain groups are at the top and other groups are at the bottom. | Pro-dominance | No |
| 3 | An ideal society requires some groups to be on top and others to be on the bottom. | Pro-dominance | No |
| 4 | Some groups of people are simply inferior to other groups. | Pro-dominance | No |
| 5 | Groups at the bottom are just as deserving as groups at the top. | Con-dominance | Yes |
| 6 | No one group should dominate in society. | Con-dominance | Yes |
| 7 | Groups at the bottom should not have to stay in their place. | Con-dominance | Yes |
| 8 | Group dominance is a poor principle. | Con-dominance | Yes |

#### SDO-Egalitarianism (SDO-E) Items

| # | Item Text | Direction | Reverse |
|---|-----------|-----------|---------|
| 9 | We should not push for group equality. | Anti-egalitarianism | No |
| 10 | We shouldn't try to guarantee that every group has the same quality of life. | Anti-egalitarianism | No |
| 11 | It is unjust to try to make groups equal. | Anti-egalitarianism | No |
| 12 | Group equality should not be our primary goal. | Anti-egalitarianism | No |
| 13 | We should work to give all groups an equal chance to succeed. | Pro-egalitarianism | Yes |
| 14 | We should do what we can to equalize conditions for different groups. | Pro-egalitarianism | Yes |
| 15 | No matter how much effort it takes, we ought to strive to ensure that all groups have the same chance in life. | Pro-egalitarianism | Yes |
| 16 | Group equality should be our ideal. | Pro-egalitarianism | Yes |

### Response Format

7-point Likert scale:

| Value | Label |
|-------|-------|
| 1 | Strongly Oppose |
| 2 | Somewhat Oppose |
| 3 | Slightly Oppose |
| 4 | Neutral |
| 5 | Slightly Favor |
| 6 | Somewhat Favor |
| 7 | Strongly Favor |

### Scoring Algorithm

#### Step 1: Reverse Score Appropriate Items

For items marked "Reverse = Yes" (items 5-8, 13-16):
```
reversed_score = 8 - original_score
```

#### Step 2: Calculate Subscale Scores

```
SDO-D = mean(items 1-8, with items 5-8 reverse-scored)
SDO-E = mean(items 9-16, with items 13-16 reverse-scored)
SDO_Total = mean(SDO-D, SDO-E)  // or mean of all 16 items
```

#### Step 3: Worked Example

Raw responses:
- Item 1: 5, Item 2: 4, Item 3: 5, Item 4: 3 (pro-dominance)
- Item 5: 6, Item 6: 5, Item 7: 6, Item 8: 5 (con-dominance, need reversing)
- Item 9: 4, Item 10: 5, Item 11: 3, Item 12: 4 (anti-egalitarianism)
- Item 13: 3, Item 14: 4, Item 15: 3, Item 16: 4 (pro-egalitarianism, need reversing)

After reverse scoring (8 - score):
- Items 5-8 become: 2, 3, 2, 3
- Items 13-16 become: 5, 4, 5, 4

Subscale calculations:
- SDO-D = (5 + 4 + 5 + 3 + 2 + 3 + 2 + 3) / 8 = 27 / 8 = **3.38**
- SDO-E = (4 + 5 + 3 + 4 + 5 + 4 + 5 + 4) / 8 = 34 / 8 = **4.25**
- SDO_Total = (3.38 + 4.25) / 2 = **3.81**

### Interpretation Thresholds

| Score Range | Interpretation |
|-------------|----------------|
| 1.0 - 2.0 | Very Low SDO - Strong preference for group equality |
| 2.0 - 3.0 | Low SDO - Preference for egalitarianism |
| 3.0 - 4.0 | Moderate SDO - Ambivalent or context-dependent views |
| 4.0 - 5.0 | Moderately High SDO - Some acceptance of hierarchy |
| 5.0 - 6.0 | High SDO - Clear preference for group hierarchy |
| 6.0 - 7.0 | Very High SDO - Strong endorsement of group dominance |

**Note:** Population means typically fall between 2.0-3.5, varying by sample demographics. College samples tend to score lower than general population samples [4].

---

## Test 2: Right-Wing Authoritarianism Very Short Scale (RWA-VSA)

### Citation

Bizumic, B., & Duckitt, J. (2018). Investigating right wing authoritarianism with a very short authoritarianism scale. *Journal of Social and Political Psychology*, 6(1), 129-150. https://doi.org/10.5964/jspp.v6i1.835

### Scale Structure

The RWA-VSA is a 6-item scale measuring three correlated subdimensions:

| Subdimension | Items | Description |
|--------------|-------|-------------|
| **Authoritarian Submission** | 2 | Submission to established authorities and willingness to follow their directives |
| **Authoritarian Aggression** | 2 | Aggression toward outgroups and norm violators when sanctioned by authorities |
| **Conventionalism** | 2 | Adherence to traditional social norms and values |

Each subdimension has one pro-trait item and one con-trait (reversed) item.

### Items

| # | Item Text | Dimension | Reverse |
|---|-----------|-----------|---------|
| 1 | It's great that many young people today are prepared to defy authority. | Submission | Yes |
| 2 | What our country needs most is discipline, with everyone following our leaders in unity. | Submission | No |
| 3 | God's laws about abortion, pornography, and marriage must be strictly followed before it is too late. | Conventionalism | No |
| 4 | There is nothing wrong with premarital sexual intercourse. | Conventionalism | Yes |
| 5 | Our society does NOT need tougher government and target laws. | Aggression | Yes |
| 6 | The facts on crime and the recent public disorders show we have to crack down harder on troublemakers, if we are going to preserve law and order. | Aggression | No |

### Response Format

9-point bipolar scale:

| Value | Label |
|-------|-------|
| -4 | Very Strongly Disagree |
| -3 | Strongly Disagree |
| -2 | Moderately Disagree |
| -1 | Slightly Disagree |
| 0 | Neutral |
| +1 | Slightly Agree |
| +2 | Moderately Agree |
| +3 | Strongly Agree |
| +4 | Very Strongly Agree |

### Scoring Algorithm

#### Step 1: Convert to 1-9 Scale

For easier computation, convert the -4 to +4 scale to 1-9:
```
converted_score = original_score + 5
```

#### Step 2: Reverse Score Appropriate Items

For items marked "Reverse = Yes" (items 1, 4, 5):
```
reversed_score = 10 - converted_score
```

#### Step 3: Calculate Scores

```
Submission = mean(item 1 reversed, item 2)
Aggression = mean(item 5 reversed, item 6)
Conventionalism = mean(item 3, item 4 reversed)
RWA_Total = mean(all 6 items after reversing)
```

#### Step 4: Worked Example

Raw responses (on -4 to +4 scale):
- Item 1: +2 (Submission, reverse)
- Item 2: +1 (Submission)
- Item 3: -1 (Conventionalism)
- Item 4: +3 (Conventionalism, reverse)
- Item 5: -2 (Aggression, reverse)
- Item 6: +2 (Aggression)

Convert to 1-9 scale:
- Item 1: 7, Item 2: 6, Item 3: 4, Item 4: 8, Item 5: 3, Item 6: 7

Apply reverse scoring (10 - score) to items 1, 4, 5:
- Item 1: 3, Item 4: 2, Item 5: 7

Calculate subscales:
- Submission = (3 + 6) / 2 = **4.5**
- Conventionalism = (4 + 2) / 2 = **3.0**
- Aggression = (7 + 7) / 2 = **7.0**
- RWA_Total = (3 + 6 + 4 + 2 + 7 + 7) / 6 = 29 / 6 = **4.83**

### Interpretation Thresholds

| Score Range (1-9) | Interpretation |
|-------------------|----------------|
| 1.0 - 2.5 | Very Low RWA - Strong rejection of authoritarian values |
| 2.5 - 4.0 | Low RWA - Generally libertarian orientation |
| 4.0 - 5.0 | Moderate RWA - Mixed or context-dependent attitudes |
| 5.0 - 6.5 | Moderately High RWA - Acceptance of authoritarian values |
| 6.5 - 8.0 | High RWA - Clear authoritarian orientation |
| 8.0 - 9.0 | Very High RWA - Strong endorsement of authoritarian values |

**Note:** The three subdimensions often show different patterns. Someone might score high on Conventionalism but low on Aggression. Subscale scores provide more nuanced interpretation than the total score alone [5].

---

## Test 3: Moral Foundations Questionnaire 2 (MFQ-2)

### Citation

Atari, M., Haidt, J., Graham, J., Koleva, S., Stevens, S. T., & Dehghani, M. (2023). Morality beyond the WEIRD: How the nomological network of morality varies across cultures. *Journal of Personality and Social Psychology*, 125(5), 1157-1188. https://doi.org/10.1037/pspp0000470

### Scale Structure

MFQ-2 measures six moral foundations organized into two higher-order factors:

#### Individualizing Foundations

Focus on individual rights and welfare. More emphasized by political liberals.

| Foundation | Description |
|------------|-------------|
| **Care** | Concern for the suffering of others; compassion and nurturance |
| **Equality** | Concern for equal treatment and social justice; opposition to discrimination |
| **Proportionality** | Concern for fairness based on merit and contribution; people getting what they deserve |

#### Binding Foundations

Focus on group cohesion and social order. More emphasized by political conservatives.

| Foundation | Description |
|------------|-------------|
| **Loyalty** | Concern for group solidarity; patriotism and self-sacrifice for the group |
| **Authority** | Concern for social order through hierarchy; respect for tradition and legitimate authority |
| **Purity** | Concern for physical and spiritual cleanliness; disgust toward contamination |

### Items

MFQ-2 contains 36 items (6 per foundation). Items assess agreement with moral statements.

#### Care Items (6 items)

| # | Item Text |
|---|-----------|
| 1 | Compassion for those who are suffering is the most crucial virtue. |
| 2 | One of the worst things a person could do is hurt a defenseless animal. |
| 3 | We should all care for people who are in emotional pain. |
| 4 | I am empathetic toward those people who have suffered in their lives. |
| 5 | I believe that compassion for those who are suffering is one of the most important virtues. |
| 6 | I think people should protect the weak and vulnerable. |

#### Equality Items (6 items)

| # | Item Text |
|---|-----------|
| 7 | Everyone should be treated equally, regardless of where they are from. |
| 8 | I think all people, even those from other countries, are worthy of respect. |
| 9 | I believe everyone deserves to be treated with dignity. |
| 10 | I think it is wrong when some groups of people have fewer rights than others. |
| 11 | I believe we should all try to treat everyone as our brother and sister. |
| 12 | I believe that all human beings should be treated equally. |

#### Proportionality Items (6 items)

| # | Item Text |
|---|-----------|
| 13 | I think people who work harder should end up with more money. |
| 14 | Workers who contribute more should be paid more than workers who contribute less. |
| 15 | I think people should be rewarded in proportion to what they contribute. |
| 16 | When people do not get what they deserve, I feel angry. |
| 17 | In a fair society, those who work hard should live better lives. |
| 18 | I think there's nothing wrong with a company paying its CEO much more than its workers. |

#### Loyalty Items (6 items)

| # | Item Text |
|---|-----------|
| 19 | I think it's important for people to be loyal to their country. |
| 20 | I believe people should always put their group or team first. |
| 21 | I think children should be taught to be loyal to their country. |
| 22 | I believe loyalty to one's group is more important than one's individual concerns. |
| 23 | I think true patriots are willing to make sacrifices for their country. |
| 24 | I think people should be proud of their country. |

#### Authority Items (6 items)

| # | Item Text |
|---|-----------|
| 25 | I think people should respect the traditions of their society. |
| 26 | I believe respect for authority is something all children need to learn. |
| 27 | I think it's important for societies to cherish their traditional values. |
| 28 | I believe that young people should respect their elders. |
| 29 | I think schools should teach children to respect authority. |
| 30 | I believe traditions are important because they link us to our past. |

#### Purity Items (6 items)

| # | Item Text |
|---|-----------|
| 31 | I think people should try to live pure, clean lives. |
| 32 | I believe chastity is an important virtue. |
| 33 | I think certain things are just wrong to do because they are unnatural. |
| 34 | I believe that cleanliness is an important virtue. |
| 35 | People should try to live pure and holy lives. |
| 36 | I think there are certain things that are sacred and should not be violated. |

**Note:** Actual item wording may vary slightly between MFQ-2 versions. Consult the official materials at moralfoundations.org for the validated item set.

### Response Format

5-point Likert scale (0-4):

| Value | Label |
|-------|-------|
| 0 | Does not describe me at all |
| 1 | Slightly describes me |
| 2 | Moderately describes me |
| 3 | Describes me fairly well |
| 4 | Describes me extremely well |

### Scoring Algorithm

#### Step 1: Calculate Foundation Scores

For each foundation, compute the mean of its 6 items:

```
Care = mean(items 1-6)
Equality = mean(items 7-12)
Proportionality = mean(items 13-18)
Loyalty = mean(items 19-24)
Authority = mean(items 25-30)
Purity = mean(items 31-36)
```

#### Step 2: Calculate Higher-Order Factor Scores

```
Individualizing = mean(Care, Equality, Proportionality)
Binding = mean(Loyalty, Authority, Purity)
```

#### Step 3: Worked Example

Raw responses (abbreviated - showing one item per foundation):
- Care items mean: 3.5
- Equality items mean: 3.2
- Proportionality items mean: 2.8
- Loyalty items mean: 2.0
- Authority items mean: 2.5
- Purity items mean: 1.8

Higher-order factors:
- Individualizing = (3.5 + 3.2 + 2.8) / 3 = **3.17**
- Binding = (2.0 + 2.5 + 1.8) / 3 = **2.10**

### Interpretation Guidance

#### Foundation Scores

MFQ-2 scores are most meaningful when compared:
1. **Within-person**: Which foundations does this person prioritize most?
2. **To population norms**: How does this person compare to others?
3. **Between Individualizing and Binding**: What is their moral "profile"?

| Score Range (0-4) | Interpretation |
|-------------------|----------------|
| 0.0 - 1.0 | Very Low endorsement of this foundation |
| 1.0 - 2.0 | Low endorsement |
| 2.0 - 3.0 | Moderate endorsement |
| 3.0 - 4.0 | High endorsement |

#### Political Ideology Patterns

Research consistently finds [3][6]:

- **Liberals** tend to score higher on Care and Equality, lower on Loyalty, Authority, and Purity
- **Conservatives** tend to score more evenly across all six foundations
- **Libertarians** tend to score lower across most foundations except Proportionality (fairness as merit)

**Important:** These are group-level patterns with substantial individual variation. Do not assume ideology from MFQ scores or vice versa.

---

## Ethical Considerations

### Frame as Educational Self-Reflection

These assessments should be presented as tools for self-understanding and reflection, not as diagnostic instruments or measures of moral worth:

- "Explore your political psychology" rather than "Find out your political type"
- "Understand your moral intuitions" rather than "Discover your morality"
- Emphasize that awareness of one's tendencies can facilitate cross-ideological understanding

### Scores Reflect Attitudes, Not Character

Make clear to users that:

- **SDO scores** reflect attitudes about group hierarchy, not whether someone is a "good" or "bad" person
- **RWA scores** reflect preferences about social organization, not intelligence or moral worth
- **MFQ scores** reflect which moral concerns are most salient, not who is "more moral"

High or low scores on any dimension are not inherently good or bad.

### Context-Dependence of Attitudes

Scores can vary based on:

- Current social/political climate
- Recent events (e.g., perceived threats increase RWA)
- How questions are framed
- Mood and priming effects

Results represent a snapshot, not a permanent trait.

### Self-Report Limitations

All three instruments rely on self-report, which is subject to:

- **Social desirability bias** - Tendency to answer in socially acceptable ways
- **Self-insight limitations** - People may not accurately know their own attitudes
- **Reference group effects** - "Moderate" means different things to different populations

### Not Suitable for High-Stakes Decisions

These assessments should **never** be used for:

- Hiring or employment decisions
- Security clearances
- Clinical diagnosis
- Legal proceedings
- Academic admissions
- Any selection or gatekeeping purpose

---

## Implementation Checklist

### SDO7
- [ ] All 16 items implemented with correct text
- [ ] 7-point response scale (Strongly Oppose to Strongly Favor)
- [ ] Items 5-8 and 13-16 reverse-scored
- [ ] SDO-D and SDO-E subscales calculated separately
- [ ] Total SDO score calculated as mean of all items
- [ ] Interpretation thresholds displayed appropriately

### RWA-VSA
- [ ] All 6 items implemented with correct text
- [ ] 9-point bipolar scale (-4 to +4)
- [ ] Items 1, 4, 5 reverse-scored
- [ ] Three subdimension scores calculated (Submission, Aggression, Conventionalism)
- [ ] Total RWA score calculated as mean of all items
- [ ] Interpretation thresholds displayed appropriately

### MFQ-2
- [ ] All 36 items implemented with correct text
- [ ] 5-point response scale (0-4)
- [ ] Six foundation scores calculated as means
- [ ] Individualizing and Binding higher-order scores calculated
- [ ] Visual comparison (e.g., radar chart) showing foundation profile
- [ ] Interpretation guidance provided

### Ethical Implementation
- [ ] Results framed as self-reflection, not diagnostic
- [ ] Disclaimers about score meaning included
- [ ] No high-stakes use cases suggested or enabled
- [ ] Data stored securely with appropriate access controls
- [ ] Option to delete results provided
- [ ] Links to educational resources about constructs

---

## References

[1] Duckitt, J., & Sibley, C. G. (2010). Personality, ideology, prejudice, and politics: A dual-process motivational model. *Journal of Personality*, 78(6), 1861-1894. https://doi.org/10.1111/j.1467-6494.2010.00672.x

[2] Sibley, C. G., & Duckitt, J. (2008). Personality and prejudice: A meta-analysis and theoretical review. *Personality and Social Psychology Review*, 12(3), 248-279. https://doi.org/10.1177/1088868308319226

[3] Graham, J., Haidt, J., & Nosek, B. A. (2009). Liberals and conservatives rely on different sets of moral foundations. *Journal of Personality and Social Psychology*, 96(5), 1029-1046. https://doi.org/10.1037/a0015141

[4] Ho, A. K., Sidanius, J., Kteily, N., Sheehy-Skeffington, J., Pratto, F., Henkel, K. E., Foels, R., & Stewart, A. L. (2015). The nature of social dominance orientation: Theorizing and measuring preferences for intergroup inequality using the new SDO7 scale. *Journal of Personality and Social Psychology*, 109(6), 1003-1028. https://doi.org/10.1037/pspi0000033

[5] Bizumic, B., & Duckitt, J. (2018). Investigating right wing authoritarianism with a very short authoritarianism scale. *Journal of Social and Political Psychology*, 6(1), 129-150. https://doi.org/10.5964/jspp.v6i1.835

[6] Atari, M., Haidt, J., Graham, J., Koleva, S., Stevens, S. T., & Dehghani, M. (2023). Morality beyond the WEIRD: How the nomological network of morality varies across cultures. *Journal of Personality and Social Psychology*, 125(5), 1157-1188. https://doi.org/10.1037/pspp0000470

[7] Pratto, F., Sidanius, J., Stallworth, L. M., & Malle, B. F. (1994). Social dominance orientation: A personality variable predicting social and political attitudes. *Journal of Personality and Social Psychology*, 67(4), 741-763. https://doi.org/10.1037/0022-3514.67.4.741

[8] Altemeyer, B. (1996). *The Authoritarian Specter*. Harvard University Press.

[9] Haidt, J. (2012). *The Righteous Mind: Why Good People Are Divided by Politics and Religion*. Vintage Books.

[10] Moral Foundations Theory. (n.d.). *Questionnaires*. https://moralfoundations.org/questionnaires/
