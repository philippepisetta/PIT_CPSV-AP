// prisma/seed-ecosystem.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du peuplement du Ecosystem Workspace Seed...');

  // 1. Nettoyage de la base de données
  console.log('🧹 Nettoyage des anciennes données Ecosystem Workspace...');
  await prisma.relationship.deleteMany({});
  await prisma.consortiumMember.deleteMany({});
  await prisma.consortium.deleteMany({});
  await prisma.collaboration.deleteMany({});
  await prisma.memberOpportunity.deleteMany({});
  await prisma.memberProject.deleteMany({});
  await prisma.memberService.deleteMany({});
  await prisma.memberParticipation.deleteMany({});
  await prisma.opportunityCommunity.deleteMany({});
  await prisma.eventCommunity.deleteMany({});
  await prisma.projectCommunity.deleteMany({});
  await prisma.communityMembership.deleteMany({});
  await prisma.journeyProgress.deleteMany({});
  await prisma.journeyInstance.deleteMany({});
  await prisma.journeyStage.deleteMany({});
  await prisma.journeyTemplate.deleteMany({});
  await prisma.fundingAward.deleteMany({});
  await prisma.fundingApplication.deleteMany({});
  await prisma.fundingCall.deleteMany({});
  await prisma.fundingProgram.deleteMany({});
  await prisma.strategicContribution.deleteMany({});
  await prisma.interventionNode.deleteMany({});
  await prisma.interventionFramework.deleteMany({});
  await prisma.portfolioItem.deleteMany({});
  await prisma.portfolio.deleteMany({});
  await prisma.roadmapObjective.deleteMany({});
  await prisma.roadmap.deleteMany({});
  await prisma.strategicTheme.deleteMany({});
  await prisma.mission.deleteMany({});
  await prisma.valueChainSegment.deleteMany({});
  await prisma.filiere.deleteMany({});
  await prisma.member.deleteMany({});
  await prisma.community.deleteMany({});
  await prisma.opportunity.deleteMany({});

  // 2. Création des Cadres Stratégiques (StrategicFrameworks / InterventionFrameworks)
  console.log('🏆 Création des Cadres Stratégiques...');
  const frameworks = [
    { code: 'S3', name: 'Smart Specialisation Strategy (S3) Wallonie' },
    { code: 'DIGITAL_WALLONIA', name: 'Digital Wallonia' },
    { code: 'CIRCULAR_WALLONIA', name: 'Circular Wallonia' },
    { code: 'PLAN_DE_RELANCE', name: 'Plan de Relance de la Wallonie (PRW)' },
    { code: 'GREEN_DEAL', name: 'Green Deal Européen' },
    { code: 'DIGITAL_EUROPE', name: 'Digital Europe' }
  ];

  const fwInstances: Record<string, any> = {};
  for (const fw of frameworks) {
    fwInstances[fw.code] = await prisma.interventionFramework.create({
      data: {
        name: fw.name,
        description: `Cadre stratégique pour aligner et évaluer les contributions de l'innovation wallonne : ${fw.name}`
      }
    });
  }

  // 3. Création des Écosystèmes Régionaux de base
  console.log('🌐 Récupération/Création des Écosystèmes...');
  let ecoBioWin = await prisma.ecosystem.findFirst({ where: { name: 'BioWin' } });
  if (!ecoBioWin) {
    ecoBioWin = await prisma.ecosystem.create({ data: { name: 'BioWin', territory: 'Wallonie' } });
  }
  let ecoLogistics = await prisma.ecosystem.findFirst({ where: { name: 'Logistics in Wallonia' } });
  if (!ecoLogistics) {
    ecoLogistics = await prisma.ecosystem.create({ data: { name: 'Logistics in Wallonia', territory: 'Wallonie' } });
  }
  let ecoGreenWin = await prisma.ecosystem.findFirst({ where: { name: 'GreenWin' } });
  if (!ecoGreenWin) {
    ecoGreenWin = await prisma.ecosystem.create({ data: { name: 'GreenWin', territory: 'Wallonie' } });
  }
  let ecoMecaTech = await prisma.ecosystem.findFirst({ where: { name: 'MecaTech' } });
  if (!ecoMecaTech) {
    ecoMecaTech = await prisma.ecosystem.create({ data: { name: 'MecaTech', territory: 'Wallonie' } });
  }
  let ecoWagralim = await prisma.ecosystem.findFirst({ where: { name: 'Wagralim' } });
  if (!ecoWagralim) {
    ecoWagralim = await prisma.ecosystem.create({ data: { name: 'Wagralim', territory: 'Wallonie' } });
  }

  // 4. Création des Filières (Sectors)
  console.log('🏭 Création des Filières...');
  const filieres = [
    { name: 'Santé', ecoId: ecoBioWin.id },
    { name: 'Mobilité', ecoId: ecoLogistics.id },
    { name: 'Chimie & Matériaux', ecoId: ecoGreenWin.id },
    { name: 'Industrie 5.0', ecoId: ecoMecaTech.id },
    { name: 'Agroalimentaire', ecoId: ecoWagralim.id }
  ];

  const filiereInstances: Record<string, any> = {};
  for (const f of filieres) {
    filiereInstances[f.name] = await prisma.filiere.create({
      data: {
        name: f.name,
        description: `Filière d'activité régionale pour l'écosystème : ${f.name}`,
        ecosystemId: f.ecoId
      }
    });
  }

  // 5. Création des Chaînes de Valeur
  console.log('🔗 Création des Chaînes de Valeur...');
  const valueChains = [
    { name: 'Santé Numérique (e-Santé)', filiereName: 'Santé' },
    { name: 'Smart Mobility', filiereName: 'Mobilité' },
    { name: 'Plastiques Circulaires', filiereName: 'Chimie & Matériaux' },
    { name: 'Hydrogène Vert', filiereName: 'Industrie 5.0' },
    { name: 'AgriFood (Transition Alimentaire)', filiereName: 'Agroalimentaire' }
  ];

  const vcInstances: Record<string, any> = {};
  for (const vc of valueChains) {
    const filiere = filiereInstances[vc.filiereName];
    vcInstances[vc.name] = await prisma.valueChain.create({
      data: {
        name: vc.name,
        description: `Chaîne de valeur structurante : ${vc.name}`,
        filiereId: filiere.id
      }
    });
  }

  // 6. Création des Maillons (ValueChainSegments)
  console.log('⚙️ Création des Maillons de Chaîne de Valeur...');
  const segments = [
    // Santé Numérique
    { name: 'Recherche & Dév.', vcName: 'Santé Numérique (e-Santé)' },
    { name: 'Gestion des Données', vcName: 'Santé Numérique (e-Santé)' },
    { name: 'Intelligence Artificielle', vcName: 'Santé Numérique (e-Santé)' },
    { name: 'Validation Clinique', vcName: 'Santé Numérique (e-Santé)' },
    { name: 'Industrialisation', vcName: 'Santé Numérique (e-Santé)' },
    
    // Smart Mobility
    { name: 'Conception Systèmes', vcName: 'Smart Mobility' },
    { name: 'Télématique & IoT', vcName: 'Smart Mobility' },
    { name: 'Algorithmes de Routage', vcName: 'Smart Mobility' },
    { name: 'Distribution & Logistique', vcName: 'Smart Mobility' },
    { name: 'Usage & Fret Vert', vcName: 'Smart Mobility' },
    
    // Plastiques Circulaires
    { name: 'Conception Éco-design', vcName: 'Plastiques Circulaires' },
    { name: 'Production emballages', vcName: 'Plastiques Circulaires' },
    { name: 'Collecte & Tri', vcName: 'Plastiques Circulaires' },
    { name: 'Recyclage & Valorisation', vcName: 'Plastiques Circulaires' },
    { name: 'Réintégration Matière', vcName: 'Plastiques Circulaires' },
    
    // Hydrogène
    { name: 'Production Hydrogène', vcName: 'Hydrogène Vert' },
    { name: 'Stockage Haute Pression', vcName: 'Hydrogène Vert' },
    { name: 'Transport Hydrogène', vcName: 'Hydrogène Vert' },
    { name: 'Distribution locale', vcName: 'Hydrogène Vert' },
    { name: 'Usage Sidérurgique', vcName: 'Hydrogène Vert' },
    
    // AgriFood
    { name: 'Recherche Agronomique', vcName: 'AgriFood (Transition Alimentaire)' },
    { name: 'Production agricole', vcName: 'AgriFood (Transition Alimentaire)' },
    { name: 'Transformation saine', vcName: 'AgriFood (Transition Alimentaire)' },
    { name: 'Conditionnement durable', vcName: 'AgriFood (Transition Alimentaire)' },
    { name: 'Distribution alimentaire', vcName: 'AgriFood (Transition Alimentaire)' }
  ];

  const segInstances: Record<string, any> = {};
  for (const s of segments) {
    const vc = vcInstances[s.vcName];
    segInstances[s.name] = await prisma.valueChainSegment.create({
      data: {
        name: s.name,
        description: `Maillon opérationnel : ${s.name}`,
        valueChainId: vc.id
      }
    });
  }

  // Modéliser les relations de segments non linéaires (ex: Réintégration matière boucle vers Éco-design)
  await prisma.valueChainSegment.update({
    where: { id: segInstances['Réintégration Matière'].id },
    data: {
      relatedTo: { connect: [{ id: segInstances['Conception Éco-design'].id }] }
    }
  });
  
  // Validation IA boucle vers R&D en Santé
  await prisma.valueChainSegment.update({
    where: { id: segInstances['Validation Clinique'].id },
    data: {
      relatedTo: { connect: [{ id: segInstances['Recherche & Dév.'].id }] }
    }
  });

  // 7. Création des 10 Communautés
  console.log('💬 Création des 10 Communautés...');
  const communityNames = [
    { name: 'IA Santé', code: 'COMM-IA-SANTE' },
    { name: 'Hydrogène', code: 'COMM-HYDROGENE' },
    { name: 'Cyber PME', code: 'COMM-CYBER-PME' },
    { name: 'Construction Durable', code: 'COMM-CONSTRUCTION' },
    { name: 'Industrie 5.0', code: 'COMM-INDUSTRIE' },
    { name: 'AgriTech', code: 'COMM-AGRITECH' },
    { name: 'Circularité', code: 'COMM-CIRCULARITE' },
    { name: 'Data Space', code: 'COMM-DATASPACE' },
    { name: 'Export', code: 'COMM-EXPORT' },
    { name: 'Smart Mobility', code: 'COMM-SMARTMOBILITY' }
  ];

  const commInstances: Record<string, any> = {};
  for (const c of communityNames) {
    commInstances[c.name] = await prisma.community.create({
      data: {
        name: c.name,
        code: c.code,
        description: `Espace d'animation et de collaboration thématique : ${c.name}`
      }
    });
  }

  // 8. Création des 50 Membres
  console.log('👥 Création des 50 Membres...');
  const memberList = [
    { name: 'MedTech Namur', type: 'Entreprise', size: 'Startup', location: 'Namur', nace: '21.20', comp: ['IA', 'Imagerie', 'Biotech'], chall: ['Certification MDR', 'Sécurité des données'] },
    { name: 'LogiTrans', type: 'Entreprise', size: 'PME', location: 'Charleroi', nace: '49.41', comp: ['Transport routier', 'Distribution'], chall: ['Optimisation carburant', 'NIS2'] },
    { name: 'BioPlast SA', type: 'Entreprise', size: 'PME', location: 'Liège', nace: '38.32', comp: ['Polymères', 'Eco-design'], chall: ['Réduction déchets', 'Substituts plastiques'] },
    { name: 'HydroGreen', type: 'Entreprise', size: 'Grande Entreprise', location: 'Seraing', nace: '35.21', comp: ['Électrolyse', 'Métallurgie'], chall: ['Stockage haute pression', 'Sécurité OT'] },
    { name: 'UCLouvain', type: 'Université', size: null, location: 'Louvain-la-Neuve', nace: '85.42', comp: ['Deep Learning', 'Computer Vision', 'R&D'], chall: ['Financements recherche'] },
    { name: 'CHU Liège', type: 'Institution publique', size: null, location: 'Liège', nace: '86.10', comp: ['Clinique', 'Imagerie Médicale'], chall: ['Gestion de données massives'] },
    { name: 'CETIC', type: 'Centre de recherche', size: null, location: 'Charleroi', nace: '72.19', comp: ['Cybersécurité', 'Intelligence Artificielle', 'IoT'], chall: ['Recrutement experts'] },
    { name: 'Sirris', type: 'Centre de recherche', size: null, location: 'Liège', nace: '72.19', comp: ['Matériaux', 'Usinage précision', 'Eco-design'], chall: ['Investissement équipement'] },
    { name: 'SmartFleet', type: 'Entreprise', size: 'PME', location: 'Mons', nace: '62.01', comp: ['IoT', 'Télématique', 'Cloud'], chall: ['Internationalisation'] },
    { name: 'DataMove', type: 'Entreprise', size: 'Startup', location: 'Nivelles', nace: '62.01', comp: ['Algorithmes', 'Routage', 'Data Science'], chall: ['Accès marché'] },
    { name: 'AgriFood Solutions', type: 'Entreprise', size: 'PME', location: 'Gembloux', nace: '10.89', comp: ['Protéines végétales', 'Formulation saine'], chall: ['Approvisionnement local'] },
    { name: 'Gembloux Agro-Bio Tech', type: 'Université', size: null, location: 'Gembloux', nace: '85.42', comp: ['Agronomie', 'Nutrition', 'Bio-ingénierie'], chall: ['Valorisation R&D'] }
  ];

  // Compléter pour arriver à 50 membres
  for (let i = 13; i <= 50; i++) {
    const locations = ['Liège', 'Namur', 'Charleroi', 'Mons', 'Wavre', 'Tournai', 'Arlon'];
    const types = ['Entreprise', 'Expert', 'Association', 'Centre de recherche'];
    const sizes = ['TPE', 'PME', 'Grande Entreprise'];
    
    memberList.push({
      name: `Acteur Wallon Tech ${i}`,
      type: types[i % types.length],
      size: types[i % types.length] === 'Entreprise' ? sizes[i % sizes.length] : null,
      location: locations[i % locations.length],
      nace: `62.0${i % 10}`,
      comp: [`Compétence A${i}`, `Compétence B${i}`],
      chall: [`Défi X${i}`]
    });
  }

  const memberInstances: Record<string, any> = {};
  for (const m of memberList) {
    memberInstances[m.name] = await prisma.member.create({
      data: {
        name: m.name,
        type: m.type,
        size: m.size,
        location: m.location,
        nace: m.nace,
        competencies: m.comp,
        digitalMaturity: 1 + (m.name.charCodeAt(0) % 4),
        iaMaturity: 1 + (m.name.charCodeAt(1) % 4),
        cyberMaturity: 1 + (m.name.charCodeAt(2) % 4)
      }
    });
  }

  // 9. Community Memberships
  console.log('🤝 Inscription des Membres aux Communautés...');
  // BioWin / IA Santé
  await prisma.communityMembership.create({ data: { memberId: memberInstances['MedTech Namur'].id, communityId: commInstances['IA Santé'].id, role: 'Membre' } });
  await prisma.communityMembership.create({ data: { memberId: memberInstances['UCLouvain'].id, communityId: commInstances['IA Santé'].id, role: 'Expert' } });
  await prisma.communityMembership.create({ data: { memberId: memberInstances['CHU Liège'].id, communityId: commInstances['IA Santé'].id, role: 'Coordinateur' } });
  
  // Hydrogène / GreenWin / MecaTech
  await prisma.communityMembership.create({ data: { memberId: memberInstances['HydroGreen'].id, communityId: commInstances['Hydrogène'].id, role: 'Coordinateur' } });
  await prisma.communityMembership.create({ data: { memberId: memberInstances['Sirris'].id, communityId: commInstances['Hydrogène'].id, role: 'Expert' } });
  
  // Smart Mobility / Logistics
  await prisma.communityMembership.create({ data: { memberId: memberInstances['LogiTrans'].id, communityId: commInstances['Smart Mobility'].id, role: 'Membre' } });
  await prisma.communityMembership.create({ data: { memberId: memberInstances['SmartFleet'].id, communityId: commInstances['Smart Mobility'].id, role: 'Expert' } });
  await prisma.communityMembership.create({ data: { memberId: memberInstances['DataMove'].id, communityId: commInstances['Smart Mobility'].id, role: 'Membre' } });

  // Inscriptions en masse pour le reste
  const membersKeys = Object.keys(memberInstances);
  for (let idx = 10; idx < 50; idx++) {
    const mName = membersKeys[idx];
    const mId = memberInstances[mName].id;
    const cName = idx % 2 === 0 ? 'Cyber PME' : 'Circularité';
    await prisma.communityMembership.create({
      data: {
        memberId: mId,
        communityId: commInstances[cName].id,
        role: 'Membre'
      }
    });
  }

  // 10. Création des 25 Opportunités / Funding Framework
  console.log('💰 Création des 25 Opportunités & Financements...');
  const fundingProgramWE = await prisma.fundingProgram.create({ data: { name: 'Wallonie Entreprendre - Transition Écologique' } });
  const fundingProgramFEDER = await prisma.fundingProgram.create({ data: { name: 'FEDER Wallonie 2021-2027' } });
  const fundingProgramHE = await prisma.fundingProgram.create({ data: { name: 'Horizon Europe Health' } });

  const calls = [
    { name: 'Appel Tremplin IA 2026', progId: fundingProgramFEDER.id },
    { name: 'Appel Health Innovation 2026', progId: fundingProgramHE.id },
    { name: 'Chèques Cybersécurité PME', progId: fundingProgramWE.id },
    { name: 'Appel Fret Vert Wallonie', progId: fundingProgramFEDER.id },
    { name: 'Appel Décarbonation Métallurgie', progId: fundingProgramWE.id }
  ];

  const callInstances: Record<string, any> = {};
  for (const c of calls) {
    callInstances[c.name] = await prisma.fundingCall.create({
      data: {
        name: c.name,
        description: `Appel à projets officiel : ${c.name}`,
        programId: c.progId,
        status: 'OPEN'
      }
    });
  }

  // Création d'opportunités génériques supplémentaires pour arriver à 25
  const oppInstances: Record<string, any> = {};
  for (let i = 1; i <= 25; i++) {
    oppInstances[`Opp-${i}`] = await prisma.opportunity.create({
      data: {
        title: `Appel public d'innovation #${i}`,
        type: i % 3 === 0 ? 'Financement' : i % 3 === 1 ? 'Consortium' : 'Projet',
        provider: i % 2 === 0 ? 'Wallonie Entreprendre' : 'AWEX',
        status: 'OPEN'
      }
    });
  }

  // 11. Création de 50 Collaborations (Relationship Framework)
  console.log('🕸️ Création de 50 Collaborations / Relationships...');
  const relTypes = ['RESEARCH_COLLABORATION', 'SUBCONTRACTING', 'CONSORTIUM_PARTNER', 'TECHNOLOGY_SUPPLIER', 'EXPERT_ADVISOR'];
  const strengths = ['STRONG', 'MEDIUM', 'WEAK'];
  
  // Collaborations de démonstration
  await prisma.relationship.create({ data: { memberAId: memberInstances['UCLouvain'].id, memberBId: memberInstances['CHU Liège'].id, type: 'RESEARCH_COLLABORATION', strength: 'STRONG' } });
  await prisma.relationship.create({ data: { memberAId: memberInstances['CETIC'].id, memberBId: memberInstances['LogiTrans'].id, type: 'EXPERT_ADVISOR', strength: 'STRONG' } });
  await prisma.relationship.create({ data: { memberAId: memberInstances['Sirris'].id, memberBId: memberInstances['HydroGreen'].id, type: 'RESEARCH_COLLABORATION', strength: 'STRONG' } });
  
  for (let i = 1; i <= 47; i++) {
    const idxA = (i * 3) % 50;
    const idxB = (i * 7) % 50;
    if (idxA !== idxB) {
      await prisma.relationship.create({
        data: {
          memberAId: memberInstances[membersKeys[idxA]].id,
          memberBId: memberInstances[membersKeys[idxB]].id,
          type: relTypes[i % relTypes.length],
          strength: strengths[i % strengths.length]
        }
      });
    }
  }

  // 12. Création de 20 Projets et Outcomes / Lignage
  console.log('📁 Création de 20 Projets...');
  const projInstances: Record<string, any> = {};
  
  // Use Case 1 BioWin Projet
  projInstances['BioWin IA Imagerie'] = await prisma.project.create({
    data: {
      name: 'MedTech IA Imagerie',
      description: 'Détection automatisée des tumeurs par imagerie médicale assistée par IA et validation clinique.',
      status: 'ACTIVE'
    }
  });
  
  // Use Case 2 Logistics Projet
  projInstances['LogiTrans Routage'] = await prisma.project.create({
    data: {
      name: 'LogiTrans Optimisation Fret',
      description: 'Optimisation prédictive des tournées logistiques pour réduire la consommation de carburant.',
      status: 'ACTIVE'
    }
  });

  // Use Case 3 GreenWin Projet
  projInstances['GreenWin Plastique'] = await prisma.project.create({
    data: {
      name: 'Circular Materials Plastiques',
      description: 'Éco-conception et tri optique pour la réintégration matière de polymères.',
      status: 'ACTIVE'
    }
  });

  for (let i = 4; i <= 20; i++) {
    projInstances[`Projet-${i}`] = await prisma.project.create({
      data: {
        name: `Projet collaboratif territorial #${i}`,
        description: `Projet de recherche industrielle et de transfert technologique #${i}`,
        status: i % 2 === 0 ? 'ACTIVE' : 'PLANNED'
      }
    });
  }

  // 13. Création des 100 Participations aux événements
  console.log('📅 Inscriptions aux événements...');
  const events = [
    { title: 'Conférence Wallonne sur la transition Hydrogène', location: 'Namur', type: 'conférence' },
    { title: 'Atelier IA & e-Santé BioWin', location: 'Liège', type: 'atelier' },
    { title: 'Webinaire NIS2 & Cyber Coalition', location: 'Charleroi', type: 'atelier' }
  ];

  const eventInstances: any[] = [];
  for (const ev of events) {
    eventInstances.push(await prisma.eventResource.create({
      data: {
        title: ev.title,
        location: ev.location,
        type: ev.type
      }
    }));
  }

  // Créer 27 autres événements génériques pour arriver à 30
  for (let i = 4; i <= 30; i++) {
    eventInstances.push(await prisma.eventResource.create({
      data: {
        title: `Événement Écosystème #${i}`,
        location: 'Namur',
        type: 'atelier'
      }
    }));
  }

  // Assigner 100 participations
  for (let i = 0; i < 100; i++) {
    const mId = memberInstances[membersKeys[i % 50]].id;
    const eId = eventInstances[i % 30].id;
    try {
      await prisma.memberParticipation.create({
        data: {
          memberId: mId,
          eventResourceId: eId,
          status: 'ATTENDED'
        }
      });
    } catch {
      // Éviter les clés dupliquées
    }
  }

  // 14. Lignage des Use Cases stratégiques (Missions -> Roadmaps -> Portefeuilles)
  console.log('📊 Initialisation des Portefeuilles et Cockpits de Direction...');
  
  // Mission BioWin
  const mHealth = await prisma.mission.create({ data: { name: 'Améliorer la santé par la technologie' } });
  const tHealth = await prisma.strategicTheme.create({ data: { name: 'IA Médicale & Santé Connectée', missionId: mHealth.id } });
  const rHealth = await prisma.roadmap.create({ data: { name: 'Feuille de route e-Santé 2026' } });
  await prisma.roadmapObjective.create({
    data: {
      name: 'Améliorer de 20% la détection précoce des tumeurs d\'ici 2028',
      roadmapId: rHealth.id
    }
  });
  const pHealth = await prisma.portfolio.create({ data: { name: 'Portefeuille Biotech & e-Santé' } });
  
  // Relier Projet au portefeuille et à la roadmap
  await prisma.project.update({
    where: { id: projInstances['BioWin IA Imagerie'].id },
    data: {
      roadmaps: { connect: [{ id: rHealth.id }] },
      portfolios: { connect: [{ id: pHealth.id }] }
    }
  });

  // Créer l'indicateur d'impact quantitatif
  const indHealth = await prisma.outcomeIndicator.create({
    data: {
      name: 'Nombre d\'outils médicaux IA certifiés',
      unit: 'unités',
      description: 'Nombre de dispositifs médicaux logiciels certifiés MDR grâce au pôle',
      aggregationType: 'SUM'
    }
  });

  // Service Deliveries, Outcomes et Preuves
  const serviceEco = await prisma.publicService.findFirst();
  const serviceId = serviceEco ? serviceEco.id : 1;

  const outcomeHealth = await prisma.outcome.create({
    data: {
      name: 'Algorithme clinique certifié',
      description: 'Homologation logicielle IA clinique obtenue pour MedTech Namur',
      publicServiceId: serviceId
    }
  });

  // Création de l'Evidence et d'une contribution
  const evidenceHealth = await prisma.evidence.create({
    data: {
      name: 'Rapport de validation clinique CHU Liège',
      description: 'Preuve officielle d\'homologation clinique',
      url: 'https://pit.wallonie.be/docs/validation_report_chu_liege.pdf',
      type: 'PDF',
      status: 'APPROVED'
    }
  });

  // Création du node de gouvernance unifié (InterventionNode)
  const nodeL1 = await prisma.interventionNode.create({
    data: {
      name: 'S3 Priorité : Santé et Sciences du vivant',
      type: 'PRIORITY',
      frameworkId: fwInstances['S3'].id
    }
  });
  
  const nodeL2 = await prisma.interventionNode.create({
    data: {
      name: 'Objectif : Diagnostics précoces par IA',
      type: 'OBJECTIVE',
      frameworkId: fwInstances['S3'].id,
      parentNodeId: nodeL1.id
    }
  });

  // Relier l'outcome à la contribution sémantique régionale (S3)
  await prisma.strategicContribution.create({
    data: {
      outcomeId: outcomeHealth.id,
      nodeId: nodeL2.id,
      description: 'Certification de dispositif e-Santé via BioWin',
      value: 1.0,
      metric: 'unités'
    }
  });

  console.log('🎉 Seed complété avec succès ! 50 membres, 10 communautés, 25 opportunités et 5 use cases stratégiques scénarisés.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
