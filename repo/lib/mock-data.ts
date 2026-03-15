import type { Keyword, TrendData, Competitor } from "./types"

export const mockKeywords: Keyword[] = [
  { id: "1", keyword: "digital art", searchVolume: 245000, competition: "high", trend: "rising", score: 87, cpc: 1.45 },
  { id: "2", keyword: "ai generated images", searchVolume: 180000, competition: "medium", trend: "rising", score: 92, cpc: 2.10 },
  { id: "3", keyword: "fantasy landscape", searchVolume: 95000, competition: "medium", trend: "stable", score: 75, cpc: 0.85 },
  { id: "4", keyword: "portrait photography", searchVolume: 320000, competition: "high", trend: "stable", score: 68, cpc: 1.75 },
  { id: "5", keyword: "abstract wallpaper", searchVolume: 78000, competition: "low", trend: "rising", score: 89, cpc: 0.55 },
  { id: "6", keyword: "minimalist design", searchVolume: 156000, competition: "medium", trend: "rising", score: 82, cpc: 1.20 },
  { id: "7", keyword: "nature photography", searchVolume: 410000, competition: "high", trend: "stable", score: 71, cpc: 0.95 },
  { id: "8", keyword: "cyberpunk aesthetic", searchVolume: 67000, competition: "low", trend: "rising", score: 94, cpc: 0.75 },
  { id: "9", keyword: "vintage illustration", searchVolume: 45000, competition: "low", trend: "stable", score: 78, cpc: 0.65 },
  { id: "10", keyword: "neon lights", searchVolume: 125000, competition: "medium", trend: "rising", score: 85, cpc: 0.90 },
]

export const mockTrendData: TrendData[] = [
  { date: "Jan", volume: 45000 },
  { date: "Feb", volume: 52000 },
  { date: "Mar", volume: 48000 },
  { date: "Apr", volume: 61000 },
  { date: "May", volume: 72000 },
  { date: "Jun", volume: 85000 },
  { date: "Jul", volume: 92000 },
  { date: "Aug", volume: 88000 },
  { date: "Sep", volume: 105000 },
  { date: "Oct", volume: 118000 },
  { date: "Nov", volume: 132000 },
  { date: "Dec", volume: 145000 },
]

export const mockCompetitors: Competitor[] = [
  { id: "1", name: "ArtStation", domain: "artstation.com", keywords: ["digital art", "concept art", "character design", "fantasy art"], traffic: 12500000, overlap: 78 },
  { id: "2", name: "DeviantArt", domain: "deviantart.com", keywords: ["fan art", "digital painting", "anime art", "photography"], traffic: 8900000, overlap: 65 },
  { id: "3", name: "Behance", domain: "behance.net", keywords: ["graphic design", "illustration", "ui design", "branding"], traffic: 15200000, overlap: 52 },
  { id: "4", name: "Dribbble", domain: "dribbble.com", keywords: ["ui design", "web design", "logo design", "icon design"], traffic: 6700000, overlap: 41 },
  { id: "5", name: "Pinterest", domain: "pinterest.com", keywords: ["aesthetic", "wallpaper", "inspiration", "mood board"], traffic: 89000000, overlap: 35 },
]

export const autocompleteSuggestions: Record<string, string[]> = {
  "dig": ["digital art", "digital painting", "digital illustration", "digital photography", "digital design"],
  "ai": ["ai art", "ai generated images", "ai portrait", "ai landscape", "ai abstract"],
  "fan": ["fantasy landscape", "fantasy art", "fantasy character", "fantasy world", "fantasy creature"],
  "por": ["portrait photography", "portrait painting", "portrait illustration", "portrait drawing"],
  "abs": ["abstract art", "abstract wallpaper", "abstract painting", "abstract design"],
  "min": ["minimalist design", "minimalist art", "minimalist photography", "minimalist wallpaper"],
  "nat": ["nature photography", "nature landscape", "nature art", "nature illustration"],
  "cyb": ["cyberpunk aesthetic", "cyberpunk city", "cyberpunk art", "cyberpunk character"],
  "vin": ["vintage illustration", "vintage photography", "vintage art", "vintage poster"],
  "neo": ["neon lights", "neon art", "neon aesthetic", "neon city", "neon portrait"],
}

export const imageStyles = [
  "Photorealistic",
  "Digital Art",
  "Oil Painting",
  "Watercolor",
  "Pencil Sketch",
  "3D Render",
  "Anime",
  "Pixel Art",
  "Minimalist",
  "Abstract",
  "Surrealist",
  "Pop Art",
]

export const aspectRatios = [
  { label: "Square (1:1)", value: "1:1" },
  { label: "Landscape (16:9)", value: "16:9" },
  { label: "Portrait (9:16)", value: "9:16" },
  { label: "Wide (21:9)", value: "21:9" },
  { label: "Standard (4:3)", value: "4:3" },
  { label: "Photo (3:2)", value: "3:2" },
]

export const moods = [
  "Dramatic",
  "Serene",
  "Energetic",
  "Mysterious",
  "Joyful",
  "Melancholic",
  "Intense",
  "Peaceful",
  "Whimsical",
  "Dark",
]

export const lightingOptions = [
  "Natural Light",
  "Golden Hour",
  "Blue Hour",
  "Studio Lighting",
  "Dramatic Shadows",
  "Soft Diffused",
  "Backlit",
  "Neon Glow",
  "Moonlight",
  "Cinematic",
]
