# Cheerio AI – Product Intern Assignment A: Cheerio Co-Pilot

| Folder | What | Submit as |
|---|---|---|
| `docs/` | 4-page doc (`.md` source → `.html` → `.pdf`), screenshots | Doc link (upload PDF to Google Drive, or paste into a Google Doc) |
| `prototype/` | Clickable React + Tailwind prototype, 3 user scenarios + cost/audit view | Deployed link |
| `financials/` | `generate_financial_model.py` → `Cheerio_Assignment_A_Financial_Model.xlsx` (every output is a formula) | Google Sheet link |

## Run / rebuild

```bash
# Prototype
cd prototype && npm install && npm run dev      # http://localhost:5173
npm run build                                    # static site in prototype/dist

# Financial model
cd financials && pip install openpyxl && python generate_financial_model.py

# Doc (after editing the .md)
cd docs && pip install markdown && python build_html.py   # then Print → Save as PDF (A4, no headers)
```

## Before submitting (deadline 15 Oct 2026, 11:59 PM IST)

1. **Deploy the prototype:** drag `prototype/dist` onto https://app.netlify.com/drop (or `npx vercel prototype`).
2. **Sheet:** upload the `.xlsx` to Google Drive → Open with Google Sheets → File → Save as Google Sheets. Share it as "Anyone with the link can view".
3. **Edit Part 3 of the doc** (`[EDIT]` markers): it must reflect how *you* actually used AI.
4. Fill the `[add link]` placeholders, rebuild HTML, export the PDF.
5. Add your AI chat links / prompt screenshots (mandatory), then submit via the form.

If you change a blue assumption cell in the sheet, update `prototype/src/data/numbers.ts` and Part 4 of the doc to match.
