// src/app/dashboard/page.tsx

import KpiCard from "@/components/KpiCard";
import { kpis } from "@/lib/mock/kpis";

export default function Dashboard() {
  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {kpis.map((kpi) => (
        <KpiCard
          key={kpi.id}
          label={kpi.label}
          value={kpi.value}
          IconName={kpi.icon as any}
        />
      ))}
    </section>
  );
}
