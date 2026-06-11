// src/design-system/BaseEntity.ts

export interface EntityRelation {
  sourceId: string | number;
  targetId: string | number;
  targetType: string;
  targetName: string;
  relationType: string;           // ex: "contributesTo", "usesService", "memberOf"
  direction: "incoming" | "outgoing";
}

export interface BaseEntity {
  id: string | number;
  type: string;                    // ex: "Service", "Filiere", "Beneficiary", "Strategy", etc.
  name: string;
  description?: string;
  status?: string;                 // ex: "Published", "Draft", "Active", "Planned"
  tags?: string[];
  owner?: string;                  // Lead organisation / pilot
  createdAt?: string;
  updatedAt?: string;
  relations?: EntityRelation[];
}
