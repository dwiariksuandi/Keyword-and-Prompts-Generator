"use client"

import { useState, useEffect, useRef } from "react"
import { Search, TrendingUp, TrendingDown, Minus, Plus, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockKeywords, autocompleteSuggestions } from "@/lib/mock-data"
import type { Keyword } from "@/lib/types"
import { cn } from "@/lib/utils"

export function KeywordResearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [results, setResults] = useState<Keyword[]>([])
  const [savedKeywords, setSavedKeywords] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const prefix = searchQuery.toLowerCase().slice(0, 3)
      const matches = autocompleteSuggestions[prefix] || []
      const filtered = matches.filter((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSuggestions(filtered.length > 0 ? filtered : [`${searchQuery} art`, `${searchQuery} design`, `${searchQuery} photography`])
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery
    if (!searchTerm.trim()) return

    const filtered = mockKeywords.filter(
      (k) =>
        k.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
        searchTerm.toLowerCase().includes(k.keyword.toLowerCase().split(" ")[0])
    )

    if (filtered.length > 0) {
      setResults(filtered)
    } else {
      // Generate mock results for any search
      setResults([
        {
          id: `gen-1`,
          keyword: searchTerm,
          searchVolume: Math.floor(Math.random() * 200000) + 10000,
          competition: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
          trend: ["rising", "stable", "declining"][Math.floor(Math.random() * 3)] as "rising" | "stable" | "declining",
          score: Math.floor(Math.random() * 40) + 60,
          cpc: Number((Math.random() * 2 + 0.5).toFixed(2)),
        },
        {
          id: `gen-2`,
          keyword: `${searchTerm} aesthetic`,
          searchVolume: Math.floor(Math.random() * 100000) + 5000,
          competition: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
          trend: ["rising", "stable", "declining"][Math.floor(Math.random() * 3)] as "rising" | "stable" | "declining",
          score: Math.floor(Math.random() * 40) + 60,
          cpc: Number((Math.random() * 2 + 0.5).toFixed(2)),
        },
        {
          id: `gen-3`,
          keyword: `${searchTerm} design`,
          searchVolume: Math.floor(Math.random() * 80000) + 3000,
          competition: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
          trend: ["rising", "stable", "declining"][Math.floor(Math.random() * 3)] as "rising" | "stable" | "declining",
          score: Math.floor(Math.random() * 40) + 60,
          cpc: Number((Math.random() * 2 + 0.5).toFixed(2)),
        },
      ])
    }
    setShowSuggestions(false)
  }

  const selectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    handleSearch(suggestion)
  }

  const toggleSaveKeyword = (keyword: string) => {
    setSavedKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword]
    )
  }

  const getTrendIcon = (trend: Keyword["trend"]) => {
    switch (trend) {
      case "rising":
        return <TrendingUp className="h-4 w-4 text-accent" />
      case "declining":
        return <TrendingDown className="h-4 w-4 text-destructive" />
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getCompetitionColor = (competition: Keyword["competition"]) => {
    switch (competition) {
      case "low":
        return "bg-accent/20 text-accent border-accent/30"
      case "medium":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30"
      case "high":
        return "bg-destructive/20 text-destructive border-destructive/30"
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Keyword Research</h1>
        <p className="text-muted-foreground mt-1">
          Discover high-performing keywords with auto-complete suggestions
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Search Keywords</CardTitle>
          <CardDescription>
            Start typing to see suggestions, then search for detailed metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  placeholder="Enter a keyword (e.g., digital art, fantasy landscape)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border border-border bg-popover p-1 shadow-lg"
                  >
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => selectSuggestion(suggestion)}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <Search className="h-3 w-3 text-muted-foreground" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button onClick={() => handleSearch()} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Search Results</CardTitle>
            <CardDescription>
              Found {results.length} keywords matching your search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((keyword) => (
                <div
                  key={keyword.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleSaveKeyword(keyword.keyword)}
                      className={cn(
                        "rounded-full p-1.5 transition-colors",
                        savedKeywords.includes(keyword.keyword)
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          savedKeywords.includes(keyword.keyword) && "fill-current"
                        )}
                      />
                    </button>
                    <div>
                      <h3 className="font-medium text-foreground">{keyword.keyword}</h3>
                      <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{formatNumber(keyword.searchVolume)} searches/mo</span>
                        <span className="text-border">|</span>
                        <span>${keyword.cpc} CPC</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      {getTrendIcon(keyword.trend)}
                      <span className="text-sm capitalize text-muted-foreground">
                        {keyword.trend}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("capitalize", getCompetitionColor(keyword.competition))}
                    >
                      {keyword.competition}
                    </Badge>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <span className="text-sm font-semibold text-primary">
                        {keyword.score}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {savedKeywords.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Star className="h-5 w-5 text-primary fill-primary" />
              Saved Keywords
            </CardTitle>
            <CardDescription>
              Your collection of {savedKeywords.length} saved keywords
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {savedKeywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="cursor-pointer bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5"
                  onClick={() => {
                    setSearchQuery(keyword)
                    handleSearch(keyword)
                  }}
                >
                  {keyword}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSaveKeyword(keyword)
                    }}
                    className="ml-2 hover:text-destructive"
                  >
                    <Plus className="h-3 w-3 rotate-45" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
