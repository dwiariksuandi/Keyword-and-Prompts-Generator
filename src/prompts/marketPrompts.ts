export const MARKET_ANALYSIS_PROMPT = `Perform an elite, multi-agent market analysis targeting asset type: '{contentType}'.
  
  MARKET CONTEXT (Real-Time Data):
  - Trends: {trends}
  - Competitor Insights: {competitorInsights}
  - Market Gaps: {marketGaps}

  {intentContext}
  {portfolioContext}
  {contentTypeInstructions}
  
  AGENT ROLES:
  - Market Analyst Agent: Identify high-volume, low-competition niches based on market data.
  - Creative Director Agent: Define visual trends, buyer personas, and art direction.
  - Trend Forecaster Agent: Predict 6-month trajectory and future market shifts.
  - Risk Assessment Agent: Evaluate saturation, copyright risks, and barrier to entry.
  - Prompt Engineer Agent: Synthesize all insights into actionable, commercially lucrative sub-niches.

  Respond strictly with a JSON array of objects following this schema:
  {
    "categoryName": string,
    "mainKeywords": string[],
    "volumeLevel": "High" | "Medium" | "Low",
    "volumeNumber": number,
    "competition": "High" | "Medium" | "Low",
    "competitionScore": number,
    "trend": "up" | "down" | "stable",
    "trendPercent": number,
    "trendForecast": "up" | "down" | "stable",
    "riskLevel": "High" | "Medium" | "Low",
    "riskFactors": string[],
    "difficultyScore": number,
    "opportunityScore": number,
    "buyerPersona": string,
    "visualTrends": string[],
    "creativeAdvice": string
  }
  
  {keywordContext}
  {referenceUrlContext}
  
  Respond strictly in {language}.`;
