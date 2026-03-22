import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { CategoryResult } from '../types';

interface NeuralMarketMapProps {
  keyword: string;
  results: CategoryResult[];
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: 'root' | 'niche' | 'keyword';
  score?: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string;
  target: string;
  value: number;
}

export const NeuralMarketMap: React.FC<NeuralMarketMapProps> = ({ keyword, results }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || results.length === 0) return;

    const width = 800;
    const height = 400;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    // Prepare data
    const nodes: Node[] = [
      { id: 'root', name: keyword, type: 'root' }
    ];
    const links: Link[] = [];

    results.forEach((res, i) => {
      const nicheId = `niche-${i}`;
      nodes.push({ 
        id: nicheId, 
        name: res.categoryName, 
        type: 'niche', 
        score: res.opportunityScore 
      });
      links.push({ source: 'root', target: nicheId, value: 1 });

      // Add top keywords for each niche
      res.mainKeywords.slice(0, 3).forEach((kw, j) => {
        const kwId = `kw-${i}-${j}`;
        nodes.push({ id: kwId, name: kw, type: 'keyword' });
        links.push({ source: nicheId, target: kwId, value: 0.5 });
      });
    });

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(d => d.value === 1 ? 100 : 50))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1));

    const link = svg.append("g")
      .attr("stroke", "rgba(255,255,255,0.1)")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value) * 2);

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    node.append("circle")
      .attr("r", d => d.type === 'root' ? 12 : d.type === 'niche' ? 8 : 4)
      .attr("fill", d => d.type === 'root' ? "#fff" : d.type === 'niche' ? "#10b981" : "#3b82f6")
      .attr("filter", "blur(1px)");

    node.append("text")
      .attr("x", 12)
      .attr("y", 4)
      .text(d => d.name)
      .attr("fill", "rgba(255,255,255,0.7)")
      .attr("font-size", d => d.type === 'root' ? "14px" : "10px")
      .attr("font-family", "monospace")
      .attr("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, [keyword, results]);

  return (
    <div className="w-full h-[400px] bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Neural Market Topology</h4>
        <p className="text-[10px] text-emerald-400/60 font-mono">Relational Intelligence Map</p>
      </div>
      <svg ref={svgRef} className="w-full h-full cursor-move" />
    </div>
  );
};
