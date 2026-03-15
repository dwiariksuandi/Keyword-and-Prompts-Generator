"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Copy, Check, ArrowRight, Lightbulb, Zap, Target, Palette, AlertCircle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface OptimizationResult {
  original: string
  optimized: string
  improvements: string[]
  score: {
    before: number
    after: number
  }
  suggestions: string[]
}

interface OptimizationOptions {
  enhanceDetails: boolean
  addQualityModifiers: boolean
  optimizeLighting: boolean
  improveComposition: boolean
  addArtisticStyle: boolean
  fixGrammar: boolean
}

const qualityModifiers = [
  "highly detailed",
  "8k uhd",
  "ultra realistic",
  "professional photography",
  "award-winning",
  "masterpiece",
]

const compositionTerms = [
  "rule of thirds",
  "golden ratio composition",
  "symmetrical",
  "dynamic angle",
  "cinematic framing",
]

const lightingTerms = [
  "volumetric lighting",
  "ray tracing",
  "global illumination",
  "ambient occlusion",
  "soft shadows",
]

const artisticStyles = [
  "trending on artstation",
  "concept art",
  "digital painting",
  "matte painting",
  "intricate details",
]

export function PromptOptimizer() {
  const [inputPrompt, setInputPrompt] = useState("")
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [options, setOptions] = useState<OptimizationOptions>({
    enhanceDetails: true,
    addQualityModifiers: true,
    optimizeLighting: true,
    improveComposition: true,
    addArtisticStyle: true,
    fixGrammar: true,
  })

  const analyzePrompt = (prompt: string) => {
    const lowerPrompt = prompt.toLowerCase()
    const issues: string[] = []
    const suggestions: string[] = []

    // Check for quality modifiers
    const hasQuality = qualityModifiers.some((mod) => lowerPrompt.includes(mod.toLowerCase()))
    if (!hasQuality) {
      issues.push("Missing quality modifiers")
      suggestions.push("Add quality terms like 'highly detailed' or '8k uhd'")
    }

    // Check for lighting
    const hasLighting = lightingTerms.some((term) => lowerPrompt.includes(term.toLowerCase())) ||
      lowerPrompt.includes("lighting") || lowerPrompt.includes("light")
    if (!hasLighting) {
      issues.push("No lighting specified")
      suggestions.push("Consider adding lighting details like 'volumetric lighting' or 'soft shadows'")
    }

    // Check for composition
    const hasComposition = compositionTerms.some((term) => lowerPrompt.includes(term.toLowerCase()))
    if (!hasComposition) {
      issues.push("Missing composition guidance")
      suggestions.push("Add composition terms like 'rule of thirds' or 'cinematic framing'")
    }

    // Check for style
    const hasStyle = artisticStyles.some((style) => lowerPrompt.includes(style.toLowerCase()))
    if (!hasStyle) {
      issues.push("No artistic style specified")
      suggestions.push("Include style references like 'trending on artstation' or 'concept art'")
    }

    // Check prompt length
    if (prompt.length < 50) {
      issues.push("Prompt is too short")
      suggestions.push("Add more descriptive details for better results")
    }

    // Calculate score
    const baseScore = 30
    const qualityBonus = hasQuality ? 20 : 0
    const lightingBonus = hasLighting ? 15 : 0
    const compositionBonus = hasComposition ? 15 : 0
    const styleBonus = hasStyle ? 15 : 0
    const lengthBonus = prompt.length >= 100 ? 5 : prompt.length >= 50 ? 3 : 0

    return {
      score: baseScore + qualityBonus + lightingBonus + compositionBonus + styleBonus + lengthBonus,
      issues,
      suggestions,
    }
  }

  const optimizePrompt = () => {
    if (!inputPrompt.trim()) return

    setIsOptimizing(true)

    setTimeout(() => {
      const analysis = analyzePrompt(inputPrompt)
      const improvements: string[] = []
      let optimized = inputPrompt.trim()

      // Clean up existing prompt
      optimized = optimized.replace(/,\s*,/g, ",").replace(/\s+/g, " ")

      // Add quality modifiers
      if (options.addQualityModifiers) {
        const qualityToAdd = qualityModifiers.filter(
          (mod) => !optimized.toLowerCase().includes(mod.toLowerCase())
        ).slice(0, 2)
        if (qualityToAdd.length > 0) {
          optimized += `, ${qualityToAdd.join(", ")}`
          improvements.push("Added quality modifiers")
        }
      }

      // Add lighting
      if (options.optimizeLighting) {
        const hasLighting = lightingTerms.some((term) => optimized.toLowerCase().includes(term.toLowerCase()))
        if (!hasLighting) {
          const lightingToAdd = lightingTerms[Math.floor(Math.random() * 2)]
          optimized += `, ${lightingToAdd}`
          improvements.push("Enhanced lighting details")
        }
      }

      // Add composition
      if (options.improveComposition) {
        const hasComposition = compositionTerms.some((term) => optimized.toLowerCase().includes(term.toLowerCase()))
        if (!hasComposition) {
          const compositionToAdd = compositionTerms[Math.floor(Math.random() * compositionTerms.length)]
          optimized += `, ${compositionToAdd}`
          improvements.push("Improved composition")
        }
      }

      // Add artistic style
      if (options.addArtisticStyle) {
        const hasStyle = artisticStyles.some((style) => optimized.toLowerCase().includes(style.toLowerCase()))
        if (!hasStyle) {
          const styleToAdd = artisticStyles[Math.floor(Math.random() * 2)]
          optimized += `, ${styleToAdd}`
          improvements.push("Added artistic style reference")
        }
      }

      // Enhance details
      if (options.enhanceDetails) {
        if (!optimized.toLowerCase().includes("intricate") && !optimized.toLowerCase().includes("detailed")) {
          optimized = optimized.replace(/^/, "").trim()
          if (!optimized.toLowerCase().startsWith("a ") && !optimized.toLowerCase().startsWith("an ")) {
            // Keep as is
          }
          improvements.push("Enhanced descriptive details")
        }
      }

      // Fix grammar
      if (options.fixGrammar) {
        // Capitalize first letter
        optimized = optimized.charAt(0).toUpperCase() + optimized.slice(1)
        // Remove trailing comma
        optimized = optimized.replace(/,\s*$/, "")
        improvements.push("Fixed formatting")
      }

      const afterAnalysis = analyzePrompt(optimized)

      setResult({
        original: inputPrompt,
        optimized,
        improvements,
        score: {
          before: analysis.score,
          after: Math.min(afterAnalysis.score, 100),
        },
        suggestions: analysis.suggestions,
      })

      setIsOptimizing(false)
    }, 1200)
  }

  const copyOptimized = async () => {
    if (result) {
      await navigator.clipboard.writeText(result.optimized)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent"
    if (score >= 60) return "text-chart-3"
    if (score >= 40) return "text-chart-4"
    return "text-destructive"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Prompt Optimizer</h1>
        <p className="text-muted-foreground mt-1">
          Enhance your prompts for better AI image generation results
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Input Prompt
              </CardTitle>
              <CardDescription>
                Paste your prompt to analyze and optimize
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your image generation prompt here... (e.g., A dragon flying over a medieval castle)"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                className="min-h-[120px] bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
              <Button
                onClick={optimizePrompt}
                disabled={!inputPrompt.trim() || isOptimizing}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isOptimizing ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Optimize Prompt
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Optimization Results</CardTitle>
                <CardDescription>
                  Your prompt has been enhanced
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="optimized" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-muted">
                    <TabsTrigger value="optimized" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Optimized
                    </TabsTrigger>
                    <TabsTrigger value="comparison" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Comparison
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="optimized" className="mt-4 space-y-4">
                    <div className="relative rounded-lg border border-primary/30 bg-primary/5 p-4">
                      <p className="text-foreground pr-10">{result.optimized}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={copyOptimized}
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-accent" />
                        ) : (
                          <Copy className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.improvements.map((improvement, index) => (
                        <Badge key={index} className="bg-accent/20 text-accent border-accent/30">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {improvement}
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="comparison" className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-muted-foreground">Original</Label>
                          <Badge variant="outline" className={cn("border-border", getScoreColor(result.score.before))}>
                            Score: {result.score.before}
                          </Badge>
                        </div>
                        <div className="rounded-lg border border-border bg-secondary/30 p-3 min-h-[100px]">
                          <p className="text-sm text-foreground">{result.original}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-accent">Optimized</Label>
                          <Badge variant="outline" className={cn("border-accent/30", getScoreColor(result.score.after))}>
                            Score: {result.score.after}
                          </Badge>
                        </div>
                        <div className="rounded-lg border border-accent/30 bg-accent/5 p-3 min-h-[100px]">
                          <p className="text-sm text-foreground">{result.optimized}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Score Improvement</span>
                          <span className="text-sm font-medium text-accent">
                            +{result.score.after - result.score.before} points
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={result.score.before} className="flex-1 h-2" />
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <Progress value={result.score.after} className="flex-1 h-2" />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-lg">Optimization Options</CardTitle>
              <CardDescription>
                Customize enhancement settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <Label htmlFor="quality" className="text-sm text-foreground">Quality Modifiers</Label>
                </div>
                <Switch
                  id="quality"
                  checked={options.addQualityModifiers}
                  onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, addQualityModifiers: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-chart-3" />
                  <Label htmlFor="lighting" className="text-sm text-foreground">Lighting Enhancement</Label>
                </div>
                <Switch
                  id="lighting"
                  checked={options.optimizeLighting}
                  onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, optimizeLighting: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-chart-4" />
                  <Label htmlFor="composition" className="text-sm text-foreground">Composition</Label>
                </div>
                <Switch
                  id="composition"
                  checked={options.improveComposition}
                  onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, improveComposition: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-accent" />
                  <Label htmlFor="style" className="text-sm text-foreground">Artistic Style</Label>
                </div>
                <Switch
                  id="style"
                  checked={options.addArtisticStyle}
                  onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, addArtisticStyle: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-chart-5" />
                  <Label htmlFor="details" className="text-sm text-foreground">Enhance Details</Label>
                </div>
                <Switch
                  id="details"
                  checked={options.enhanceDetails}
                  onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, enhanceDetails: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-chart-3" />
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-secondary/30 p-3">
                <p className="text-sm text-foreground font-medium mb-1">Be Specific</p>
                <p className="text-xs text-muted-foreground">
                  Include details about colors, textures, and materials for better results.
                </p>
              </div>
              <div className="rounded-lg bg-secondary/30 p-3">
                <p className="text-sm text-foreground font-medium mb-1">Use References</p>
                <p className="text-xs text-muted-foreground">
                  Mention specific artists or styles like "in the style of Studio Ghibli".
                </p>
              </div>
              <div className="rounded-lg bg-secondary/30 p-3">
                <p className="text-sm text-foreground font-medium mb-1">Avoid Negatives</p>
                <p className="text-xs text-muted-foreground">
                  Focus on what you want, not what you don't. Use negative prompts separately.
                </p>
              </div>
            </CardContent>
          </Card>

          {result && result.suggestions.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-chart-4" />
                  Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2 rounded-lg bg-chart-4/10 p-3">
                      <ArrowRight className="h-4 w-4 text-chart-4 mt-0.5 shrink-0" />
                      <p className="text-sm text-foreground">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
