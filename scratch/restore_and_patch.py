import re

# Read current file content
with open("prisma/seed.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Let's find:
# 1. The original target match:
pattern = r"// 5\. TART IA \(individual diagnostic\)\s*await prisma\.activity\.create\(\{\s*data: \{\s*activityType: ActivityType\.INDIVIDUAL,\s*serviceId: sDiagIa\.id,\s*status: 'COMPLETED',\s*operatorId: orgAdn\.id,\s*notes: 'Remise officielle du rapport de diagnostic d\\'[^\']+',\s*beneficiaryId: bLogiTrans\.id,\s*actionId: actTart1.id,\s*outputReal: 'Rapport de ROI IA rapide\.'\s*\}\s*\}\);\s*"

match = re.search(pattern, content)
if not match:
    print("Could not find the original TART IA block.")
    exit(1)

span = match.span()
# content[:span[1]] is the file up to the end of TART IA block.
# Let's find the closing console.log and main() exit in the rest of the file:
tail_index = content.find("console.log('✅ Base de données initialisée")
if tail_index == -1:
    print("Could not find the final console.log statement.")
    exit(1)

# Now, we reconstruct the file:
# Part 1: everything before TART IA end.
# Part 2: everything from console.log to the end of the file.
clean_base = content[:span[1]] + "\n\n" + content[tail_index:]

# Now we insert our new activities using double quotes for strings containing apostrophes:
new_activities_block = """  // ==========================================
  // --- NOUVELLES ACTIVITÉS D'ANIMATION (SoE & SoI) ---
  // ==========================================
  
  // 1. Coaching : Diagnostic Export & FDA (AWEX / PharmaPlus)
  await prisma.activity.create({
    data: {
      activityType: ActivityType.INDIVIDUAL,
      serviceId: sExportCoach.id,
      operatorId: orgAwex.id,
      beneficiaryId: bPharmaPlus.id,
      status: "COMPLETED",
      date: new Date("2026-04-10"),
      title: "Coaching individuel : Diagnostic Export & Conformité FDA",
      notes: "[coaching] Séance individuelle d'évaluation des normes FDA américaines pour PharmaPlus.",
      outputReal: "Feuille de route réglementaire export FDA validée.",
      outcomeReal: "Lancement du dossier d'homologation internationale.",
      impact: "Accès facilité aux marchés nord-américains."
    }
  });

  // 2. Coaching : Cadrage Stratégique IA & Algorithmes de Tri (AdN / Dupont)
  await prisma.activity.create({
    data: {
      activityType: ActivityType.INDIVIDUAL,
      serviceId: sDiagIa.id,
      operatorId: orgAdn.id,
      beneficiaryId: bDupont.id,
      status: "COMPLETED",
      date: new Date("2026-05-12"),
      title: "Coaching individuel : Cadrage Stratégique IA & Algorithmes de Tri",
      notes: "[coaching] Coaching technique individuel pour le déploiement du tri automatisé par vision computer.",
      outputReal: "Spécifications techniques de l'algorithme de computer vision rédigées.",
      outcomeReal: "Validation de la faisabilité sur les lignes de production.",
      impact: "Augmentation de 15% du taux de tri automatique."
    }
  });

  // 3. Atelier : Cybersécurité & Directive NIS2 (MecaTech / LogiTrans + TechConstruct)
  await prisma.activity.create({
    data: {
      activityType: ActivityType.COLLECTIVE,
      serviceId: sCyberCheck.id,
      operatorId: orgMecaTech.id,
      status: "COMPLETED",
      date: new Date("2026-05-20"),
      title: "Atelier : Cybersécurité, NIS2 & Gestion des Risques Industriels",
      notes: "[atelier] Workshop inter-PME sur la conformité NIS2 dans la chaîne de valeur logistique et manufacturière.",
      participantsCount: 18,
      companiesCount: 6,
      satisfactionScore: 4.8,
      leadsCount: 4,
      nextSteps: "Planifier des audits individuels Cyber-Check pour les participants intéressés.",
      companies: { connect: [{ id: bLogiTrans.id }, { id: bTechConstruct.id }] }
    }
  });

  // 4. Webinaire : Opportunités de financement Horizon Europe (BioWin / PharmaPlus)
  await prisma.activity.create({
    data: {
      activityType: ActivityType.COLLECTIVE,
      serviceId: sWorkshopIa.id,
      operatorId: orgBioWin.id,
      status: "COMPLETED",
      date: new Date("2026-06-02"),
      title: "Webinaire : Opportunités de financement Horizon Europe pour les BioTechs",
      notes: "[webinaire] Session d'information sur les appels à projets européens Horizon Europe Cluster 1 (Santé) pour PME.",
      participantsCount: 45,
      companiesCount: 22,
      satisfactionScore: 4.5,
      leadsCount: 8,
      nextSteps: "Envoi des présentations et mise en relation avec le Point de Contact National (PCN).",
      companies: { connect: [{ id: bPharmaPlus.id }] }
    }
  });

  // 5. Groupe de Travail : Interopérabilité des données de santé (AdN / PharmaPlus + Forem)
  await prisma.activity.create({
    data: {
      activityType: ActivityType.COLLECTIVE,
      serviceId: sCoordHub.id,
      operatorId: orgAdn.id,
      status: "IN_PROGRESS",
      date: new Date("2026-06-10"),
      title: "Groupe de travail : Interopérabilité des données de santé",
      notes: "[groupe_de_travail] Premier atelier technique pour définir le standard d'échange de données de santé (HL7/FHIR) en Wallonie.",
      participantsCount: 12,
      companiesCount: 5,
      companies: { connect: [{ id: bPharmaPlus.id }, { id: bForem.id }] }
    }
  });

  // 6. Mission économique : Pavillon Wallon à Hannover Messe (AWEX / H2Energy + TechConstruct)
  await prisma.activity.create({
    data: {
      activityType: ActivityType.COLLECTIVE,
      serviceId: sExportCoach.id,
      operatorId: orgAwex.id,
      status: "PLANNED",
      date: new Date("2026-09-15"),
      title: "Mission économique : Pavillon Wallon à Hannover Messe",
      notes: "[mission_economique] Organisation du pavillon de l'AWEX et de la délégation d'entreprises wallonnes à la foire industrielle de Hanovre.",
      participantsCount: 25,
      companiesCount: 15,
      companies: { connect: [{ id: bH2Energy.id }, { id: bTechConstruct.id }] }
    }
  });

"""

# Re-insert cleanly
split_index = clean_base.find("console.log('✅ Base de données initialisée")
final_patched = clean_base[:split_index] + new_activities_block + clean_base[split_index:]

with open("prisma/seed.ts", "w", encoding="utf-8") as f:
    f.write(final_patched)

print("seed.ts successfully restored and cleanly patched!")
