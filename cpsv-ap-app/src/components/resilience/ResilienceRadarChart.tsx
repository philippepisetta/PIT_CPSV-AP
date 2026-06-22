// cpsv-ap-app/src/components/resilience/ResilienceRadarChart.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface ResilienceRadarChartProps {
  exposure: number;
  sensitivity: number;
  vulnerability: number;
  absorptionCapacity: number;
  adaptiveCapacity: number;
  recoveryCapacity: number;
}

const DIMENSIONS = [
  { key: "exposure", label: "Exposition", desc: "Sensibilité géographique et sectorielle face aux menaces." },
  { key: "sensitivity", label: "Sensibilité", desc: "Fragilité intrinsèque du tissu économique." },
  { key: "vulnerability", label: "Vulnérabilité", desc: "Niveau de risque global net (Exposition × Sensibilité)." },
  { key: "absorptionCapacity", label: "Absorption", desc: "Capacité à amortir le choc initial (trésorerie, stocks)." },
  { key: "adaptiveCapacity", label: "Adaptation", desc: "Flexibilité opérationnelle (alternatives, réseaux)." },
  { key: "recoveryCapacity", label: "Rebond", desc: "Capacité à se réorganiser et à se relancer." }
];

export default function ResilienceRadarChart({
  exposure,
  sensitivity,
  vulnerability,
  absorptionCapacity,
  adaptiveCapacity,
  recoveryCapacity
}: ResilienceRadarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const values: Record<string, number> = {
    exposure,
    sensitivity,
    vulnerability,
    absorptionCapacity,
    adaptiveCapacity,
    recoveryCapacity
  };

  const width = 340;
  const height = 300;
  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = 100;

  // Compute angles for 6 axes starting from top
  const getCoordinates = (index: number, val: number) => {
    const angle = (index * 2 * Math.PI) / 6 - Math.PI / 2;
    const r = (val / 10) * maxRadius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    };
  };

  // Generate grid lines (circles/polygons at 2, 4, 6, 8, 10 levels)
  const gridLevels = [2, 4, 6, 8, 10];
  const gridPoints = gridLevels.map(level => {
    return Array.from({ length: 6 }).map((_, i) => {
      const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
      const r = (level / 10) * maxRadius;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(" ");
  });

  // Points for the actual data polygon
  const dataPoints = DIMENSIONS.map((d, i) => {
    const val = values[d.key] || 5;
    const coords = getCoordinates(i, val);
    return `${coords.x},${coords.y}`;
  }).join(" ");

  return (
    <div className="flex flex-col lg:flex-row items-center gap-6 p-4 bg-glass border border-muted/15 rounded-2xl relative overflow-hidden">
      <div className="relative">
        <svg width={width} height={height} className="overflow-visible">
          {/* Grids */}
          {gridPoints.map((points, idx) => (
            <polygon
              key={idx}
              points={points}
              fill="none"
              className="stroke-muted/20"
              strokeWidth="1"
            />
          ))}

          {/* Grid levels texts */}
          {gridLevels.map((level, idx) => {
            const r = (level / 10) * maxRadius;
            return (
              <text
                key={idx}
                x={cx}
                y={cy - r - 4}
                className="text-[8px] font-black text-muted text-center fill-muted/50"
                textAnchor="middle"
              >
                {level}
              </text>
            );
          })}

          {/* Axis lines */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
            const targetX = cx + maxRadius * Math.cos(angle);
            const targetY = cy + maxRadius * Math.sin(angle);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={targetX}
                y2={targetY}
                className="stroke-muted/30"
                strokeWidth="1.2"
                strokeDasharray="2,2"
              />
            );
          })}

          {/* Axis Labels */}
          {DIMENSIONS.map((d, i) => {
            const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
            const r = maxRadius + 22;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            const isTopOrBottom = i === 0 || i === 3;
            const isLeft = i === 4 || i === 5;
            
            return (
              <text
                key={i}
                x={x}
                y={y + 3}
                className={`text-[10px] font-black tracking-wide fill-text ${
                  hoveredIndex === i ? "fill-teal-600 font-extrabold" : "fill-text"
                }`}
                textAnchor={isTopOrBottom ? "middle" : isLeft ? "end" : "start"}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: "pointer" }}
              >
                {d.label} ({values[d.key].toFixed(1)})
              </text>
            );
          })}

          {/* Data Polygon */}
          <polygon
            points={dataPoints}
            fill="url(#radarGradient)"
            className="stroke-teal-600 fill-teal-500/25 transition-all duration-300"
            strokeWidth="2.5"
          />

          {/* Data Points */}
          {DIMENSIONS.map((d, i) => {
            const val = values[d.key] || 5;
            const coords = getCoordinates(i, val);
            const isCap = i >= 3;
            return (
              <circle
                key={i}
                cx={coords.x}
                cy={coords.y}
                r={hoveredIndex === i ? 7 : 4.5}
                className={`transition-all duration-150 cursor-pointer ${
                  isCap 
                    ? "fill-emerald-500 stroke-white border" 
                    : "fill-rose-500 stroke-white border"
                }`}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}

          {/* Definitions */}
          <defs>
            <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0.3" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Description Panel on Hover */}
      <div className="flex-1 w-full flex flex-col justify-center min-h-[140px] px-2">
        <h4 className="text-xs font-black uppercase text-muted tracking-wider mb-2">
          Analyse des Dimensions (Cadre OCDE)
        </h4>
        <div className="p-3 rounded-xl bg-muted/5 border border-muted/10 transition-all duration-200">
          {hoveredIndex !== null ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${hoveredIndex >= 3 ? "bg-emerald-500" : "bg-rose-500"}`} />
                <span className="text-xs font-black text-text">
                  {DIMENSIONS[hoveredIndex].label}
                </span>
                <span className="text-xs font-black text-teal-655 ml-auto">
                  Score : {values[DIMENSIONS[hoveredIndex].key].toFixed(1)} / 10
                </span>
              </div>
              <p className="text-[10px] text-muted font-semibold leading-normal mt-1">
                {DIMENSIONS[hoveredIndex].desc}
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-[10px] text-muted font-semibold italic">
                Survolez une dimension ou un point du graphique pour afficher les détails méthodologiques.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
