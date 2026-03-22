"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { mockTrendData, mockKeywords } from "@/lib/mock-data"

const trendingKeywords = [
  { keyword: "AI art generation", change: 156, volume: 234000 },
  { keyword: "Midjourney prompts", change: 89, volume: 178000 },
  { keyword: "Stable diffusion", change: 67, volume: 156000 },
  { keyword: "DALL-E 3", change: 45, volume: 98000 },
  { keyword: "Generative AI", change: 34, volume: 87000 },
]

const decliningKeywords = [
  { keyword: "Stock photos free", change: -23, volume: 145000 },
  { keyword: "Clip art", change: -18, volume: 67000 },
  { keyword: "Photo editing software", change: -12, volume: 234000 },
  { keyword: "Vector graphics", change: -8, volume: 89000 },
]

const timeRanges = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 3 Months", value: "3m" },
  { label: "Last 12 Months", value: "12m" },
]

export function TrendAnalysis() {
  const [selectedRange, setSelectedRange] = useState("12m")
  const [selectedKeyword, setSelectedKeyword] = useState("ai generated images")

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Trend Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Track keyword trends over time and identify emerging opportunities
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Keywords Tracked</p>
                <p className="text-2xl font-bold text-foreground mt-1">2,847</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rising Keywords</p>
                <p className="text-2xl font-bold text-foreground mt-1">847</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <ArrowUpRight className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Declining Keywords</p>
                <p className="text-2xl font-bold text-foreground mt-1">124</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <ArrowDownRight className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stable Keywords</p>
                <p className="text-2xl font-bold text-foreground mt-1">1,876</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                <Minus className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Search Volume Trend</CardTitle>
            <CardDescription>
              Keyword: "{selectedKeyword}"
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
              <SelectTrigger className="w-[200px] bg-input border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {mockKeywords.map((k) => (
                  <SelectItem key={k.id} value={k.keyword} className="text-foreground">
                    {k.keyword}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedRange} onValueChange={setSelectedRange}>
              <SelectTrigger className="w-[150px] bg-input border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value} className="text-foreground">
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTrendData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5d75e8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5d75e8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333845" />
                <XAxis
                  dataKey="date"
                  stroke="#a6a6a6"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#a6a6a6"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1c1e26",
                    border: "1px solid #333845",
                    borderRadius: "8px",
                    color: "#fcfcfc",
                  }}
                  formatter={(value: number) => [formatNumber(value), "Volume"]}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#5d75e8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVolume)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Trending Up
            </CardTitle>
            <CardDescription>
              Keywords with the highest growth this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trendingKeywords.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.keyword}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatNumber(item.volume)} searches/mo
                    </p>
                  </div>
                  <Badge className="bg-accent/20 text-accent border-accent/30">
                    +{item.change}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-destructive" />
              Trending Down
            </CardTitle>
            <CardDescription>
              Keywords showing decline in search volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {decliningKeywords.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.keyword}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatNumber(item.volume)} searches/mo
                    </p>
                  </div>
                  <Badge className="bg-destructive/20 text-destructive border-destructive/30">
                    {item.change}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
