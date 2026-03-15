export interface Keyword {
  id: string
  keyword: string
  searchVolume: number
  competition: "low" | "medium" | "high"
  trend: "rising" | "stable" | "declining"
  score: number
  cpc?: number
  relatedKeywords?: string[]
}

export interface TrendData {
  date: string
  volume: number
}

export interface Competitor {
  id: string
  name: string
  domain: string
  keywords: string[]
  traffic: number
  overlap: number
}

export interface ImagePrompt {
  id: string
  prompt: string
  style?: string
  aspectRatio?: string
  quality?: string
  optimized?: boolean
}

export interface PromptSettings {
  style: string
  aspectRatio: string
  mood: string
  lighting: string
  subject: string
  additionalDetails: string
  quantity: number
}
