"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Globe, Search, ExternalLink, Users, BarChart3, Eye, Plus } from "lucide-react"
import { mockCompetitors } from "@/lib/mock-data"
import type { Competitor } from "@/lib/types"
import { cn } from "@/lib/utils"

export function CompetitorAnalysis() {
  const [searchQuery, setSearchQuery] = useState("")
  const [competitors, setCompetitors] = useState<Competitor[]>(mockCompetitors)
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null)

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    // Simulate adding a new competitor
    const newCompetitor: Competitor = {
      id: `comp-${Date.now()}`,
      name: searchQuery.split(".")[0].charAt(0).toUpperCase() + searchQuery.split(".")[0].slice(1),
      domain: searchQuery.includes(".") ? searchQuery : `${searchQuery}.com`,
      keywords: ["digital art", "creative design", "photography", "illustration"],
      traffic: Math.floor(Math.random() * 5000000) + 500000,
      overlap: Math.floor(Math.random() * 50) + 20,
    }
    setCompetitors([newCompetitor, ...competitors])
    setSearchQuery("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Competitor Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Analyze competitor keywords and discover content gaps
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Add Competitor</CardTitle>
          <CardDescription>
            Enter a domain to analyze their keyword strategy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Enter competitor domain (e.g., artstation.com)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button onClick={handleSearch} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Tracked Competitors</CardTitle>
              <CardDescription>
                {competitors.length} competitors being analyzed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {competitors.map((competitor) => (
                  <div
                    key={competitor.id}
                    onClick={() => setSelectedCompetitor(competitor)}
                    className={cn(
                      "flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-colors",
                      selectedCompetitor?.id === competitor.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-secondary/30 hover:bg-secondary/50"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                        <Globe className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{competitor.name}</h3>
                        <p className="text-sm text-muted-foreground">{competitor.domain}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Monthly Traffic</p>
                        <p className="font-semibold text-foreground">
                          {formatNumber(competitor.traffic)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Keyword Overlap</p>
                        <div className="flex items-center gap-2">
                          <Progress value={competitor.overlap} className="w-16 h-2" />
                          <span className="font-semibold text-foreground">{competitor.overlap}%</span>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {selectedCompetitor ? (
            <>
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    {selectedCompetitor.name}
                  </CardTitle>
                  <CardDescription>{selectedCompetitor.domain}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-secondary/50 p-3 text-center">
                      <Users className="h-5 w-5 text-primary mx-auto mb-1" />
                      <p className="text-lg font-bold text-foreground">
                        {formatNumber(selectedCompetitor.traffic)}
                      </p>
                      <p className="text-xs text-muted-foreground">Monthly Visits</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3 text-center">
                      <BarChart3 className="h-5 w-5 text-accent mx-auto mb-1" />
                      <p className="text-lg font-bold text-foreground">
                        {selectedCompetitor.keywords.length * 25}
                      </p>
                      <p className="text-xs text-muted-foreground">Keywords</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground text-lg">Top Keywords</CardTitle>
                  <CardDescription>Most valuable keywords for this competitor</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompetitor.keywords.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground text-lg">Content Gaps</CardTitle>
                  <CardDescription>Keywords they rank for that you don't</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {["concept art tutorials", "digital painting techniques", "character design tips", "color theory guide"].map((keyword, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-md bg-secondary/30 px-3 py-2"
                      >
                        <span className="text-sm text-foreground">{keyword}</span>
                        <Button size="sm" variant="ghost" className="h-7 text-primary">
                          <Plus className="h-3 w-3 mr-1" />
                          Track
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Select a Competitor</h3>
                <p className="text-sm text-muted-foreground">
                  Click on a competitor to view detailed analysis
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
