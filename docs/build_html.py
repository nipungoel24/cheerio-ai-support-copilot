"""Builds the print-ready HTML from the Markdown doc. Run: python build_html.py"""
import markdown, pathlib

here = pathlib.Path(__file__).parent
md = (here / "Cheerio_Assignment_A_Document.md").read_text(encoding="utf-8")
body = markdown.markdown(md, extensions=["tables", "md_in_html"])

CSS = """
@page { size: A4; margin: 12mm 13mm; }
:root { --brand:#0b5d4b; --ink:#1e293b; --muted:#64748b; --line:#e2e8f0; --tint:#ecfdf6; }
* { box-sizing: border-box; }
body { font-family: Inter, system-ui, sans-serif; color: var(--ink); background:#fff; font-size: 9.1pt; line-height: 1.35; max-width: 190mm; margin: 0 auto; padding: 8mm 0; }
h1 { font-size: 16pt; color: var(--brand); margin: 0 0 4px; }
h2 { font-size: 12pt; color: #fff; background: var(--brand); padding: 3px 8px; border-radius: 4px; margin: 10px 0 6px; }
h3 { font-size: 10.2pt; color: var(--brand); margin: 9px 0 3px; }
p { margin: 3px 0 5px; }
ul { margin: 3px 0 5px; padding-left: 16px; } li { margin: 1px 0; }
table { width: 100%; border-collapse: collapse; margin: 4px 0 6px; font-size: 8.2pt; page-break-inside: avoid; }
th { background: var(--tint); color: var(--brand); text-align: left; font-weight: 600; }
th, td { border: 1px solid var(--line); padding: 2.5px 5px; vertical-align: top; }
code { background: #f1f5f9; padding: 0 3px; border-radius: 3px; font-size: 8.4pt; }
blockquote { margin: 4px 0; padding: 4px 8px; background: #fff7ed; border-left: 3px solid #f59e0b; color: #9a3412; }
blockquote p { margin: 0; }
hr { border: 0; border-top: 1px solid var(--line); margin: 8px 0; }
a { color: var(--brand); }
.shots { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-top: 6px; }
.shots p { display: contents; }
.shots img { width: 100%; border: 1px solid var(--line); border-radius: 4px; }
@media print {
  body { padding: 0; }
  h2 { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  th, blockquote { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .pb { page-break-before: always; }
}
"""
# Part 4 (numbers) starts on its own page
body = body.replace("<h2>Part 4", '<h2 class="pb">Part 4')
html = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cheerio Co-Pilot – Assignment A</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body>
{body}
</body></html>"""
(here / "Cheerio_Assignment_A_Document.html").write_text(html, encoding="utf-8")
print("Wrote Cheerio_Assignment_A_Document.html")
