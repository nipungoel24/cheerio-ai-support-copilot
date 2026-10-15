"""
Cheerio AI - Assignment A - Financial model generator.

Every derived cell is an Excel formula so the logic stays visible after upload to Google Sheets.
Blue-fill cells = assumptions (edit these). Black text = formulas.

Run:  python generate_financial_model.py
"""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

OUT = "Cheerio_Assignment_A_Financial_Model.xlsx"

INPUT_FILL = PatternFill("solid", fgColor="DDEBF7")
INPUT_FONT = Font(color="1F3864", bold=True)
HEAD_FILL = PatternFill("solid", fgColor="0B5D4B")
HEAD_FONT = Font(color="FFFFFF", bold=True)
KEY_FILL = PatternFill("solid", fgColor="E2F0D9")
TITLE_FONT = Font(size=14, bold=True, color="0B5D4B")
NOTE_FONT = Font(italic=True, color="666666", size=9)
THIN = Side(style="thin", color="BFBFBF")
BOX = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

FMT = {
    "int": "#,##0",
    "dec": "#,##0.00",
    "dec4": "0.0000",
    "usd": "$#,##0.00",
    "usd6": "$0.000000",
    "inr": "₹#,##0",
    "inr2": "₹#,##0.00",
    "pct": "0.0%",
}


class Sheet:
    """Small helper: writes label | value | unit | note rows and remembers cell refs by key."""

    def __init__(self, wb, name, title, subtitle):
        self.ws = wb.create_sheet(name)
        self.name = name
        self.row = 1
        self.refs = {}
        self.ws["A1"] = title
        self.ws["A1"].font = TITLE_FONT
        self.ws["A2"] = subtitle
        self.ws["A2"].font = NOTE_FONT
        self.row = 4
        for col, w in zip("ABCDE", (52, 18, 14, 70, 14)):
            self.ws.column_dimensions[col].width = w

    def section(self, text):
        self.row += 1
        for c in range(1, 5):
            cell = self.ws.cell(row=self.row, column=c)
            cell.fill = HEAD_FILL
            cell.font = HEAD_FONT
        self.ws.cell(row=self.row, column=1, value=text)
        self.ws.cell(row=self.row, column=2, value="Value")
        self.ws.cell(row=self.row, column=3, value="Unit")
        self.ws.cell(row=self.row, column=4, value="Logic / Source")
        self.row += 1

    def add(self, key, label, value, unit="", note="", fmt="int", is_input=False, key_row=False):
        r = self.row
        self.ws.cell(row=r, column=1, value=label)
        v = self.ws.cell(row=r, column=2, value=value)
        v.number_format = FMT[fmt]
        v.border = BOX
        if is_input:
            v.fill = INPUT_FILL
            v.font = INPUT_FONT
        if key_row:
            for c in (1, 2):
                self.ws.cell(row=r, column=c).fill = KEY_FILL
                self.ws.cell(row=r, column=c).font = Font(bold=True)
        self.ws.cell(row=r, column=3, value=unit)
        if note.startswith("="):  # plain text, not a formula
            note = "Calc: " + note[1:].strip()
        n = self.ws.cell(row=r, column=4, value=note)
        n.font = NOTE_FONT
        n.alignment = Alignment(wrap_text=True)
        self.refs[key] = f"B{r}"
        self.row += 1
        return f"B{r}"

    def ref(self, key):
        return self.refs[key]

    def xref(self, key):
        """Reference usable from another sheet."""
        return f"'{self.name}'!{self.refs[key]}"


def legend(ws):
    ws["F1"] = "Legend"
    ws["F1"].font = Font(bold=True)
    ws["F2"] = "Assumption (edit)"
    ws["F2"].fill = INPUT_FILL
    ws["F2"].font = INPUT_FONT
    ws["F3"] = "Formula (do not edit)"
    ws["F4"] = "Key output"
    ws["F4"].fill = KEY_FILL
    ws.column_dimensions["F"].width = 22


wb = Workbook()
wb.remove(wb.active)

# ---------------------------------------------------------------- 1. Volume
v = Sheet(wb, "1_Guesstimate_Volume", "1. Guesstimate - Monthly support volume",
          "How many support queries 5,000 businesses raise per month, and how many Cheerio Co-Pilot resolves.")
legend(v.ws)
v.section("Customer base")
v.add("biz", "Active businesses", 5000, "businesses", "Given in brief", is_input=True)
v.add("new_pct", "Share onboarding this month (new / setting up)", 0.15, "%", "Assumption: ~15% of base is in first 30 days or re-configuring", "pct", True)
v.add("new_biz", "Onboarding businesses", f"={v.ref('biz')}*{v.ref('new_pct')}", "businesses", "= Active x Onboarding %")
v.add("old_biz", "Existing active businesses", f"={v.ref('biz')}-{v.ref('new_biz')}", "businesses", "= Active - Onboarding")
v.section("Tickets per business")
v.add("new_rate", "Setup queries per onboarding business / month", 4.2, "queries", "Assumption: WABA setup, first templates, first flow, one integration", "dec", True)
v.add("old_rate", "Queries per existing business / month", 1.4, "queries", "Assumption: template rejections, delivery drops, flow edits", "dec", True)
v.add("new_q", "Queries from onboarding businesses", f"={v.ref('new_biz')}*{v.ref('new_rate')}", "queries/mo", "= Onboarding biz x rate")
v.add("old_q", "Queries from existing businesses", f"={v.ref('old_biz')}*{v.ref('old_rate')}", "queries/mo", "= Existing biz x rate")
v.add("total_q", "TOTAL monthly support queries", f"={v.ref('new_q')}+{v.ref('old_q')}", "queries/mo", "= Sum of both segments", key_row=True)

v.section("Query mix (top issues)")
cats = [
    ("c1", "WhatsApp template rejections & variable formatting", 0.28),
    ("c2", "Chatbot flow builder - broken nodes & limits", 0.22),
    ("c3", "WABA onboarding & number verification", 0.18),
    ("c4", "Campaign delivery - 24h window & tier limits", 0.17),
    ("c5", "Shopify / Zoho / webhook integration sync", 0.10),
    ("c6", "Billing, account bans, custom enterprise", 0.05),
]
first_cat = v.row
for key, label, pct in cats:
    v.add(key + "_p", f"{label} - share", pct, "%", "Assumption (validate against helpdesk tags)", "pct", True)
last_cat = v.row - 1
v.add("mix_check", "Mix check (must = 100%)", f"=SUM(B{first_cat}:B{last_cat})", "%", "Sanity check", "pct")
for key, label, _ in cats:
    v.add(key + "_q", f"{label} - queries", f"={v.ref('total_q')}*{v.ref(key + '_p')}", "queries/mo", "= Total x share")

v.section("Resolution funnel with Cheerio Co-Pilot")
v.add("t0", "Tier 0 - proactive in-app auto-fix (before a ticket)", 0.45, "% of total", "Assumption: inline fix on the error screen (templates, flow lint)", "pct", True)
v.add("t1", "Tier 1 - guided AI diagnosis in Co-Pilot drawer", 0.25, "% of total", "Assumption: multi-step guidance (WABA, delivery, integrations)", "pct", True)
v.add("ai_pct", "AI self-serve resolution rate", f"={v.ref('t0')}+{v.ref('t1')}", "%", "= Tier 0 + Tier 1", "pct", key_row=True)
v.add("t2", "Tier 2 - escalated to human (with diagnostic packet)", f"=1-{v.ref('ai_pct')}", "%", "= 1 - AI rate", "pct")
v.add("t0_q", "Resolved at Tier 0", f"={v.ref('total_q')}*{v.ref('t0')}", "queries/mo", "")
v.add("t1_q", "Resolved at Tier 1", f"={v.ref('total_q')}*{v.ref('t1')}", "queries/mo", "")
v.add("ai_q", "Resolved WITHOUT a human", f"={v.ref('t0_q')}+{v.ref('t1_q')}", "queries/mo", "= Tier 0 + Tier 1", key_row=True)
v.add("human_q", "Still need a human", f"={v.ref('total_q')}-{v.ref('ai_q')}", "queries/mo", "= Total - AI resolved", key_row=True)

# ---------------------------------------------------------------- 2. AI cost
c = Sheet(wb, "2_AI_Running_Cost", "2. AI running cost - per query and per month",
          "Multi-turn token math. Prices: Anthropic API pricing (claude.com/pricing), checked Oct 2026. Edit blue cells to test other models.")
legend(c.ws)
c.section("Model prices (USD per 1M tokens)")
c.add("fast_in", "Fast model input - Claude Haiku 5.5", 0.10, "$/1M", "Anthropic API pricing, prompts <=100K tokens. Used for triage + guided steps.", "usd", True)
c.add("fast_out", "Fast model output - Claude Haiku 5.5", 0.50, "$/1M", "Anthropic API pricing", "usd", True)
c.add("smart_in", "Smart model input - Claude Sonnet 5.5", 2.00, "$/1M", "Anthropic API pricing. Used for template rewrites + flow debugging.", "usd", True)
c.add("smart_out", "Smart model output - Claude Sonnet 5.5", 10.00, "$/1M", "Anthropic API pricing", "usd", True)
c.add("fast_share", "Share of queries on fast model", 0.80, "%", "Assumption: router sends simple cases to Haiku", "pct", True)
c.add("smart_share", "Share of queries on smart model", f"=1-{c.ref('fast_share')}", "%", "= 1 - fast share", "pct")

c.section("Tokens per query (multi-turn)")
c.add("turns", "Average turns per session", 3.5, "turns", "Assumption: diagnose -> confirm -> fix -> verify", "dec", True)
c.add("in_turn", "Input tokens per turn", 2800, "tokens", "System prompt ~900 + page/error JSON ~600 + RAG chunk ~800 + history ~500", "int", True)
c.add("out_turn", "Output tokens per turn", 450, "tokens", "Plain-English answer + JSON fix payload", "int", True)
c.add("in_q", "Input tokens per query", f"={c.ref('turns')}*{c.ref('in_turn')}", "tokens", "= turns x input/turn")
c.add("out_q", "Output tokens per query", f"={c.ref('turns')}*{c.ref('out_turn')}", "tokens", "= turns x output/turn")
c.add("buffer", "Retry / cache-miss buffer", 0.15, "%", "Assumption: failed tool calls, regenerations", "pct", True)

c.section("Cost per query")
c.add("fast_cost", "Fast-model cost per query", f"=({c.ref('in_q')}*{c.ref('fast_in')}+{c.ref('out_q')}*{c.ref('fast_out')})/1000000", "USD", "= (in x price + out x price) / 1M", "usd6")
c.add("smart_cost", "Smart-model cost per query", f"=({c.ref('in_q')}*{c.ref('smart_in')}+{c.ref('out_q')}*{c.ref('smart_out')})/1000000", "USD", "= (in x price + out x price) / 1M", "usd6")
c.add("blend", "Blended cost per query (before buffer)", f"={c.ref('fast_share')}*{c.ref('fast_cost')}+{c.ref('smart_share')}*{c.ref('smart_cost')}", "USD", "= weighted by routing share", "usd6")
c.add("llm_usd", "LLM cost per query (with buffer)", f"={c.ref('blend')}*(1+{c.ref('buffer')})", "USD", "= blended x (1 + buffer)", "usd6")
c.add("fx", "FX rate", 84, "₹ per $", "Assumption - edit to today's rate", "dec", True)
c.add("llm_inr", "LLM cost per query", f"={c.ref('llm_usd')}*{c.ref('fx')}", "₹", "= USD x FX", "inr2", key_row=True)

c.section("Monthly running cost")
c.add("vol", "Queries hitting the AI per month", f"={v.xref('total_q')}", "queries/mo", "From tab 1 - every query starts with Co-Pilot, incl. escalated ones")
c.add("llm_month_usd", "LLM spend per month", f"={c.ref('vol')}*{c.ref('llm_usd')}", "USD", "= volume x cost/query", "usd")
c.add("infra", "Fixed infra (vector DB + Langfuse logging + hosting)", 120, "USD/mo", "Assumption: Pinecone starter + Langfuse + small container", "usd", True)
c.add("month_usd", "Total AI running cost", f"={c.ref('llm_month_usd')}+{c.ref('infra')}", "USD/mo", "= LLM + infra", "usd")
c.add("month_inr", "Total AI running cost", f"={c.ref('month_usd')}*{c.ref('fx')}", "₹/mo", "= USD x FX", "inr", key_row=True)
c.add("allin_q", "All-in cost per query (LLM + infra)", f"={c.ref('month_inr')}/{c.ref('vol')}", "₹", "= monthly cost / all queries", "inr2")
c.add("per_resolved", "All-in cost per AI-RESOLVED query", f"={c.ref('month_inr')}/{v.xref('ai_q')}", "₹", "= monthly cost / queries resolved without human (the honest unit)", "inr2", key_row=True)

c.section("Sensitivity - what if we used a different model?")
c.add("alt_in", "Alt: GPT-4o-mini input", 0.15, "$/1M", "OpenAI API pricing page - verify before relying on it", "usd", True)
c.add("alt_out", "Alt: GPT-4o-mini output", 0.60, "$/1M", "OpenAI API pricing page", "usd", True)
c.add("alt_inr", "Alt: cost per query if 100% GPT-4o-mini", f"=({c.ref('in_q')}*{c.ref('alt_in')}+{c.ref('out_q')}*{c.ref('alt_out')})/1000000*(1+{c.ref('buffer')})*{c.ref('fx')}", "₹", "Same token math", "inr2")
c.add("allsmart_inr", "Worst case: cost per query if 100% Sonnet 5.5", f"={c.ref('smart_cost')}*(1+{c.ref('buffer')})*{c.ref('fx')}", "₹", "If the router breaks and everything goes to the smart model", "inr2")

# ---------------------------------------------------------------- 3. Billing
b = Sheet(wb, "3_Billing_&_Margins", "3. Billing - how we charge and the margin",
          "Recommendation: core setup help is FREE; a paid 'Co-Pilot Pro' add-on covers the cost many times over.")
legend(b.ws)
b.section("Option comparison (qualitative)")
opts = [
    ("A. Free, included in all plans", "Zero friction, max deflection", "No direct revenue; cost absorbed"),
    ("B. Per-conversation charge (e.g. ₹5/query)", "Revenue tracks usage", "Charges users exactly when they are stuck -> they go back to tickets. Rejected."),
    ("C. AI credits pool", "Flexible, familiar from WhatsApp credits", "Users must budget for help; confusing for non-technical owners"),
    ("D. Plan add-on (flat monthly)", "Predictable revenue, easy to explain", "Must avoid paywalling basic setup help"),
    ("RECOMMENDED: Hybrid - Free core + Pro add-on", "Free setup fixes keep activation high; Pro monetises power users", "Need a fair-use cap on free tier"),
]
b.ws.cell(row=b.row, column=1, value="Option").font = Font(bold=True)
b.ws.cell(row=b.row, column=2, value="Pro").font = Font(bold=True)
b.ws.cell(row=b.row, column=4, value="Con / Why").font = Font(bold=True)
b.row += 1
for o, pro, con in opts:
    b.ws.cell(row=b.row, column=1, value=o)
    b.ws.cell(row=b.row, column=2, value=pro).alignment = Alignment(wrap_text=True)
    b.ws.cell(row=b.row, column=4, value=con).alignment = Alignment(wrap_text=True)
    b.row += 1

b.section("Recommended pricing")
b.add("free_fixes", "Free auto-fixes per business / month", 15, "fixes", "Covers ~3x a typical business's monthly need (tab 1 rates)", "int", True)
b.add("price", "Co-Pilot Pro add-on price (Starter plan)", 999, "₹/mo", "Unlimited template rewriter, auto-flow builder, priority audit. Bundled free in Growth/Enterprise.", "inr", True)
b.add("attach", "Attach rate (businesses buying Pro)", 0.12, "%", "Assumption: similar to other SaaS power-user add-ons", "pct", True)
b.add("buyers", "Paying Pro businesses", f"={v.xref('biz')}*{b.ref('attach')}", "businesses", "= Active x attach rate")
b.add("rev", "Monthly add-on revenue", f"={b.ref('buyers')}*{b.ref('price')}", "₹/mo", "= buyers x price", "inr", key_row=True)

b.section("Margin")
b.add("cost", "Total monthly AI running cost (ALL users, free + Pro)", f"={c.xref('month_inr')}", "₹/mo", "From tab 2 - conservative: Pro revenue carries everyone's AI cost", "inr")
b.add("pro_extra", "Extra cost of Pro usage (heavy users)", f"={b.ref('buyers')}*20*{c.xref('llm_inr')}*2", "₹/mo", "Assumption: each Pro user runs 20 extra sessions/mo at 2x tokens", "inr")
b.add("gp", "Gross profit", f"={b.ref('rev')}-{b.ref('cost')}-{b.ref('pro_extra')}", "₹/mo", "= revenue - costs", "inr", key_row=True)
b.add("gm", "Gross margin", f"={b.ref('gp')}/{b.ref('rev')}", "%", "= profit / revenue", "pct", key_row=True)
b.add("breakeven", "Break-even Pro buyers", f"=CEILING(({b.ref('cost')}+{b.ref('pro_extra')})/{b.ref('price')},1)", "businesses", "Buyers needed to cover all AI cost")
b.add("cost_per_biz", "AI cost per business per month (all tenants)", f"={b.ref('cost')}/{v.xref('biz')}", "₹/biz/mo", "Even at 0% attach, this is tiny vs. plan prices", "inr2")

# ---------------------------------------------------------------- 4. Savings
h = Sheet(wb, "4_Human_Savings_Comparison", "4. Savings - Co-Pilot vs. 100% human support",
          "Same monthly volume, two ways of handling it.")
legend(h.ws)
h.section("Baseline: every query handled by a human")
h.add("aht", "Average handling time per setup ticket", 18, "minutes", "Assumption: screenshot back-and-forth, checking Meta errors", "int", True)
h.add("hours", "Productive hours per agent / month", 160, "hours", "Assumption: 8h x 20 days", "int", True)
h.add("cap", "Tickets per agent per month", f"=({h.ref('hours')}*60)/{h.ref('aht')}", "tickets", "= minutes available / AHT", "dec")
h.add("base_agents", "Agents needed", f"=CEILING({v.xref('total_q')}/{h.ref('cap')},1)", "agents", "= volume / capacity, rounded up")
h.add("salary", "Fully loaded cost per L1/L2 agent (India)", 35000, "₹/mo", "Assumption: salary + PF + tools + mgmt overhead", "inr", True)
h.add("base_cost", "Baseline monthly support cost", f"={h.ref('base_agents')}*{h.ref('salary')}", "₹/mo", "= agents x cost", "inr", key_row=True)
h.add("base_per", "Baseline cost per ticket", f"={h.ref('base_cost')}/{v.xref('total_q')}", "₹", "", "inr2")

h.section("With Cheerio Co-Pilot")
h.add("rem", "Tickets still reaching humans", f"={v.xref('human_q')}", "tickets/mo", "From tab 1")
h.add("aht2", "New AHT (diagnostic packet pre-attached)", 10, "minutes", "Assumption: WABA ID, error logs, steps tried arrive with the ticket, so no screenshot back-and-forth", "int", True)
h.add("cap2", "Tickets per agent per month", f"=({h.ref('hours')}*60)/{h.ref('aht2')}", "tickets", "= minutes / new AHT", "dec")
h.add("new_agents", "Agents needed", f"=CEILING({h.ref('rem')}/{h.ref('cap2')},1)", "agents", "Rounded up")
h.add("new_human", "Human cost", f"={h.ref('new_agents')}*{h.ref('salary')}", "₹/mo", "", "inr")
h.add("ai_cost", "AI running cost", f"={c.xref('month_inr')}", "₹/mo", "From tab 2", "inr")
h.add("new_cost", "Total new monthly cost", f"={h.ref('new_human')}+{h.ref('ai_cost')}", "₹/mo", "= human + AI", "inr", key_row=True)

h.section("Savings")
h.add("save", "Net monthly savings", f"={h.ref('base_cost')}-{h.ref('new_cost')}", "₹/mo", "= baseline - new", "inr", key_row=True)
h.add("save_yr", "Net annual savings", f"={h.ref('save')}*12", "₹/yr", "", "inr", key_row=True)
h.add("save_pct", "Cost reduction", f"={h.ref('save')}/{h.ref('base_cost')}", "%", "", "pct", key_row=True)
h.add("hires", "Support hires avoided at today's scale", f"={h.ref('base_agents')}-{h.ref('new_agents')}", "agents", "")
h.add("x2_base", "If customers double: baseline agents", f"=CEILING({v.xref('total_q')}*2/{h.ref('cap')},1)", "agents", "Shows the scaling problem from the brief")
h.add("x2_new", "If customers double: agents with Co-Pilot", f"=CEILING({h.ref('rem')}*2/{h.ref('cap2')},1)", "agents", "")

# ---------------------------------------------------------------- 5. Audit
a = wb.create_sheet("5_Monthly_Audit_&_Alerts")
a["A1"] = "5. Monthly audit - checks and alerts that keep Co-Pilot profitable and honest"
a["A1"].font = TITLE_FONT
a["A2"] = "Column C = this month's value (formula or sample input). Column E = live status formula. Wire the same rules into Metabase/Grafana + Slack."
a["A2"].font = NOTE_FONT
heads = ["Check", "What it catches", "This month (sample)", "Threshold", "Status", "Owner / cadence", "Action if breached"]
for i, t in enumerate(heads, 1):
    cell = a.cell(row=4, column=i, value=t)
    cell.fill = HEAD_FILL
    cell.font = HEAD_FONT
widths = [34, 40, 18, 14, 14, 22, 50]
for i, w in enumerate(widths, 1):
    a.column_dimensions[get_column_letter(i)].width = w

rows = [
    # check, catches, value, threshold, op ('>' means alert if value > threshold), fmt, owner, action
    ("LLM cost per query (₹)", "Prompt bloat, retry loops, router sending too much to Sonnet",
     f"={c.xref('llm_inr')}", 2.00, ">", "inr2", "Eng - daily", "Check router share + prompt size in Langfuse; roll back last prompt change"),
    ("All-in cost per AI-resolved query (₹)", "Cost rising faster than resolutions",
     f"={c.xref('per_resolved')}", 4.00, ">", "inr2", "PM - weekly", "Investigate low-resolution intents; cut turns or add deterministic fixes"),
    ("Monthly AI spend vs. budget (₹)", "Overall bill drift",
     f"={c.xref('month_inr')}", 25000, ">", "inr", "PM + Finance - monthly", "Freeze new intents until root cause found"),
    ("Max spend by one tenant (₹/mo)", "Loops / abuse by a single business (cap ₹150 or 50 sessions/day)",
     45, 150, ">", "inr", "Auto - real time", "Auto-throttle tenant to rule-based diagnostics; notify CSM"),
    ("Ghost re-open rate", "AI said 'solved' but user raised a human ticket within 24h",
     0.08, 0.12, ">", "pct", "PM - weekly", "Pull the intents with highest re-open; fix prompts/playbooks"),
    ("Hallucination rate (50-chat weekly audit)", "Wrong Meta policy advice, invented fixes",
     0.006, 0.01, ">", "pct", "PM + LLM-judge - weekly", "Block that intent from auto-fix; add doc to RAG; re-test"),
    ("AI self-serve resolution rate", "Deflection falling below plan",
     f"={v.xref('ai_pct')}", 0.60, "<", "pct", "PM - weekly", "Review top escalation reasons; add new auto-fix"),
    ("Pro add-on gross margin", "Pricing no longer covers cost",
     f"={b.xref('gm')}", 0.80, "<", "pct", "Finance - monthly", "Revisit free-fix cap or Pro price"),
    ("Billing reconciliation gap", "Pro users billed vs. Pro entitlements active",
     0.0, 0.005, ">", "pct", "Finance - monthly", "Fix entitlement sync; refund/charge diff"),
]
r = 5
for check, catches, val, thr, op, fmt, owner, action in rows:
    a.cell(row=r, column=1, value=check).font = Font(bold=True)
    a.cell(row=r, column=2, value=catches).alignment = Alignment(wrap_text=True)
    vc = a.cell(row=r, column=3, value=val)
    vc.number_format = FMT[fmt]
    if not str(val).startswith("="):
        vc.fill = INPUT_FILL
        vc.font = INPUT_FONT
    tc = a.cell(row=r, column=4, value=thr)
    tc.number_format = FMT[fmt]
    tc.fill = INPUT_FILL
    tc.font = INPUT_FONT
    a.cell(row=r, column=5, value=f'=IF(C{r}{op}D{r},"ALERT","OK")').font = Font(bold=True)
    a.cell(row=r, column=6, value=owner)
    a.cell(row=r, column=7, value=action).alignment = Alignment(wrap_text=True)
    r += 1
a.cell(row=r + 1, column=1, value="Alerts firing this month").font = Font(bold=True)
a.cell(row=r + 1, column=3, value=f'=COUNTIF(E5:E{r-1},"ALERT")')
a.cell(row=r + 3, column=1, value="Monthly audit ritual (1st working day)").font = Font(bold=True)
ritual = [
    "1. Export usage by tenant from Langfuse -> compare tokens billed by Anthropic invoice vs. our logs (gap > 2% = investigate).",
    "2. Run this sheet with last month's actuals in column C; every ALERT gets an owner + date in the PM review.",
    "3. Sample 50 conversations: LLM-as-judge scores them for Meta-policy accuracy, then PM spot-checks 10 by hand.",
    "4. Check top 10 tenants by spend: are they Pro payers? If a free tenant is in the top 10, review the fair-use cap.",
]
for i, t in enumerate(ritual):
    a.cell(row=r + 4 + i, column=1, value=t)

# ---------------------------------------------------------------- Summary (first tab)
s = wb.create_sheet("0_Summary", 0)
s["A1"] = "Cheerio Co-Pilot - Numbers at a glance"
s["A1"].font = TITLE_FONT
s["A2"] = "All values below are live formulas linked to tabs 1-5. Change a blue cell anywhere and this updates."
s["A2"].font = NOTE_FONT
s.column_dimensions["A"].width = 46
s.column_dimensions["B"].width = 18
s.column_dimensions["C"].width = 14
summary = [
    ("Monthly support queries", f"={v.xref('total_q')}", "int", "queries"),
    ("Resolved without a human", f"={v.xref('ai_q')}", "int", "queries"),
    ("AI self-serve rate", f"={v.xref('ai_pct')}", "pct", ""),
    ("Still need a human", f"={v.xref('human_q')}", "int", "queries"),
    ("LLM cost per query", f"={c.xref('llm_inr')}", "inr2", "₹"),
    ("All-in cost per AI-resolved query", f"={c.xref('per_resolved')}", "inr2", "₹"),
    ("Monthly AI running cost", f"={c.xref('month_inr')}", "inr", "₹/mo"),
    ("Pro add-on revenue", f"={b.xref('rev')}", "inr", "₹/mo"),
    ("Pro add-on gross margin", f"={b.xref('gm')}", "pct", ""),
    ("Baseline human support cost", f"={h.xref('base_cost')}", "inr", "₹/mo"),
    ("New cost (humans + AI)", f"={h.xref('new_cost')}", "inr", "₹/mo"),
    ("Net monthly savings", f"={h.xref('save')}", "inr", "₹/mo"),
    ("Net annual savings", f"={h.xref('save_yr')}", "inr", "₹/yr"),
    ("Cost reduction", f"={h.xref('save_pct')}", "pct", ""),
    ("Support agents: before -> after", f"={h.xref('base_agents')}&\" -> \"&{h.xref('new_agents')}", "int", "agents"),
]
for i, (label, f, fmt, unit) in enumerate(summary, start=4):
    s.cell(row=i, column=1, value=label)
    cell = s.cell(row=i, column=2, value=f)
    cell.number_format = FMT[fmt]
    cell.font = Font(bold=True)
    cell.fill = KEY_FILL
    s.cell(row=i, column=3, value=unit)

for ws in wb.worksheets:
    ws.freeze_panes = "A4" if ws.title != "5_Monthly_Audit_&_Alerts" else "A5"

wb.save(OUT)
print(f"Saved {OUT}")
