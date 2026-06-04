// src/components/encode/steps/ImpactsStep.tsx
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";

export default function ImpactsStep() {
  const { control, register, watch } = useFormContext();

  // Watch values for real-time radar rendering
  const jobs = watch("impacts.jobsCreated") || 0;
  const carbon = watch("impacts.carbonImpact") || 50;
  const sovereignty = watch("impacts.sovereignty") || 50;
  const resilience = watch("impacts.resilience") || 50;
  const competitiveness = watch("impacts.competitiveness") || 50;

  // Radar math
  const center = 100;
  const radius = 70;
  const getCoordinates = (value: number, angle: number) => {
    // scale value from 0-100 to 0-radius
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle - Math.PI / 2);
    const y = center + r * Math.sin(angle - Math.PI / 2);
    return { x, y };
  };

  const points = [
    getCoordinates(carbon, 0),
    getCoordinates(sovereignty, (2 * Math.PI) / 5),
    getCoordinates(resilience, (4 * Math.PI) / 5),
    getCoordinates(competitiveness, (6 * Math.PI) / 5),
    getCoordinates(Math.min(jobs * 2, 100), (8 * Math.PI) / 5), // Jobs scaled
  ];

  const polyPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Grid coordinates (50% and 100%)
  const grid50 = Array.from({ length: 5 }).map((_, i) => getCoordinates(50, (i * 2 * Math.PI) / 5));
  const grid100 = Array.from({ length: 5 }).map((_, i) => getCoordinates(100, (i * 2 * Math.PI) / 5));

  const poly50 = grid50.map((p) => `${p.x},${p.y}`).join(" ");
  const poly100 = grid100.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <section className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b pb-2">
          Impacts Territoriaux & Stratégie S3
        </h3>
        <p className="text-sm text-gray-500">
          Définissez la contribution de ce service public aux priorités stratégiques régionales.
        </p>

        <div className="flex flex-col lg:flex-row gap-6 pt-2">
          {/* Form controls */}
          <div className="flex-1 space-y-4">
            {/* Jobs */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-500 uppercase tracking-wider">
                Emplois directs ou indirects créés (Est. annuel)
              </label>
              <Input
                type="number"
                {...register("impacts.jobsCreated", { valueAsNumber: true })}
                placeholder="ex. 45"
                min={0}
              />
            </div>

            {/* Carbon score */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-gray-500 uppercase tracking-wider">
                <span>Impact Carbone (Index 0-100)</span>
                <span className="text-primary-500 font-bold">{carbon}</span>
              </div>
              <Controller
                name="impacts.carbonImpact"
                control={control}
                defaultValue={50}
                render={({ field }) => (
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={field.value ?? 50}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                )}
              />
              <span className="text-[10px] text-gray-400">0 = Émissions intenses, 100 = Décarbonation totale</span>
            </div>

            {/* Sovereignty score */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-gray-500 uppercase tracking-wider">
                <span>Souveraineté Numérique (Index 0-100)</span>
                <span className="text-blue-500 font-bold">{sovereignty}</span>
              </div>
              <Controller
                name="impacts.sovereignty"
                control={control}
                defaultValue={50}
                render={({ field }) => (
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={field.value ?? 50}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                )}
              />
              <span className="text-[10px] text-gray-400">Autonomie technologique territoriale et sécurité locale</span>
            </div>

            {/* Resilience score */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-gray-500 uppercase tracking-wider">
                <span>Résilience Territoriale (Index 0-100)</span>
                <span className="text-green-500 font-bold">{resilience}</span>
              </div>
              <Controller
                name="impacts.resilience"
                control={control}
                defaultValue={50}
                render={({ field }) => (
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={field.value ?? 50}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                )}
              />
            </div>

            {/* Competitiveness score */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-gray-500 uppercase tracking-wider">
                <span>Compétitivité Industrielle (S3) (Index 0-100)</span>
                <span className="text-purple-500 font-bold">{competitiveness}</span>
              </div>
              <Controller
                name="impacts.competitiveness"
                control={control}
                defaultValue={50}
                render={({ field }) => (
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={field.value ?? 50}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                )}
              />
            </div>
          </div>

          {/* Real-time interactive radar SVG chart */}
          <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              Radar d’impact territorial
            </span>
            <svg width="200" height="200" className="overflow-visible">
              {/* Outer grid */}
              <polygon points={poly100} className="stroke-gray-300 dark:stroke-gray-700 fill-none" strokeWidth="1" />
              {/* Mid grid */}
              <polygon points={poly50} className="stroke-gray-200 dark:stroke-gray-800 fill-none" strokeWidth="1" strokeDasharray="2" />

              {/* Grid spokes */}
              {grid100.map((p, idx) => (
                <line
                  key={idx}
                  x1={center}
                  y1={center}
                  x2={p.x}
                  y2={p.y}
                  className="stroke-gray-200 dark:stroke-gray-800"
                  strokeWidth="1"
                />
              ))}

              {/* Filled polygon for actual values */}
              <polygon
                points={polyPoints}
                fill="none"
                stroke="#0f766e"
                strokeWidth="2.5"
              />

              {/* Data points */}
              {points.map((p, idx) => (
                <circle
                  key={idx}
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  className="fill-white dark:fill-gray-900"
                  stroke="#0f766e"
                  strokeWidth="2"
                />
              ))}

              {/* Axis labels */}
              <text x={center} y={center - radius - 8} textAnchor="middle" className="text-[9px] font-bold fill-gray-500">Carbone</text>
              <text x={grid100[1].x + 12} y={grid100[1].y + 4} textAnchor="start" className="text-[9px] font-bold fill-gray-500">Souveraineté</text>
              <text x={grid100[2].x + 8} y={grid100[2].y + 14} textAnchor="middle" className="text-[9px] font-bold fill-gray-500">Résilience</text>
              <text x={grid100[3].x - 8} y={grid100[3].y + 14} textAnchor="middle" className="text-[9px] font-bold fill-gray-500">Compétitivité</text>
              <text x={grid100[4].x - 12} y={grid100[4].y + 4} textAnchor="end" className="text-[9px] font-bold fill-gray-500">Emploi</text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
