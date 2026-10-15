# Cheerio AI – Product Intern Assignment A: Cheerio Co-Pilot

**Live prototype:** https://prototype-lilac-ten.vercel.app · **Repo:** https://github.com/nipungoel24/cheerio-ai-support-copilot · **Doc (PDF):** [docs/Cheerio_Assignment_A_Document.pdf](docs/Cheerio_Assignment_A_Document.pdf)

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

## Submission checklist

- [x] Prototype deployed: https://prototype-lilac-ten.vercel.app
- [x] 4-page doc: `docs/Cheerio_Assignment_A_Document.pdf`, screenshots in `docs/screenshots/` (2160×1350)
- [ ] Google Sheet: upload the `.xlsx` to Drive → Open with Google Sheets → share "Anyone with the link can view"
- [ ] AI chat links / prompt screenshots (mandatory) in the submission form

If you change a blue assumption cell in the sheet, update `prototype/src/data/numbers.ts` and Part 4 of the doc to match.
