import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Eye,
  Share2,
  Settings,
} from "lucide-react";

interface FlowVisualizationProps {
  data: any;
  width?: number;
  height?: number;
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: string;
  riskLevel: string;
  value: number;
  transactionCount: number;
  metadata: any;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  value: number;
  frequency: number;
  riskScore: number;
  type: string;
}

export default function FlowVisualization({
  data,
  width = 800,
  height = 600,
}: FlowVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    const actualWidth = isFullscreen ? window.innerWidth - 100 : width;
    const actualHeight = isFullscreen ? window.innerHeight - 200 : height;

    svg
      .attr("width", actualWidth)
      .attr("height", actualHeight)
      .attr("viewBox", `0 0 ${actualWidth} ${actualHeight}`);

    // Create zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);

    // Create container for all elements
    const container = svg.append("g");

    // Create arrow markers for links
    svg
      .append("defs")
      .selectAll("marker")
      .data(["direct", "indirect", "suspicious"])
      .enter()
      .append("marker")
      .attr("id", (d) => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", (d) => data.config.colorScheme.links[d]);

    // Create simulation
    const simulation = d3
      .forceSimulation<Node>(data.nodes)
      .force(
        "link",
        d3
          .forceLink<Node, Link>(data.links)
          .id((d) => d.id)
          .distance(data.config.linkDistance),
      )
      .force("charge", d3.forceManyBody().strength(data.config.chargeStrength))
      .force("center", d3.forceCenter(actualWidth / 2, actualHeight / 2))
      .force(
        "collision",
        d3.forceCollide().radius((d) => getNodeRadius(d) + 5),
      );

    // Create links
    const link = container
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("stroke", (d) => data.config.colorScheme.links[d.type])
      .attr("stroke-width", (d) => Math.max(1, Math.sqrt(d.value / 100000)))
      .attr("stroke-opacity", 0.6)
      .attr("marker-end", (d) => `url(#arrow-${d.type})`);

    // Create nodes
    const node = container
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("r", getNodeRadius)
      .attr("fill", (d) => data.config.colorScheme.nodes[d.type])
      .attr("stroke", (d) => data.config.colorScheme.risk[d.riskLevel])
      .attr("stroke-width", 3)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        setSelectedNode(d);
        // Highlight connected nodes
        highlightConnectedNodes(d);
      })
      .on("mouseover", (event, d) => {
        // Show tooltip
        showTooltip(event, d);
      })
      .on("mouseout", hideTooltip)
      .call(
        d3
          .drag<SVGCircleElement, Node>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended),
      );

    // Create labels
    const label = container
      .append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(data.nodes)
      .enter()
      .append("text")
      .text((d) => d.label)
      .attr("font-size", 10)
      .attr("font-family", "Poppins, sans-serif")
      .attr("dx", (d) => getNodeRadius(d) + 5)
      .attr("dy", 4)
      .style("pointer-events", "none");

    // Create tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "flow-tooltip")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // Simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as Node).x!)
        .attr("y1", (d) => (d.source as Node).y!)
        .attr("x2", (d) => (d.target as Node).x!)
        .attr("y2", (d) => (d.target as Node).y!);

      node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);

      label.attr("x", (d) => d.x!).attr("y", (d) => d.y!);
    });

    // Helper functions
    function getNodeRadius(d: Node): number {
      const { min, max } = data.config.nodeRadius;
      const normalizedValue = Math.sqrt(d.value / 10000);
      return Math.max(min, Math.min(max, normalizedValue));
    }

    function dragstarted(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    function highlightConnectedNodes(selectedNode: Node) {
      // Reset all nodes
      node.style("opacity", 0.3);
      link.style("opacity", 0.1);
      label.style("opacity", 0.3);

      // Highlight selected node
      node.filter((d) => d.id === selectedNode.id).style("opacity", 1);
      label.filter((d) => d.id === selectedNode.id).style("opacity", 1);

      // Highlight connected nodes and links
      const connectedNodeIds = new Set<string>();
      link
        .filter((d) => {
          const sourceId =
            typeof d.source === "string" ? d.source : d.source.id;
          const targetId =
            typeof d.target === "string" ? d.target : d.target.id;

          if (sourceId === selectedNode.id || targetId === selectedNode.id) {
            connectedNodeIds.add(sourceId);
            connectedNodeIds.add(targetId);
            return true;
          }
          return false;
        })
        .style("opacity", 0.8);

      node.filter((d) => connectedNodeIds.has(d.id)).style("opacity", 1);
      label.filter((d) => connectedNodeIds.has(d.id)).style("opacity", 1);
    }

    function showTooltip(event: any, d: Node) {
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip
        .html(
          `
        <strong>${d.label}</strong><br/>
        Type: ${d.type}<br/>
        Risk: ${d.riskLevel}<br/>
        Transactions: ${d.transactionCount.toLocaleString()}<br/>
        Value: $${d.value.toLocaleString()}
      `,
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 10 + "px");
    }

    function hideTooltip() {
      tooltip.transition().duration(200).style("opacity", 0);
    }

    // Cleanup function
    return () => {
      tooltip.remove();
    };
  }, [data, width, height, isFullscreen]);

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current);
    svg
      .transition()
      .call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1.5);
  };

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current);
    svg
      .transition()
      .call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1 / 1.5);
  };

  const handleReset = () => {
    const svg = d3.select(svgRef.current);
    svg
      .transition()
      .call(
        d3.zoom<SVGSVGElement, unknown>().transform as any,
        d3.zoomIdentity,
      );
    setSelectedNode(null);

    // Reset all highlighting
    svg.selectAll("circle").style("opacity", 1);
    svg.selectAll("line").style("opacity", 0.6);
    svg.selectAll("text").style("opacity", 1);
  };

  const handleDownload = () => {
    const svg = svgRef.current;
    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `flow-visualization-${Date.now()}.svg`;
    link.click();

    URL.revokeObjectURL(url);
  };

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fund Flow Visualization</CardTitle>
          <CardDescription>No data available for visualization</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className={isFullscreen ? "fixed inset-0 z-50 bg-background p-4" : ""}>
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-brand-light" />
                <span>Fund Flow Visualization</span>
              </CardTitle>
              <CardDescription>
                Interactive network analysis for {data.metadata.targetAddress}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {data.metadata.totalNodes} nodes
              </Badge>
              <Badge variant="outline" className="text-xs">
                {data.metadata.totalLinks} links
              </Badge>
              <Badge variant="outline" className="text-xs">
                Zoom: {Math.round(zoomLevel * 100)}%
              </Badge>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex">
            {/* Main visualization */}
            <div className="flex-1">
              <svg
                ref={svgRef}
                className="border border-border rounded-lg"
                style={{
                  background:
                    "linear-gradient(45deg, #f8f9fa 25%, transparent 25%), linear-gradient(-45deg, #f8f9fa 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8f9fa 75%), linear-gradient(-45deg, transparent 75%, #f8f9fa 75%)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                }}
              />
            </div>

            {/* Side panel for selected node */}
            {selectedNode && (
              <div className="w-80 border-l border-border p-4 bg-card">
                <h3 className="font-medium text-lg mb-4">Node Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Address
                    </label>
                    <p className="font-mono text-xs break-all">
                      {selectedNode.metadata.address}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Type
                    </label>
                    <Badge className="ml-2">{selectedNode.type}</Badge>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Risk Level
                    </label>
                    <Badge
                      className={`ml-2 ${
                        selectedNode.riskLevel === "critical"
                          ? "bg-risk-red/10 text-risk-red border-risk-red/20"
                          : selectedNode.riskLevel === "high"
                            ? "bg-warning-amber/10 text-warning-amber border-warning-amber/20"
                            : selectedNode.riskLevel === "medium"
                              ? "bg-brand-light/10 text-brand-light border-brand-light/20"
                              : "bg-success-green/10 text-success-green border-success-green/20"
                      }`}
                    >
                      {selectedNode.riskLevel}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Transaction Count
                    </label>
                    <p>{selectedNode.transactionCount.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Total Value
                    </label>
                    <p>${selectedNode.value.toLocaleString()}</p>
                  </div>
                  {selectedNode.metadata.isExchange && (
                    <Badge variant="outline" className="text-xs">
                      Exchange
                    </Badge>
                  )}
                  {selectedNode.metadata.isMixer && (
                    <Badge variant="outline" className="text-xs">
                      Mixer
                    </Badge>
                  )}
                  {selectedNode.metadata.isContract && (
                    <Badge variant="outline" className="text-xs">
                      Contract
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
