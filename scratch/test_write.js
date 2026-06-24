const { PrismaClient } = require("@prisma/client");

async function main() {
  console.log("Starting DB write test...");
  const prisma = new PrismaClient();
  try {
    // 1. Find a beneficiary (e.g. BioPlast SA)
    const beneficiary = await prisma.beneficiary.findFirst({
      where: { name: "BioPlast SA" }
    });
    if (!beneficiary) {
      console.error("Beneficiary BioPlast SA not found!");
      return;
    }
    console.log("Found Beneficiary:", beneficiary.id, beneficiary.name);

    // 2. Find a public service
    const service = await prisma.publicService.findFirst();
    if (!service) {
      console.error("No PublicService found!");
      return;
    }
    console.log("Found PublicService:", service.id, service.name);

    // 3. Find an operator/organization
    const operator = await prisma.organization.findFirst();
    if (!operator) {
      console.error("No Organization found!");
      return;
    }
    console.log("Found Organization:", operator.id, operator.name);

    // Try transaction block
    const result = await prisma.$transaction(async (tx) => {
      const delivery = await tx.serviceDelivery.create({
        data: {
          title: "Test Prestation Scratch",
          description: "Description de test",
          serviceId: service.id,
          beneficiaryId: beneficiary.id,
          operatorId: operator.id,
          providerOrganizationId: operator.id,
          status: "planned",
          channel: "mail",
          deliveryMode: "individuel",
          location: "Test Location",
          outputs: "Livrables de test",
          actualStartDate: new Date()
        }
      });
      console.log("ServiceDelivery created:", delivery.id);

      // Try Activity create
      const activity = await tx.activity.create({
        data: {
          activityType: 'INDIVIDUAL',
          serviceId: service.id,
          status: 'PLANNED',
          date: new Date(),
          operatorId: operator.id,
          beneficiaryId: beneficiary.id,
          outputReal: "Livrables de test",
          sourceType: "ServiceDelivery",
          sourceId: delivery.id
        }
      });
      console.log("Activity created:", activity.id);

      return { delivery, activity };
    });

    console.log("Transaction succeeded!");

    // Clean up
    await prisma.activity.delete({ where: { id: result.activity.id } });
    await prisma.serviceDelivery.delete({ where: { id: result.delivery.id } });
    console.log("Cleaned up successfully.");

  } catch (err) {
    console.error("Error occurred:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
