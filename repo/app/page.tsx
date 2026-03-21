"use client"

import { useState, useEffect, useCallback } from "react"
import { 
  Search, Sparkles, Download, RefreshCw, Copy, Key, Eye, EyeOff, Save, Check,
  TrendingUp, TrendingDown, Minus, Trash2, History, FileText, Zap, Star,
  ChevronDown, ChevronUp, Filter, BarChart3, Target, Lightbulb, Wand2,
  Heart, ExternalLink, Coffee, CreditCard, Gift
} from "lucide-react"
import Settings from "../../src/components/Settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"

type Tab = "top" | "analysis" | "results" | "settings" | "donate"

interface Category {
  id: string
  name: string
  keywords: string[]
  searchVolume: "High" | "Medium" | "Low"
  searchVolumeNumber: number
  competition: "High" | "Medium" | "Low"
  competitionScore: number
  trend: "up" | "down" | "stable"
  trendPercent: number
  difficultyScore: number
  opportunityScore: number
  creativeAdvice: string
  generatedPrompts: string[]
  isFavorite: boolean
}

interface HistoryItem {
  id: string
  query: string
  timestamp: Date
  categoryCount: number
  promptCount: number
}

interface PromptTemplate {
  id: string
  name: string
  template: string
  description: string
}

const promptTemplates: PromptTemplate[] = [
  {
    id: "midjourney",
    name: "Midjourney v6",
    template: "{style} {subject}, {details}, {lighting}, {mood} atmosphere, professional quality, high detail. --ar {aspect} --style raw --v 6",
    description: "Optimized for Midjourney v6 with style raw"
  },
  {
    id: "dalle",
    name: "DALL-E 3",
    template: "A {style} image of {subject}. {details}. The scene features {lighting} with a {mood} atmosphere. High resolution, photorealistic details.",
    description: "Natural language prompts for DALL-E 3"
  },
  {
    id: "stable",
    name: "Stable Diffusion XL",
    template: "{subject}, {style}, {details}, {lighting}, {mood}, masterpiece, best quality, highly detailed, 8k uhd",
    description: "Tag-based prompts for SDXL"
  },
  {
    id: "stock",
    name: "Stock Photography",
    template: "Professional stock photo: {subject}. {details}. Shot with {lighting}, conveying {mood}. Commercial use, editorial quality, diverse representation.",
    description: "Optimized for stock photography sites"
  },
  {
    id: "nanobanana",
    name: "Nano Banana Pro",
    template: "Generate a stunning {style} visual of {subject}. Key elements: {details}. Lighting setup: {lighting}. Overall mood: {mood}. Ultra-high definition, cinematic composition, award-winning quality, trending on ArtStation, octane render, volumetric lighting, ray tracing.",
    description: "Advanced multimodal prompt for Nano Banana Pro AI"
  }
]

const suggestionKeywords = [
  "artificial intelligence", "machine learning", "cybersecurity", "blockchain",
  "sustainable energy", "remote work", "digital marketing", "e-commerce",
  "healthcare technology", "fintech", "cloud computing", "data analytics",
  "virtual reality", "augmented reality", "internet of things", "5G technology",
  "electric vehicles", "renewable energy", "biotechnology", "robotics",
  "smart home", "wearable technology", "cryptocurrency", "NFT art",
  "social media", "content creation", "video streaming", "podcast",
  "mental health", "fitness technology", "food technology", "agritech"
]

const initialCategories: Category[] = [
  {
    id: "1",
    name: "Artificial Intelligence in Business",
    keywords: ["AI business strategy", "AI digital transformation", "AI corporate solutions", "AI machine learning business"],
    searchVolume: "High",
    searchVolumeNumber: 246000,
    competition: "High",
    competitionScore: 85,
    trend: "up",
    trendPercent: 23,
    difficultyScore: 78,
    opportunityScore: 72,
    creativeAdvice: "Focus on abstract representations of data, networks, and decision-making. Use clean, modern aesthetics with blues, grays, and whites. Show diverse teams collaborating with AI interfaces.",
    generatedPrompts: [],
    isFavorite: false
  },
  {
    id: "2",
    name: "AI Ethics and Society",
    keywords: ["AI ethics", "AI bias", "AI governance", "responsible AI"],
    searchVolume: "Medium",
    searchVolumeNumber: 89000,
    competition: "Medium",
    competitionScore: 52,
    trend: "up",
    trendPercent: 45,
    difficultyScore: 45,
    opportunityScore: 88,
    creativeAdvice: "Visualize concepts like transparency, accountability, and human oversight. Use balanced compositions showing humans and AI working together. Consider symbolic imagery like scales, shields, or interconnected hands.",
    generatedPrompts: [],
    isFavorite: false
  },
  {
    id: "3",
    name: "AI in Healthcare",
    keywords: ["AI medical diagnosis", "AI healthcare solutions", "AI drug discovery", "AI patient care"],
    searchVolume: "High",
    searchVolumeNumber: 198000,
    competition: "Medium",
    competitionScore: 58,
    trend: "up",
    trendPercent: 67,
    difficultyScore: 52,
    opportunityScore: 91,
    creativeAdvice: "Show AI assisting medical professionals, not replacing them. Use clean, clinical environments with warm touches. Include diverse patients and healthcare workers. Focus on hopeful outcomes.",
    generatedPrompts: [],
    isFavorite: false
  },
  {
    id: "4",
    name: "AI Art and Creativity",
    keywords: ["AI generated art", "AI creative tools", "AI design", "generative AI"],
    searchVolume: "High",
    searchVolumeNumber: 312000,
    competition: "High",
    competitionScore: 79,
    trend: "stable",
    trendPercent: 3,
    difficultyScore: 71,
    opportunityScore: 65,
    creativeAdvice: "Showcase the collaboration between human creativity and AI capabilities. Use vibrant colors and dynamic compositions. Show artists working alongside AI tools in creative studios.",
    generatedPrompts: [],
    isFavorite: false
  },
  {
    id: "5",
    name: "AI in Education",
    keywords: ["AI tutoring", "AI learning platforms", "personalized education", "AI classroom"],
    searchVolume: "Medium",
    searchVolumeNumber: 76000,
    competition: "Low",
    competitionScore: 28,
    trend: "up",
    trendPercent: 89,
    difficultyScore: 25,
    opportunityScore: 95,
    creativeAdvice: "Depict engaging learning environments enhanced by AI. Show students of various ages interacting with AI tutors. Use bright, optimistic colors. Focus on accessibility and inclusivity.",
    generatedPrompts: [],
    isFavorite: false
  }
]

export default function KeywordResearchApp() {
  const [activeTab, setActiveTab] = useState<Tab>("top")
  const [searchQuery, setSearchQuery] = useState("")
  const [promptCount, setPromptCount] = useState("100")
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState<string | null>(null)
  const [isGeneratingAll, setIsGeneratingAll] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"opportunity" | "volume" | "trend" | "difficulty">("opportunity")
  const [filterCompetition, setFilterCompetition] = useState<"all" | "High" | "Medium" | "Low">("all")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  
  // History
  const [history, setHistory] = useState<HistoryItem[]>([])
  
  // Results state
  const [totalPromptsGenerated, setTotalPromptsGenerated] = useState(0)
  const [savedPrompts, setSavedPrompts] = useState<{category: string; prompts: string[]}[]>([])
  
  // Settings State
  const [apiKey, setApiKey] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKeySaved, setApiKeySaved] = useState(false)
  const [selectedModel, setSelectedModel] = useState("gemini-pro")
  const [selectedTemplate, setSelectedTemplate] = useState("midjourney")
  const [outputFormat, setOutputFormat] = useState("midjourney")
  const [defaultPromptCount, setDefaultPromptCount] = useState("100")
  const [autoSave, setAutoSave] = useState(true)
  const [includeNegativePrompts, setIncludeNegativePrompts] = useState(false)
  const [language, setLanguage] = useState("en")

  const tabs: { id: Tab; label: string }[] = [
    { id: "top", label: "TOP" },
    { id: "analysis", label: "ANALYSIS" },
    { id: "results", label: "RESULTS" },
    { id: "settings", label: "SETTINGS" },
    { id: "donate", label: "DONATE" },
  ]

  // Filter suggestions based on input
  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = suggestionKeywords.filter(k => 
        k.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
      setFilteredSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [searchQuery])

  // Sort categories
  const sortedCategories = [...categories].sort((a, b) => {
    switch (sortBy) {
      case "opportunity":
        return b.opportunityScore - a.opportunityScore
      case "volume":
        return b.searchVolumeNumber - a.searchVolumeNumber
      case "trend":
        return b.trendPercent - a.trendPercent
      case "difficulty":
        return a.difficultyScore - b.difficultyScore
      default:
        return 0
    }
  }).filter(c => filterCompetition === "all" || c.competition === filterCompetition)

  const handleAnalyze = async () => {
    if (!searchQuery.trim()) return
    setIsAnalyzing(true)
    setShowSuggestions(false)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const generateMetrics = () => ({
      searchVolumeNumber: Math.floor(Math.random() * 300000) + 50000,
      competitionScore: Math.floor(Math.random() * 100),
      trendPercent: Math.floor(Math.random() * 100) - 20,
      difficultyScore: Math.floor(Math.random() * 100),
      opportunityScore: Math.floor(Math.random() * 100),
    })

    const getVolumeLabel = (num: number): "High" | "Medium" | "Low" => {
      if (num > 150000) return "High"
      if (num > 70000) return "Medium"
      return "Low"
    }

    const getCompetitionLabel = (score: number): "High" | "Medium" | "Low" => {
      if (score > 65) return "High"
      if (score > 35) return "Medium"
      return "Low"
    }

    const getTrend = (percent: number): "up" | "down" | "stable" => {
      if (percent > 10) return "up"
      if (percent < -10) return "down"
      return "stable"
    }

    const categoryTemplates = [
      { suffix: "in Business", keywords: ["business strategy", "digital transformation", "corporate solutions", "enterprise"] },
      { suffix: "Ethics and Society", keywords: ["ethics", "responsibility", "governance", "responsible use"] },
      { suffix: "in Healthcare", keywords: ["medical", "healthcare", "diagnosis", "patient care"] },
      { suffix: "Creative Applications", keywords: ["art", "design", "creative tools", "generative"] },
      { suffix: "in Education", keywords: ["learning", "education", "training", "tutoring"] },
      { suffix: "in Finance", keywords: ["fintech", "banking", "investment", "trading"] },
      { suffix: "for Sustainability", keywords: ["green tech", "sustainable", "eco-friendly", "environmental"] },
    ]
    
    const newCategories: Category[] = categoryTemplates.slice(0, 5 + Math.floor(Math.random() * 3)).map((template, index) => {
      const metrics = generateMetrics()
      return {
        id: (Date.now() + index).toString(),
        name: `${searchQuery} ${template.suffix}`,
        keywords: template.keywords.map(k => `${searchQuery} ${k}`),
        searchVolume: getVolumeLabel(metrics.searchVolumeNumber),
        searchVolumeNumber: metrics.searchVolumeNumber,
        competition: getCompetitionLabel(metrics.competitionScore),
        competitionScore: metrics.competitionScore,
        trend: getTrend(metrics.trendPercent),
        trendPercent: Math.abs(metrics.trendPercent),
        difficultyScore: metrics.difficultyScore,
        opportunityScore: metrics.opportunityScore,
        creativeAdvice: `Focus on ${template.suffix.toLowerCase()} aspects of ${searchQuery}. Use modern, professional imagery that showcases innovation and human-technology collaboration. Consider diverse representation and accessibility.`,
        generatedPrompts: [],
        isFavorite: false
      }
    })
    
    setCategories(newCategories)
    setIsAnalyzing(false)
    
    // Add to history
    setHistory(prev => [{
      id: Date.now().toString(),
      query: searchQuery,
      timestamp: new Date(),
      categoryCount: newCategories.length,
      promptCount: 0
    }, ...prev.slice(0, 9)])
  }

  const generatePromptsForCategory = useCallback(async (categoryId: string, count: number): Promise<string[]> => {
    const category = categories.find(c => c.id === categoryId)
    if (!category) return []
    
    const styles = ["cinematic", "photorealistic", "minimalist", "abstract", "documentary", "editorial", "commercial", "artistic", "hyperrealistic", "conceptual", "dramatic", "serene"]
    const aspects = ["16:9", "4:3", "1:1", "9:16", "3:2", "21:9"]
    const lightings = ["natural light", "studio lighting", "golden hour", "blue hour", "dramatic lighting", "soft diffused light", "rim lighting", "ambient occlusion", "volumetric lighting", "neon glow"]
    const moods = ["professional", "inspiring", "innovative", "futuristic", "warm", "dynamic", "serene", "powerful", "elegant", "vibrant"]
    const cameras = ["Canon EOS R5", "Sony A7R IV", "Hasselblad X2D", "Phase One", "Nikon Z9"]
    const lenses = ["85mm f/1.4", "35mm f/1.8", "24-70mm f/2.8", "70-200mm f/2.8", "50mm f/1.2"]
    
    const template = promptTemplates.find(t => t.id === selectedTemplate) || promptTemplates[0]
    
    const prompts: string[] = []
    for (let i = 0; i < count; i++) {
      const style = styles[Math.floor(Math.random() * styles.length)]
      const aspect = aspects[Math.floor(Math.random() * aspects.length)]
      const lighting = lightings[Math.floor(Math.random() * lightings.length)]
      const mood = moods[Math.floor(Math.random() * moods.length)]
      const keyword = category.keywords[Math.floor(Math.random() * category.keywords.length)]
      const camera = cameras[Math.floor(Math.random() * cameras.length)]
      const lens = lenses[Math.floor(Math.random() * lenses.length)]
      
      let prompt = template.template
        .replace("{style}", style)
        .replace("{subject}", keyword)
        .replace("{details}", `showcasing ${category.name.toLowerCase()}, shot with ${camera} using ${lens}`)
        .replace("{lighting}", lighting)
        .replace("{mood}", mood)
        .replace("{aspect}", aspect)
      
      if (includeNegativePrompts && selectedTemplate === "stable") {
        prompt += " --neg blurry, low quality, distorted, watermark, text, logo"
      }
      
      prompts.push(prompt)
    }
    
    return prompts
  }, [categories, selectedTemplate, includeNegativePrompts])

  const handleGeneratePrompts = async (categoryId: string) => {
    setIsGenerating(categoryId)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const count = Math.min(parseInt(promptCount) || 10, 500)
    const prompts = await generatePromptsForCategory(categoryId, count)
    
    setCategories(prev => prev.map(c => 
      c.id === categoryId ? { ...c, generatedPrompts: prompts } : c
    ))
    
    setTotalPromptsGenerated(prev => prev + prompts.length)
    
    if (autoSave) {
      const category = categories.find(c => c.id === categoryId)
      if (category) {
        setSavedPrompts(prev => [...prev, { category: category.name, prompts }])
      }
    }
    
    setIsGenerating(null)
  }

  const handleGenerateAll = async () => {
    setIsGeneratingAll(true)
    const count = Math.min(parseInt(promptCount) || 10, 100)
    
    for (const category of sortedCategories) {
      if (category.generatedPrompts.length === 0) {
        await new Promise(resolve => setTimeout(resolve, 800))
        const prompts = await generatePromptsForCategory(category.id, count)
        
        setCategories(prev => prev.map(c => 
          c.id === category.id ? { ...c, generatedPrompts: prompts } : c
        ))
        
        setTotalPromptsGenerated(prev => prev + prompts.length)
      }
    }
    
    setIsGeneratingAll(false)
  }

  const handleDownloadPrompts = (category: Category) => {
    const content = `Category: ${category.name}\nKeywords: ${category.keywords.join(", ")}\nGenerated: ${new Date().toLocaleString()}\n\n${"-".repeat(50)}\n\n${category.generatedPrompts.join('\n\n')}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${category.name.replace(/\s+/g, '_')}_prompts.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadAll = () => {
    const categoriesWithPrompts = categories.filter(c => c.generatedPrompts.length > 0)
    if (categoriesWithPrompts.length === 0) return
    
    let content = `Keyword Research Results\nGenerated: ${new Date().toLocaleString()}\nTotal Categories: ${categoriesWithPrompts.length}\nTotal Prompts: ${categoriesWithPrompts.reduce((sum, c) => sum + c.generatedPrompts.length, 0)}\n\n${"=".repeat(60)}\n\n`
    
    categoriesWithPrompts.forEach(category => {
      content += `\n${"=".repeat(60)}\nCATEGORY: ${category.name}\nKeywords: ${category.keywords.join(", ")}\nSearch Volume: ${category.searchVolume} (${category.searchVolumeNumber.toLocaleString()})\nCompetition: ${category.competition}\nOpportunity Score: ${category.opportunityScore}/100\n${"=".repeat(60)}\n\n`
      content += category.generatedPrompts.join('\n\n')
      content += '\n\n'
    })
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `keyword_research_all_prompts_${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyPrompt = (prompt: string, id: string) => {
    navigator.clipboard.writeText(prompt)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const handleCopyAllPrompts = (category: Category) => {
    navigator.clipboard.writeText(category.generatedPrompts.join('\n\n'))
    setCopiedId(`all-${category.id}`)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey)
      setApiKeySaved(true)
      setTimeout(() => setApiKeySaved(false), 2000)
    }
  }

  const toggleFavorite = (categoryId: string) => {
    setCategories(prev => prev.map(c => 
      c.id === categoryId ? { ...c, isFavorite: !c.isFavorite } : c
    ))
  }

  const upgradePrompt = (originalPrompt: string): string => {
    const qualityEnhancers = [
      "masterpiece quality, ", "award-winning composition, ", "editorial excellence, ",
      "museum-quality, ", "professional-grade, ", "critically acclaimed, "
    ]
    const technicalEnhancers = [
      "sharp focus, intricate details, ", "8K UHD resolution, crystal clarity, ",
      "hyper-realistic textures, ", "stunning visual fidelity, ", "meticulous craftsmanship, "
    ]
    const lightingEnhancers = [
      "dynamic cinematic lighting, ", "golden hour illumination, ", "dramatic chiaroscuro, ",
      "studio-quality lighting setup, ", "natural ambient lighting, ", "volumetric god rays, "
    ]
    const atmosphereEnhancers = [
      "rich atmospheric depth, ", "immersive visual narrative, ", "captivating visual story, ",
      "emotionally evocative, ", "visually stunning atmosphere, "
    ]
    const styleEnhancers = [
      "trending on ArtStation, ", "featured in digital art galleries, ", "viral aesthetic appeal, ",
      "contemporary visual excellence, ", "innovative artistic vision, "
    ]

    const randomQuality = qualityEnhancers[Math.floor(Math.random() * qualityEnhancers.length)]
    const randomTechnical = technicalEnhancers[Math.floor(Math.random() * technicalEnhancers.length)]
    const randomLighting = lightingEnhancers[Math.floor(Math.random() * lightingEnhancers.length)]
    const randomAtmosphere = atmosphereEnhancers[Math.floor(Math.random() * atmosphereEnhancers.length)]
    const randomStyle = styleEnhancers[Math.floor(Math.random() * styleEnhancers.length)]

    const parts = originalPrompt.split('. ')
    if (parts.length > 1) {
      parts[0] = randomQuality + parts[0]
      const insertIndex = Math.min(1, parts.length - 1)
      parts.splice(insertIndex + 1, 0, randomTechnical + randomLighting.trim())
      parts.push(randomAtmosphere + randomStyle + "octane render, ray tracing, subsurface scattering")
    } else {
      return `${randomQuality}${originalPrompt}, ${randomTechnical}${randomLighting}${randomAtmosphere}${randomStyle}octane render, ray tracing, subsurface scattering, depth of field`
    }

    return parts.join('. ')
  }

  const handleUpgradePrompts = async (categoryId: string) => {
    setIsUpgrading(categoryId)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setCategories(prev => prev.map(c => {
      if (c.id === categoryId && c.generatedPrompts.length > 0) {
        const upgradedPrompts = c.generatedPrompts.map(prompt => upgradePrompt(prompt))
        return { ...c, generatedPrompts: upgradedPrompts }
      }
      return c
    }))
    
    setIsUpgrading(null)
  }

  const handleUpgradeAll = async () => {
    const categoriesWithPrompts = categories.filter(c => c.generatedPrompts.length > 0)
    
    for (const category of categoriesWithPrompts) {
      setIsUpgrading(category.id)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setCategories(prev => prev.map(c => {
        if (c.id === category.id) {
          const upgradedPrompts = c.generatedPrompts.map(prompt => upgradePrompt(prompt))
          return { ...c, generatedPrompts: upgradedPrompts }
        }
        return c
      }))
    }
    
    setIsUpgrading(null)
  }

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const clearHistory = () => {
    setHistory([])
  }

  const loadFromHistory = (item: HistoryItem) => {
    setSearchQuery(item.query)
    setActiveTab("top")
  }

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case "High":
        return "bg-rose-500/90 text-white hover:bg-rose-500"
      case "Medium":
        return "bg-teal-500/90 text-white hover:bg-teal-500"
      case "Low":
        return "bg-emerald-500/90 text-white hover:bg-emerald-500"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-emerald-400" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-rose-400" />
      default:
        return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400"
    if (score >= 60) return "text-teal-400"
    if (score >= 40) return "text-yellow-400"
    return "text-rose-400"
  }

  // Calculate stats
  const totalKeywords = categories.reduce((sum, c) => sum + c.keywords.length, 0)
  const avgOpportunity = categories.length > 0 
    ? Math.round(categories.reduce((sum, c) => sum + c.opportunityScore, 0) / categories.length)
    : 0
  const highOpportunityCount = categories.filter(c => c.opportunityScore >= 70).length

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Gradient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-600/40 rounded-full blur-[150px]" />
        <div className="absolute -top-20 left-1/4 w-[400px] h-[400px] bg-blue-600/30 rounded-full blur-[120px]" />
        <div className="absolute top-10 right-1/3 w-[350px] h-[350px] bg-indigo-600/35 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="py-6">
          <div className="max-w-7xl mx-auto px-4">
            {/* Navigation */}
            <nav className="flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg mr-3 bg-[#1c2128]/80 hover:bg-[#1c2128] border border-[#30363d]"
              >
                <Sparkles className="w-5 h-5 text-teal-400" />
              </Button>
              
              <div className="flex items-center bg-[#1c2128]/80 rounded-full p-1 border border-[#30363d]">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                      activeTab === tab.id 
                        ? "bg-[#30363d] text-white" 
                        : "text-gray-400 hover:text-white hover:bg-transparent"
                    }`}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Settings Panel */}
          {activeTab === "settings" ? (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-400">Configure your API keys and preferences</p>
              </div>

              <div className="space-y-6">
                {/* Model Selection */}
                <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">AI Model</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "gemini-pro", name: "Gemini Pro", desc: "Best for text" },
                      { id: "gemini-pro-vision", name: "Gemini Vision", desc: "Multimodal" },
                      { id: "gpt-4", name: "GPT-4", desc: "OpenAI" },
                      { id: "claude-3", name: "Claude 3", desc: "Anthropic" },
                    ].map((model) => (
                      <button
                        key={model.id}
                        onClick={() => setSelectedModel(model.id)}
                        className={`p-4 rounded-lg border text-left transition-all ${
                          selectedModel === model.id
                            ? "border-teal-500 bg-teal-500/10"
                            : "border-[#30363d] bg-[#0d1117] hover:border-[#3d444d]"
                        }`}
                      >
                        <p className="font-medium text-white">{model.name}</p>
                        <p className="text-xs text-gray-400">{model.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt Template */}
                <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Prompt Template</h2>
                  <div className="space-y-3">
                    {promptTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`w-full p-4 rounded-lg border text-left transition-all ${
                          selectedTemplate === template.id
                            ? "border-teal-500 bg-teal-500/10"
                            : "border-[#30363d] bg-[#0d1117] hover:border-[#3d444d]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-white">{template.name}</p>
                          {selectedTemplate === template.id && (
                            <Check className="w-4 h-4 text-teal-400" />
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{template.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Output Options */}
                <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Output Options</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Default Prompt Count</label>
                      <Input
                        type="number"
                        value={defaultPromptCount}
                        onChange={(e) => {
                          setDefaultPromptCount(e.target.value)
                          setPromptCount(e.target.value)
                        }}
                        className="bg-[#0d1117] border-[#30363d] text-white h-11"
                        min="1"
                        max="500"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Language</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "en", name: "English" },
                          { id: "id", name: "Indonesian" },
                          { id: "es", name: "Spanish" },
                        ].map((lang) => (
                          <button
                            key={lang.id}
                            onClick={() => setLanguage(lang.id)}
                            className={`p-2 rounded-lg border text-sm transition-all ${
                              language === lang.id
                                ? "border-teal-500 bg-teal-500/10 text-teal-400"
                                : "border-[#30363d] bg-[#0d1117] text-gray-300 hover:border-[#3d444d]"
                            }`}
                          >
                            {lang.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-medium text-white">Auto-save Results</h2>
                      <p className="text-sm text-gray-400">Save generated prompts automatically</p>
                    </div>
                    <button
                      onClick={() => setAutoSave(!autoSave)}
                      className={`w-12 h-7 rounded-full transition-colors ${
                        autoSave ? "bg-teal-500" : "bg-[#30363d]"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          autoSave ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-[#30363d]">
                    <div>
                      <h2 className="font-medium text-white">Include Negative Prompts</h2>
                      <p className="text-sm text-gray-400">Add negative prompts for SD/SDXL</p>
                    </div>
                    <button
                      onClick={() => setIncludeNegativePrompts(!includeNegativePrompts)}
                      className={`w-12 h-7 rounded-full transition-colors ${
                        includeNegativePrompts ? "bg-teal-500" : "bg-[#30363d]"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          includeNegativePrompts ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "analysis" ? (
            /* Analysis Tab */
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Keyword Analysis</h1>
                <p className="text-gray-400">Deep dive into keyword metrics and opportunities</p>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-teal-400" />
                    </div>
                    <span className="text-sm text-gray-400">Total Categories</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{categories.length}</p>
                </div>
                
                <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-sm text-gray-400">Total Keywords</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{totalKeywords}</p>
                </div>
                
                <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-sm text-gray-400">Avg Opportunity</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{avgOpportunity}%</p>
                </div>
                
                <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-yellow-400" />
                    </div>
                    <span className="text-sm text-gray-400">High Opportunity</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{highOpportunityCount}</p>
                </div>
              </div>
              
              {/* Category Analysis Cards */}
              <div className="space-y-4">
                {sortedCategories.map((category) => (
                  <div 
                    key={category.id}
                    className="bg-[#161b22] rounded-xl border border-[#30363d] p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-teal-400">{category.name}</h3>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge className={`${getCompetitionColor(category.competition)} text-xs border-0`}>
                            {category.competition} Competition
                          </Badge>
                          <div className="flex items-center gap-1 text-sm">
                            {getTrendIcon(category.trend)}
                            <span className={category.trend === "up" ? "text-emerald-400" : category.trend === "down" ? "text-rose-400" : "text-gray-400"}>
                              {category.trendPercent}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(category.id)}
                        className={category.isFavorite ? "text-yellow-400" : "text-gray-400"}
                      >
                        <Star className={`w-5 h-5 ${category.isFavorite ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                    
                    {/* Metrics */}
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Search Volume</p>
                        <p className="text-lg font-semibold text-white">{category.searchVolumeNumber.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Difficulty Score</p>
                        <div className="flex items-center gap-2">
                          <Progress value={category.difficultyScore} className="h-2 flex-1" />
                          <span className={`text-sm font-medium ${getScoreColor(100 - category.difficultyScore)}`}>{category.difficultyScore}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Competition Score</p>
                        <div className="flex items-center gap-2">
                          <Progress value={category.competitionScore} className="h-2 flex-1" />
                          <span className={`text-sm font-medium ${getScoreColor(100 - category.competitionScore)}`}>{category.competitionScore}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Opportunity Score</p>
                        <div className="flex items-center gap-2">
                          <Progress value={category.opportunityScore} className="h-2 flex-1" />
                          <span className={`text-sm font-medium ${getScoreColor(category.opportunityScore)}`}>{category.opportunityScore}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Keywords */}
                    <div className="flex flex-wrap gap-2">
                      {category.keywords.map((keyword, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="bg-[#30363d] text-gray-200 text-xs px-3 py-1.5 cursor-pointer hover:bg-[#3d444d] border-0"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === "results" ? (
            /* Results Tab */
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Generated Results</h1>
                <p className="text-gray-400">View and manage all your generated prompts</p>
              </div>
              
              {/* Results Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-teal-400" />
                    </div>
                    <span className="text-sm text-gray-400">Total Prompts</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{totalPromptsGenerated}</p>
                </div>
                
                <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <History className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-sm text-gray-400">Search History</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{history.length}</p>
                </div>
                
                <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-sm text-gray-400">Categories with Prompts</span>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {categories.filter(c => c.generatedPrompts.length > 0).length}
                  </p>
                </div>
              </div>
              
              {/* Download All Button */}
              {categories.some(c => c.generatedPrompts.length > 0) && (
                <div className="flex justify-end">
                  <Button
                    onClick={handleDownloadAll}
                    className="bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download All Prompts
                  </Button>
                </div>
              )}
              
              {/* Generated Prompts List */}
              <div className="space-y-4">
                {categories.filter(c => c.generatedPrompts.length > 0).map((category) => (
                  <div 
                    key={category.id}
                    className="bg-[#161b22] rounded-xl border border-[#30363d] overflow-hidden"
                  >
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#1c2128]"
                      onClick={() => toggleExpand(category.id)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-teal-400 font-medium">{category.name}</span>
                        <Badge variant="secondary" className="bg-[#30363d] text-gray-200 border-0">
                          {category.generatedPrompts.length} prompts
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopyAllPrompts(category)
                          }}
                          className="text-gray-400 hover:text-white"
                        >
                          {copiedId === `all-${category.id}` ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownloadPrompts(category)
                          }}
                          className="text-gray-400 hover:text-white"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {expandedCategories.has(category.id) ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    {expandedCategories.has(category.id) && (
                      <div className="border-t border-[#30363d] p-4">
                        <ScrollArea className="h-64">
                          <div className="space-y-2 pr-4">
                            {category.generatedPrompts.map((prompt, idx) => (
                              <div
                                key={idx}
                                className="group relative bg-[#0d1117] rounded-lg p-3 text-sm text-gray-300 leading-relaxed cursor-pointer hover:bg-[#161b22] border border-[#30363d]"
                                onClick={() => handleCopyPrompt(prompt, `${category.id}-${idx}`)}
                              >
                                <p>{prompt}</p>
                                <div className="absolute top-2 right-2">
                                  {copiedId === `${category.id}-${idx}` ? (
                                    <Check className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity text-gray-400" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                ))}
                
                {categories.filter(c => c.generatedPrompts.length > 0).length === 0 && (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1c2128] flex items-center justify-center border border-[#30363d]">
                      <FileText className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No prompts generated yet</h3>
                    <p className="text-gray-400 mb-4">
                      Go to the TOP tab and generate some prompts
                    </p>
                    <Button
                      onClick={() => setActiveTab("top")}
                      className="bg-teal-500 hover:bg-teal-600 text-white"
                    >
                      Go to TOP
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Search History */}
              {history.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">Search History</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearHistory}
                      className="text-gray-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                  <div className="bg-[#161b22] rounded-xl border border-[#30363d] divide-y divide-[#30363d]">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 hover:bg-[#1c2128] cursor-pointer"
                        onClick={() => loadFromHistory(item)}
                      >
                        <div>
                          <p className="text-white font-medium">{item.query}</p>
                          <p className="text-sm text-gray-400">
                            {item.categoryCount} categories | {new Date(item.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Search className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === "donate" ? (
            /* Donate Tab */
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Support This Project</h1>
                <p className="text-gray-400">Help keep this tool free and continuously improving</p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <Coffee className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">Buy Me a Coffee</h2>
                      <p className="text-sm text-gray-400">Support with a one-time donation</p>
                    </div>
                  </div>
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Donate via Buy Me a Coffee
                  </Button>
                </div>
                
                <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">PayPal</h2>
                      <p className="text-sm text-gray-400">Send a donation via PayPal</p>
                    </div>
                  </div>
                  <Button className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white font-medium">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Donate via PayPal
                  </Button>
                </div>
                
                <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-teal-500/20 flex items-center justify-center">
                      <Gift className="w-6 h-6 text-teal-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">Other Ways to Help</h2>
                      <p className="text-sm text-gray-400">Non-monetary support options</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      Star the project on GitHub
                    </li>
                    <li className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-400" />
                      Share with friends and colleagues
                    </li>
                    <li className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-teal-400" />
                      Submit feature suggestions
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Tagline */}
              <div className="text-center mb-8">
                <p className="text-lg text-gray-200">
                  Get trend analysis, keywords, and creative ideas for your{" "}
                  <span className="font-semibold text-white">Adobe Stock</span> content.
                </p>
                <p className="text-sm text-teal-400 mt-2">
                  Using: <span className="font-medium">{selectedModel === "gemini-pro" ? "Google Gemini" : selectedModel === "gpt-4" ? "OpenAI GPT-4" : selectedModel === "claude-3" ? "Anthropic Claude" : "Google Gemini Vision"}</span>
                </p>
              </div>

              {/* Search Box */}
              <div className="max-w-3xl mx-auto mb-6 relative">
                <div className="relative bg-[#161b22] rounded-xl border border-[#30363d] p-4">
                  <Textarea
                    placeholder="Enter your keyword or topic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="min-h-[100px] bg-transparent border-none resize-none focus-visible:ring-0 text-lg text-white placeholder:text-gray-500"
                  />
                  <div className="flex justify-end mt-2">
                    <Button 
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !searchQuery.trim()}
                      className="bg-teal-500 hover:bg-teal-600 text-white px-6 font-medium"
                    >
                      {isAnalyzing ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4 mr-2" />
                      )}
                      Analyze
                    </Button>
                  </div>
                </div>
                
                {/* Autocomplete Suggestions */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#161b22] rounded-xl border border-[#30363d] overflow-hidden z-20">
                    {filteredSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        className="w-full px-4 py-3 text-left text-gray-300 hover:bg-[#1c2128] hover:text-white flex items-center gap-2"
                        onClick={() => {
                          setSearchQuery(suggestion)
                          setShowSuggestions(false)
                        }}
                      >
                        <Search className="w-4 h-4 text-gray-500" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Controls Row */}
              <div className="max-w-5xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4">
                {/* Prompts Counter */}
                <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-3 flex items-center gap-3">
                  <span className="text-sm text-gray-400">Prompts to Generate:</span>
                  <Input
                    type="number"
                    value={promptCount}
                    onChange={(e) => setPromptCount(e.target.value)}
                    className="w-20 bg-[#0d1117] border-[#30363d] text-center text-white h-9"
                    min="1"
                    max="500"
                  />
                </div>
                
                {/* Sort & Filter */}
                <div className="flex items-center gap-3">
                  <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-1 flex items-center">
                    <span className="text-sm text-gray-400 px-3">Sort:</span>
                    {[
                      { id: "opportunity", label: "Opportunity" },
                      { id: "volume", label: "Volume" },
                      { id: "trend", label: "Trend" },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSortBy(option.id as typeof sortBy)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          sortBy === option.id
                            ? "bg-teal-500/20 text-teal-400"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-1 flex items-center">
                    <Filter className="w-4 h-4 text-gray-400 ml-2" />
                    {["all", "Low", "Medium", "High"].map((level) => (
                      <button
                        key={level}
                        onClick={() => setFilterCompetition(level as typeof filterCompetition)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          filterCompetition === level
                            ? "bg-teal-500/20 text-teal-400"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {level === "all" ? "All" : level}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Generate All & Upgrade All Buttons */}
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleGenerateAll}
                    disabled={isGeneratingAll || sortedCategories.length === 0 || isUpgrading !== null}
                    className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-medium"
                  >
                    {isGeneratingAll ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4 mr-2" />
                    )}
                    Generate All
                  </Button>
                  {categories.some(c => c.generatedPrompts.length > 0) && (
                    <Button
                      onClick={handleUpgradeAll}
                      disabled={isUpgrading !== null || isGeneratingAll}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium"
                    >
                      {isUpgrading !== null ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Wand2 className="w-4 h-4 mr-2" />
                      )}
                      Upgrade All
                    </Button>
                  )}
                </div>
              </div>

              {/* Results Table */}
              <div className="bg-[#161b22]/60 backdrop-blur-sm rounded-xl border border-[#30363d] overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#30363d] text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Main Keywords</div>
                  <div className="col-span-1">Volume</div>
                  <div className="col-span-1">Competition</div>
                  <div className="col-span-1">Trend</div>
                  <div className="col-span-1">Opportunity</div>
                  <div className="col-span-3">Generated Prompts</div>
                  <div className="col-span-1">Actions</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-[#30363d]/50">
                  {sortedCategories.map((category) => (
                    <div key={category.id} className="grid grid-cols-12 gap-4 px-6 py-5 items-start hover:bg-[#1c2128]/50 transition-colors">
                      {/* Category Name */}
                      <div className="col-span-2">
                        <div className="flex items-start gap-2">
                          <button
                            onClick={() => toggleFavorite(category.id)}
                            className={`mt-0.5 ${category.isFavorite ? "text-yellow-400" : "text-gray-600 hover:text-gray-400"}`}
                          >
                            <Star className={`w-4 h-4 ${category.isFavorite ? "fill-current" : ""}`} />
                          </button>
                          <span className="text-teal-400 font-medium leading-tight">
                            {category.name}
                          </span>
                        </div>
                      </div>

                      {/* Keywords */}
                      <div className="col-span-2 flex flex-wrap gap-1.5">
                        {category.keywords.slice(0, 3).map((keyword, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="bg-[#30363d] text-gray-200 text-xs px-2 py-1 cursor-pointer hover:bg-[#3d444d] border-0"
                          >
                            {keyword}
                          </Badge>
                        ))}
                        {category.keywords.length > 3 && (
                          <Badge variant="secondary" className="bg-[#30363d]/50 text-gray-400 text-xs px-2 py-1 border-0">
                            +{category.keywords.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Search Volume */}
                      <div className="col-span-1">
                        <div className="text-sm">
                          <span className="text-white font-medium">{category.searchVolume}</span>
                          <p className="text-xs text-gray-500">{(category.searchVolumeNumber / 1000).toFixed(0)}K</p>
                        </div>
                      </div>

                      {/* Competition */}
                      <div className="col-span-1">
                        <Badge className={`${getCompetitionColor(category.competition)} text-xs border-0`}>
                          {category.competition}
                        </Badge>
                      </div>

                      {/* Trend */}
                      <div className="col-span-1">
                        <div className="flex items-center gap-1">
                          {getTrendIcon(category.trend)}
                          <span className={`text-sm ${
                            category.trend === "up" ? "text-emerald-400" : 
                            category.trend === "down" ? "text-rose-400" : "text-gray-400"
                          }`}>
                            {category.trendPercent}%
                          </span>
                        </div>
                      </div>

                      {/* Opportunity Score */}
                      <div className="col-span-1">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
                            style={{
                              borderColor: category.opportunityScore >= 70 ? '#34d399' : 
                                          category.opportunityScore >= 50 ? '#2dd4bf' : 
                                          category.opportunityScore >= 30 ? '#facc15' : '#f87171'
                            }}
                          >
                            <span className={`text-sm font-bold ${getScoreColor(category.opportunityScore)}`}>
                              {category.opportunityScore}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Generated Prompts */}
                      <div className="col-span-3">
                        {category.generatedPrompts.length > 0 ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadPrompts(category)}
                                className="bg-[#30363d] border-[#30363d] text-gray-200 hover:bg-[#3d444d] hover:text-white text-xs"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopyAllPrompts(category)}
                                className="bg-[#30363d] border-[#30363d] text-gray-200 hover:bg-[#3d444d] hover:text-white text-xs"
                              >
                                {copiedId === `all-${category.id}` ? (
                                  <Check className="w-3 h-3 mr-1 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3 mr-1" />
                                )}
                                Copy All
                              </Button>
                              <Badge variant="secondary" className="bg-teal-500/20 text-teal-400 border-0 text-xs">
                                {category.generatedPrompts.length} prompts
                              </Badge>
                            </div>
                            <ScrollArea className="h-24">
                              <div className="space-y-1.5 pr-3">
                                {category.generatedPrompts.slice(0, 3).map((prompt, idx) => (
                                  <div
                                    key={idx}
                                    className="group relative bg-[#0d1117] rounded-lg p-2 text-xs text-gray-300 leading-relaxed cursor-pointer hover:bg-[#161b22] border border-[#30363d]"
                                    onClick={() => handleCopyPrompt(prompt, `${category.id}-${idx}`)}
                                  >
                                    <p className="line-clamp-2 pr-5">{prompt}</p>
                                    {copiedId === `${category.id}-${idx}` ? (
                                      <Check className="absolute top-2 right-2 w-3 h-3 text-emerald-400" />
                                    ) : (
                                      <Copy className="absolute top-2 right-2 w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity text-gray-400" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic">
                            Click Generate to create prompts
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="col-span-1 flex flex-col gap-2">
                        <Button
                          onClick={() => handleGeneratePrompts(category.id)}
                          disabled={isGenerating === category.id || isGeneratingAll || isUpgrading === category.id}
                          className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium w-full"
                          size="sm"
                        >
                          {isGenerating === category.id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            "Generate"
                          )}
                        </Button>
                        {category.generatedPrompts.length > 0 && (
                          <Button
                            onClick={() => handleUpgradePrompts(category.id)}
                            disabled={isUpgrading === category.id || isGenerating === category.id || isGeneratingAll}
                            variant="outline"
                            className="bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30 hover:text-amber-300 text-sm font-medium w-full"
                            size="sm"
                          >
                            {isUpgrading === category.id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <>
                                <Wand2 className="w-3.5 h-3.5 mr-1" />
                                Upgrade
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Empty State */}
              {sortedCategories.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1c2128] flex items-center justify-center border border-[#30363d]">
                    <Search className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">No results yet</h3>
                  <p className="text-gray-400">
                    Enter a keyword above and click Analyze to get started
                  </p>
                </div>
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-[#30363d]/50 mt-12">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
            <p>Keyword Research & Prompt Generator for Stock Content Creators</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
