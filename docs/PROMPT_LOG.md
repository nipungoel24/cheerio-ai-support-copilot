# Prompt Log: Cheerio AI Assignment A (Cheerio Co-Pilot)

**Nipun Goel** · Oct 2026 · Repo: https://github.com/nipungoel24/cheerio-ai-support-copilot · Prototype: https://prototype-lilac-ten.vercel.app · Sheet: https://docs.google.com/spreadsheets/d/1ygh9ABgRHeCHKGz5Qe62OcML2P5Nz-_vOVG9SVSdc9w/edit?usp=sharing

This log lists the key prompts behind the submission, in order, and what I changed after each one.

| Tool | Role |
|---|---|
| **Gemini** | Thinking partner: product thesis, solution options, structuring the requirements prompt |
| **Claude Code (Opus)** | Builder + auditor: React prototype, `openpyxl` sheet generator, doc drafting, numbers and Meta-API audit |

---

## Phase 1: Gemini (product thinking)

### Prompt 1: Problem framing
**What I asked (summary):** Cheerio's users are non-technical SMB owners who get stuck on WhatsApp API setup, template rejections, chatbot flows and integrations. What are all the ways to cut those tickets, and which one would actually work for this user?

**What I took / changed:** Gemini listed the usual options (help centre, FAQ chatbot, onboarding calls, community). The key insight I kept: these users don't lack *information*, they lack the ability to *apply* it. An Intercom-style FAQ bot still makes Riya fix `{{2}}` syntax herself. That became my thesis: **diagnose in context + 1-click fix + smart human handoff.**

### Prompt 2: Structuring the requirements
**What I asked (summary):** Turn the thesis into a detailed build prompt covering persona, top-5 queries, prioritisation, prototype scenarios, a formula-based sheet and a 4-page doc.

**What I took / changed:** This produced the long "master prompt" I gave to Claude Code (Phase 2). It also contained my own back-of-the-envelope targets, which turned out to be the source of my failed prompt (see Prompt 3).

---

## Phase 2: Claude Code (build + audit)

### Prompt 3: The master build prompt ❌ partly failed
**Excerpt:**
> "You are a Principal Product Manager and Staff Full-Stack Engineer… build `/prototype`, `/financials`, `/docs`… Tickets handled per agent per month (at 160 productive hours/mo)… drops from 18 mins to 10 mins (`800` tickets/agent/month). Required Human Agents now: `=CEILING(2730/800, 1)` = `4` agents… Show Final Cost per Resolved Query (approx. `₹0.65 – ₹1.10` per query)."

**What went wrong:** I gave the AI both the inputs *and* my pre-estimated outputs. Once the numbers were real formulas, they disagreed with my targets. I had over-constrained the prompt, so the story fought the maths.

**What I changed:** I made the **spreadsheet formulas the single source of truth**. Every number in the doc and prototype now comes from the formula output, not from my estimates. That surfaced the corrections below.

### Prompt 4: Formula-only financial model ✅
**Excerpt:**
> "Never hardcode calculated outputs. Every derived number MUST use an Excel formula string (e.g., `=B6*B7`) so formulas are 100% visible when opened in Google Sheets. Color-code hardcoded assumption cells in light blue fill with dark blue text."

**Why it worked:** It gave me a sheet a reviewer can audit cell by cell, and a sheet I could audit myself, which is how the fixes below were caught.

**Fixes that came out of auditing it:**
1. **Agent capacity, 960 not 800.** 160 h × 60 / 10 min = **960 tickets/agent/month**, not 800. So **3 agents (not 4)** cover the 2,730 escalated tickets. Savings rise to **₹5,07,462/month (₹60.9L/year, 80.5%)**.
2. **Real unit cost: ₹2.75, not ₹0.82.** Raw LLM token cost is **₹0.82/query**, but that hides the $120/month infra and the tokens spent on the 30% of queries that escalate anyway. Total AI spend (₹17,538) ÷ 6,370 AI-resolved queries = **₹2.75 per resolved query**. That is the number the audit alerts now track (alert at > ₹4.00).
3. **Current model prices.** My draft priced Claude 3.5 Sonnet/Haiku, which are retired by Oct 2026. I re-priced on Claude Haiku 5.5 ($0.10/$0.50 per 1M) + Sonnet 5.5 ($2/$10), and kept GPT-4o-mini as a sensitivity row.
4. **Generator bug.** Notes starting with "=" were being written as formulas and broke the workbook. I caught it by recalculating every cell before sharing.

### Prompt 5: Scenario 1 state machine + Hinglish ✅
**Excerpt:**
> "Clicking opens the Cheerio Co-Pilot Drawer with an English / Hinglish toggle… Displays a visual 3-Point Root Cause Diagnosis… side-by-side 'Before vs. AI-Fixed Compliant Template'… 'Apply Auto-Fix & Resubmit to Meta' → animated validation check → Approved → 'Did this solve your issue without needing support? 👍 Yes / 👎 Need Human'."

**Why it worked:** Spelling out every state produced a real end-to-end journey, not a static mock.

**What I changed:** **Meta error code, `INVALID_FORMAT` not `#131009`.** My prompt used `#131009` for a rejected template. In Meta's Cloud API, `#131009` is a *send-time* "parameter value is not valid" error. Template rejections come back as a rejection reason such as `INVALID_FORMAT` or `INCORRECT_CATEGORY`. The prototype badge now shows **Rejected · INVALID_FORMAT**.

### Prompt 6: Guardrail + human handoff (Scenario 3) ✅
**Excerpt:**
> "User's WhatsApp Business API phone number is stuck… Error #131031 Account Restricted. User asks Co-Pilot: 'Just approve my number right now!' Explicitly demonstrate what the AI will NOT do (refuses to hallucinate or fake Meta verification)… Auto-Compiled Diagnostic Packet… Escalate to Cheerio BSP Specialist."

**Why it worked:** It forced the prototype to show the most important edge case: the AI knows its limits and hands off cleanly, with zero typing for the user.

### Prompt 7: Billing model (my decision, then stress-tested)
**What I asked (summary):** Compare free, per-conversation, credits and plan add-on for Co-Pilot, then show the margin.

**What I changed / decided:** I rejected per-query charging (e.g. ₹5 per AI query) because it charges users exactly when they're stuck and pushes them back to human tickets. Final model: **core setup diagnostics + 15 auto-fixes/month FREE on every plan**, and power users pay for **Co-Pilot Pro at ₹999/month** (unlimited template rewriter, auto-flow builder, priority audit; bundled in Growth/Enterprise). At 12% attach (600 businesses), that is ₹5,99,400/month revenue vs. ₹17,538 AI cost + ₹19,670 extra Pro usage → **93.8% gross margin**, break-even at 38 buyers.

### Prompt 8: Final audit, deploy and packaging ✅
**Excerpt:**
> "Do a complete end-to-end verification… Finish Vercel deployment… Retake high-resolution screenshots… STRICT CHECK: PDF is 4 A4 pages maximum, zero [EDIT] tags remain, every number in the document matches the spreadsheet."

**Result:** Deployed to Vercel (zero console errors on the live site), retook 2160×1350 screenshots, recalculated the workbook and matched all 10 headline numbers against the doc, and kept the PDF at 4 pages.

---

## What I did myself (no AI)
- Picked Assignment A: setup friction is the real scaling bottleneck for a Meta BSP serving non-technical Indian SMBs.
- Chose the free-setup + paid-Pro billing model so users are never charged for being stuck.
- Drew the human-escalation boundaries: `#131031` account restrictions, billing disputes, 2 failed fixes in a row.
- Checked every spreadsheet formula and clicked through every prototype state.
