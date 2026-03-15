"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Target, Award, ArrowUpDown, Filter, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { mockKeywords } from "@/lib/mock-data"
import type { Keyword } from "@/lib/types"
import { cn } from "@/lib/utils"

type SortField = "score" | "searchVolume" | "competition" | "cpc"
type SortDirection = "asc" | "desc"

export function KeywordScoring() {
  const [keywords, setKeywords] = useState<Keyword[]>(mockKeywords)
  const [sortField, setSortField] = useState<SortField>("score")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [competitionFilter, setCompetitionFilter] = useState<string>("all")

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-accent"
    if (score >= 70) return "text-chart-3"
    if (score >= 50) return "text-chart-4"
    return "text-destructive"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return "bg-accent/20"
    if (score >= 70) return "bg-chart-3/20"
    if (score >= 50) return "bg-chart-4/20"
    return "bg-destructive/20"
  }

  const getCompetitionValue = (competition: Keyword["competition"]) => {
    switch (competition) {
      case "low": return 1
      case "medium": return 2
      case "high": return 3
    }
  }

  const filteredAndSortedKeywords = [...keywords]
    .filter((k) => competitionFilter === "all" || k.competition === competitionFilter)
    .sort((a, b) => {
      let aVal: number, bVal: number
      switch (sortField) {
        case "score":
          aVal = a.score
          bVal = b.score
          break
        case "searchVolume":
          aVal = a.searchVolume
          bVal = b.searchVolume
          break
        case "competition":
          aVal = getCompetitionValue(a.competition)
          bVal = getCompetitionValue(b.competition)
          break
        case "cpc":
          aVal = a.cpc || 0
          bVal = b.cpc || 0
          break
        default:
          return 0
      }
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal
    })

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const avgScore = Math.round(keywords.reduce((acc, k) => acc + k.score, 0) / keywords.length)
  const topPerformers = keywords.filter((k) => k.score >= 85).length
  const lowCompetition = keywords.filter((k) => k.competition === "low").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Keyword Scoring</h1>
        <p className="text-muted-foreground mt-1">
          Analyze and rank keywords based on search volume, competition, and opportunity
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold text-foreground mt-1">{avgScore}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Top Performers</p>
                <p className="text-2xl font-bold text-foreground mt-1">{topPerformers}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Competition</p>
                <p className="text-2xl font-bold text-foreground mt-1">{lowCompetition}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Keywords</p>
                <p className="text-2xl font-bold text-foreground mt-1">{keywords.length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-chart-4/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-chart-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Keyword Rankings</CardTitle>
            <CardDescription>
              Sort and filter keywords by various metrics
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={competitionFilter} onValueChange={setCompetitionFilter}>
              <SelectTrigger className="w-[150px] bg-input border-border text-foreground">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all" className="text-foreground">All</SelectItem>
                <SelectItem value="low" className="text-foreground">Low Competition</SelectItem>
                <SelectItem value="medium" className="text-foreground">Medium</SelectItem>
                <SelectItem value="high" className="text-foreground">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-6 gap-4 bg-muted/50 px-4 py-3 text-sm font-medium text-muted-foreground">
              <div className="col-span-2">Keyword</div>
              <button
                onClick={() => toggleSort("searchVolume")}
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                Volume
                <ArrowUpDown className="h-3 w-3" />
              </button>
              <button
                onClick={() => toggleSort("competition")}
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                Competition
                <ArrowUpDown className="h-3 w-3" />
              </button>
              <button
                onClick={() => toggleSort("cpc")}
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                CPC
                <ArrowUpDown className="h-3 w-3" />
              </button>
              <button
                onClick={() => toggleSort("score")}
                className="flex items-center gap-1 hover:text-foreground transition-colors justify-end"
              >
                Score
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 ml-1" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover border-border text-foreground">
                      <p>Composite score based on volume,</p>
                      <p>competition, and trend data</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </button>
            </div>
            <div className="divide-y divide-border">
              {filteredAndSortedKeywords.map((keyword, index) => (
                <div
                  key={keyword.id}
                  className="grid grid-cols-6 gap-4 px-4 py-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm font-medium text-muted-foreground">
                      {index + 1}
                    </div>
                    <span className="font-medium text-foreground">{keyword.keyword}</span>
                  </div>
                  <div className="flex items-center text-foreground">
                    {formatNumber(keyword.searchVolume)}
                  </div>
                  <div className="flex items-center">
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize",
                        keyword.competition === "low" && "bg-accent/20 text-accent border-accent/30",
                        keyword.competition === "medium" && "bg-chart-3/20 text-chart-3 border-chart-3/30",
                        keyword.competition === "high" && "bg-destructive/20 text-destructive border-destructive/30"
                      )}
                    >
                      {keyword.competition}
                    </Badge>
                  </div>
                  <div className="flex items-center text-foreground">
                    ${keyword.cpc?.toFixed(2)}
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <div
                      className={cn(
                        "flex h-10 w-14 items-center justify-center rounded-lg font-bold",
                        getScoreBgColor(keyword.score),
                        getScoreColor(keyword.score)
                      )}
                    >
                      {keyword.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Scoring Methodology</CardTitle>
          <CardDescription>
            How we calculate keyword opportunity scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-secondary/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground">Search Volume</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Higher search volume indicates greater potential reach. We normalize this across all keywords.
              </p>
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="text-foreground font-medium">40%</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
            </div>
            <div className="rounded-lg border border-border bg-secondary/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Target className="h-4 w-4 text-accent" />
                </div>
                <h4 className="font-semibold text-foreground">Competition</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Lower competition means easier ranking opportunities. Inverted for scoring.
              </p>
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="text-foreground font-medium">35%</span>
                </div>
                <Progress value={35} className="h-2" />
              </div>
            </div>
            <div className="rounded-lg border border-border bg-secondary/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-lg bg-chart-3/20 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-chart-3" />
                </div>
                <h4 className="font-semibold text-foreground">Trend & CPC</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Rising trends and CPC value indicate commercial intent and growth potential.
              </p>
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="text-foreground font-medium">25%</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
