const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Mise à jour des codes des vulnérabilités existantes...');
  
  const v1 = await prisma.vulnerability.findFirst({
    where: { name: 'Dépendance exclusive envers des fournisseurs de métaux rares hors-UE' }
  });
  if (v1) {
    await prisma.vulnerability.update({
      where: { id: v1.id },
      data: { code: 'VULN-RAW-METALS' }
    });
    console.log('✅ Dépendance Métaux Rares mise à jour avec le code: VULN-RAW-METALS');
  }

  const v2 = await prisma.vulnerability.findFirst({
    where: { name: "Faiblesse des plans de continuité d'activité (DRP) cyber des sous-traitants" }
  });
  if (v2) {
    await prisma.vulnerability.update({
      where: { id: v2.id },
      data: { code: 'VULN-CYBER-PBA' }
    });
    console.log('✅ Faiblesse Cyber DRP mise à jour avec le code: VULN-CYBER-PBA');
  }

  console.log('🎉 Mise à jour terminée avec succès.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
