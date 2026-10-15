// Mirrors the outputs of financials/Cheerio_Assignment_A_Financial_Model.xlsx (0_Summary tab).
// If you change an assumption in the sheet, update these values to match.
export const N = {
  businesses: 5000,
  monthlyQueries: 9100,
  aiResolved: 6370,
  humanQueries: 2730,
  aiRate: 0.7,
  tier0: 0.45,
  tier1: 0.25,
  llmCostPerQuery: 0.82, // ₹
  costPerResolved: 2.75, // ₹ all-in
  monthlyAiCost: 17538, // ₹
  proRevenue: 599400, // ₹
  proMargin: 0.938,
  baselineCost: 630000, // ₹
  newCost: 122538, // ₹
  monthlySavings: 507462, // ₹
  annualSavings: 6089545, // ₹
  savingsPct: 0.805,
  agentsBefore: 18,
  agentsAfter: 3,
}

export const inr = (n: number) => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 })
export const lakh = (n: number) => '₹' + (n / 100000).toFixed(2) + 'L'
