import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { CategoryResult } from '../types';
import { motion } from 'motion/react';
import { Target, Zap, TrendingUp } from 'lucide-react';

interface MarketMapProps {
  results: CategoryResult[];
  onSelect?: (id: string) => void;
}

export default function MarketMap({ results, onSelect }: MarketMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || results.length === 0) return;

    const width = 800;
    const height = 500;
    const margin = { top: 40, right: 100, bottom: 60, left: 80 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const x = d3.scaleLinear()
      .domain([0, 100])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height - margin.bottom, margin.top]);

    // Grid lines
    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5).tickSize(-height + margin.top + margin.bottom).tickFormat(() => ""))
      .attr("stroke-opacity", 0.05)
      .attr("stroke", "#fff");

    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickSize(-width + margin.left + margin.right).tickFormat(() => ""))
      .attr("stroke-opacity", 0.05)
      .attr("stroke", "#fff");

    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5))
      .attr("color", "#64748b")
      .style("font-size", "10px");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .attr("color", "#64748b")
      .style("font-size", "10px");

    // Labels
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 15)
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .style("font-size", "11px")
      .style("font-weight", "bold")
      .style("text-transform", "uppercase")
      .style("letter-spacing", "0.1em")
      .text("Competition Score (Lower is Better)");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .style("font-size", "11px")
      .style("font-weight", "bold")
      .style("text-transform", "uppercase")
      .style("letter-spacing", "0.1em")
      .text("Opportunity Score (Higher is Better)");

    // Quadrant Labels
    const quadrants = [
      { x: 25, y: 75, label: "Golden Niche", color: "#10b981" },
      { x: 75, y: 75, label: "High Demand / Saturated", color: "#3b82f6" },
      { x: 25, y: 25, label: "Low Competition / Low Demand", color: "#64748b" },
      { x: 75, y: 25, label: "Red Ocean", color: "#ef4444" }
    ];

    quadrants.forEach(q => {
      svg.append("text")
        .attr("x", x(q.x))
        .attr("y", y(q.y))
        .attr("text-anchor", "middle")
        .attr("fill", q.color)
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style("opacity", 0.3)
        .style("text-transform", "uppercase")
        .text(q.label);
    });

    // Data points
    const nodes = svg.selectAll(".node")
      .data(results)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${x(d.competitionScore)},${y(d.opportunityScore)})`)
      .style("cursor", "pointer")
      .on("click", (event, d) => onSelect?.(d.id));

    nodes.append("circle")
      .attr("r", d => 8 + (d.volumeNumber / 2000))
      .attr("fill", d => {
        if (d.opportunityScore > 70 && d.competitionScore < 40) return "#10b981"; // Emerald
        if (d.opportunityScore > 70) return "#3b82f6"; // Blue
        if (d.competitionScore < 40) return "#6366f1"; // Indigo
        return "#ef4444"; // Red
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("filter", "drop-shadow(0 0 8px rgba(255,255,255,0.2))")
      .style("opacity", 0.8);

    nodes.append("text")
      .attr("dy", -15)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .text(d => d.categoryName.length > 15 ? d.categoryName.substring(0, 15) + "..." : d.categoryName);

  }, [results, onSelect]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-8 mt-12 overflow-hidden relative"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
            <Target size={24} className="text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-display">Visual Strategy Map</h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Niche Opportunity Matrix</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Golden Niche</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">High Demand</span>
          </div>
        </div>
      </div>

      <div className="relative flex justify-center">
        <svg 
          ref={svgRef} 
          width="800" 
          height="500" 
          viewBox="0 0 800 500"
          className="max-w-full h-auto"
        />
      </div>

      <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-4">
        <Zap size={20} className="text-accent shrink-0" />
        <p className="text-sm text-slate-400 leading-relaxed font-light">
          <span className="text-white font-bold">Neural Insight:</span> The top-left quadrant represents the <span className="text-emerald-400 font-bold">Golden Niche</span> zone—high opportunity with low competition. Focus your production here for maximum ROI.
        </p>
      </div>
    </motion.div>
  );
}
