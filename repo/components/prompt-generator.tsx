"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Wand2, Copy, Download, RefreshCw, Trash2, Check, Sparkles } from "lucide-react"
import { imageStyles, aspectRatios, moods, lightingOptions } from "@/lib/mock-data"
import type { ImagePrompt, PromptSettings } from "@/lib/types"
import { cn } from "@/lib/utils"

export function PromptGenerator() {
  const [settings, setSettings] = useState<PromptSettings>({
    style: "Photorealistic",
    aspectRatio: "1:1",
    mood: "Dramatic",
    lighting: "Natural Light",
    subject: "",
    additionalDetails: "",
    quantity: 5,
  })
  const [generatedPrompts, setGeneratedPrompts] = useState<ImagePrompt[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePrompts = useCallback(() => {
    if (!settings.subject.trim()) return

    setIsGenerating(true)
    
    // Simulate generation delay
    setTimeout(() => {
      const variations = [
        "high quality",
        "ultra detailed",
        "professional",
        "award-winning",
        "masterpiece",
        "8k resolution",
        "trending on artstation",
        "hyperrealistic",
        "stunning",
        "beautiful",
      ]

      const compositions = [
        "centered composition",
        "rule of thirds",
        "dynamic angle",
        "close-up shot",
        "wide angle",
        "bird's eye view",
        "low angle shot",
        "symmetrical",
        "golden ratio",
        "cinematic framing",
      ]

      const newPrompts: ImagePrompt[] = Array.from({ length: settings.quantity }, (_, i) => {
        const randomVariations = variations
          .sort(() => Math.random() - 0.5)
          .slice(0, 2)
          .join(", ")

        const randomComposition = compositions[Math.floor(Math.random() * compositions.length)]

        let prompt = `${settings.subject}, ${settings.style.toLowerCase()} style`
        prompt += `, ${settings.mood.toLowerCase()} mood`
        prompt += `, ${settings.lighting.toLowerCase()}`
        prompt += `, ${randomComposition}`
        prompt += `, ${randomVariations}`
        
        if (settings.additionalDetails.trim()) {
          prompt += `, ${settings.additionalDetails}`
        }

        prompt += ` --ar ${settings.aspectRatio}`

        return {
          id: `prompt-${Date.now()}-${i}`,
          prompt,
          style: settings.style,
          aspectRatio: settings.aspectRatio,
          quality: "high",
          optimized: false,
        }
      })

      setGeneratedPrompts((prev) => [...newPrompts, ...prev])
      setIsGenerating(false)
    }, 800)
  }, [settings])

  const copyPrompt = async (prompt: ImagePrompt) => {
    await navigator.clipboard.writeText(prompt.prompt)
    setCopiedId(prompt.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const deletePrompt = (id: string) => {
    setGeneratedPrompts((prev) => prev.filter((p) => p.id !== id))
  }

  const clearAll = () => {
    setGeneratedPrompts([])
  }

  const downloadAll = () => {
    const text = generatedPrompts.map((p) => p.prompt).join("\n\n")
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "generated-prompts.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Image Prompt Generator</h1>
        <p className="text-muted-foreground mt-1">
          Create optimized prompts for AI image generation with bulk output
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              Prompt Settings
            </CardTitle>
            <CardDescription>
              Configure your prompt parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-foreground">Subject / Main Idea</Label>
              <Textarea
                id="subject"
                placeholder="Describe your image subject (e.g., A majestic lion in a savanna, A futuristic city skyline)"
                value={settings.subject}
                onChange={(e) => setSettings((prev) => ({ ...prev, subject: e.target.value }))}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[80px]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-foreground">Art Style</Label>
                <Select
                  value={settings.style}
                  onValueChange={(value) => setSettings((prev) => ({ ...prev, style: value }))}
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border max-h-[200px]">
                    {imageStyles.map((style) => (
                      <SelectItem key={style} value={style} className="text-foreground">
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Aspect Ratio</Label>
                <Select
                  value={settings.aspectRatio}
                  onValueChange={(value) => setSettings((prev) => ({ ...prev, aspectRatio: value }))}
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {aspectRatios.map((ratio) => (
                      <SelectItem key={ratio.value} value={ratio.value} className="text-foreground">
                        {ratio.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Mood</Label>
                <Select
                  value={settings.mood}
                  onValueChange={(value) => setSettings((prev) => ({ ...prev, mood: value }))}
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border max-h-[200px]">
                    {moods.map((mood) => (
                      <SelectItem key={mood} value={mood} className="text-foreground">
                        {mood}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Lighting</Label>
                <Select
                  value={settings.lighting}
                  onValueChange={(value) => setSettings((prev) => ({ ...prev, lighting: value }))}
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border max-h-[200px]">
                    {lightingOptions.map((option) => (
                      <SelectItem key={option} value={option} className="text-foreground">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional" className="text-foreground">Additional Details</Label>
              <Input
                id="additional"
                placeholder="Add extra details (e.g., vibrant colors, bokeh background)"
                value={settings.additionalDetails}
                onChange={(e) => setSettings((prev) => ({ ...prev, additionalDetails: e.target.value }))}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Number of Prompts</Label>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  {settings.quantity} prompts
                </Badge>
              </div>
              <Slider
                value={[settings.quantity]}
                onValueChange={(value) => setSettings((prev) => ({ ...prev, quantity: value[0] }))}
                min={1}
                max={20}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>20</span>
              </div>
            </div>

            <Button
              onClick={generatePrompts}
              disabled={!settings.subject.trim() || isGenerating}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate {settings.quantity} Prompts
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Generated Prompts</CardTitle>
              <CardDescription>
                {generatedPrompts.length} prompts generated
              </CardDescription>
            </div>
            {generatedPrompts.length > 0 && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={downloadAll} className="border-border text-foreground">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll} className="border-border text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {generatedPrompts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Wand2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">No Prompts Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Configure your settings and generate prompts
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {generatedPrompts.map((prompt) => (
                  <div
                    key={prompt.id}
                    className="group rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm text-foreground flex-1">{prompt.prompt}</p>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => copyPrompt(prompt)}
                        >
                          {copiedId === prompt.id ? (
                            <Check className="h-4 w-4 text-accent" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => deletePrompt(prompt.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                        {prompt.style}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-secondary text-foreground border-border">
                        {prompt.aspectRatio}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
