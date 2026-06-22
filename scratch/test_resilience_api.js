const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const API_BASE = 'http://localhost:3000/api/resilience';

// Helper to make fetch requests
async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'x-user-role': 'TEST_USER_ROLE',
      ...options.headers,
    },
    ...options,
  });

  const text = await response.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch (e) {}

  return {
    status: response.status,
    ok: response.ok,
    json,
    text,
  };
}

async function runTests() {
  console.log('=== STARTING LOT 3 RESILIENCE API VERIFICATION ===\n');

  try {
    // 1. Test Zod Validation: POST with invalid payload
    console.log('1. Testing Zod Validation on /risks...');
    const invalidRiskRes = await request('/risks', {
      method: 'POST',
      body: JSON.stringify({ category: 'NATURAL' }), // missing 'name'
    });
    if (invalidRiskRes.status === 400) {
      console.log('  -> SUCCESS: Invalid payload correctly rejected with 400.');
    } else {
      console.error(`  -> FAILURE: Expected 400, got ${invalidRiskRes.status}`);
      process.exit(1);
    }

    // 2. Test Risk Register Creation
    console.log('\n2. Creating a RiskRegister...');
    const registerRes = await request('/risk-registers', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Register de Test API',
        description: 'Test description',
        status: 'ACTIVE',
      }),
    });
    if (registerRes.status !== 201) {
      console.error(`  -> FAILURE: Failed to create RiskRegister: ${registerRes.status}`, registerRes.json);
      process.exit(1);
    }
    const register = registerRes.json;
    console.log(`  -> SUCCESS: Created RiskRegister ID=${register.id}`);

    // 3. Test Risk Creation & Automatic Calculation of riskScore
    console.log('\n3. Creating a Risk inside the Register...');
    const riskRes = await request('/risks', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Risque Inondation Test',
        category: 'NATURAL',
        severity: 4,
        likelihood: 3,
        riskRegisterId: register.id,
      }),
    });
    if (riskRes.status !== 201) {
      console.error(`  -> FAILURE: Failed to create Risk: ${riskRes.status}`, riskRes.json);
      process.exit(1);
    }
    const risk = riskRes.json;
    console.log(`  -> SUCCESS: Created Risk ID=${risk.id}`);
    if (risk.riskScore === 12) {
      console.log(`  -> SUCCESS: riskScore automatically calculated (4 * 3 = 12).`);
    } else {
      console.error(`  -> FAILURE: riskScore was not calculated correctly. Expected 12, got ${risk.riskScore}`);
      process.exit(1);
    }

    // 4. Test Scenario Creation
    console.log('\n4. Creating a Scenario linked to the Risk...');
    const scenarioRes = await request('/scenarios', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Scenario Inondation Centennale',
        description: 'Crues majeures',
        riskId: risk.id,
        probability: 0.1,
        severity: 'CRITICAL',
      }),
    });
    if (scenarioRes.status !== 201) {
      console.error(`  -> FAILURE: Failed to create Scenario: ${scenarioRes.status}`, scenarioRes.json);
      process.exit(1);
    }
    const scenario = scenarioRes.json;
    console.log(`  -> SUCCESS: Created Scenario ID=${scenario.id}`);

    // 5. Test RiskAssessment Creation
    console.log('\n5. Creating a RiskAssessment...');
    const assessmentRes = await request('/risk-assessments', {
      method: 'POST',
      body: JSON.stringify({
        assessmentType: 'LOCAL',
        scenarioId: scenario.id,
        riskId: risk.id,
        exposureScore: 7,
        vulnerabilityScore: 6,
        consequenceScore: 8,
        overallScore: 7,
      }),
    });
    if (assessmentRes.status !== 201) {
      console.error(`  -> FAILURE: Failed to create RiskAssessment: ${assessmentRes.status}`, assessmentRes.json);
      process.exit(1);
    }
    const assessment = assessmentRes.json;
    console.log(`  -> SUCCESS: Created RiskAssessment ID=${assessment.id}`);

    // 6. Test ResilienceProfile Creation & Automatic Formulas
    console.log('\n6. Creating a ResilienceProfile...');
    const profileRes = await request('/resilience-profiles', {
      method: 'POST',
      body: JSON.stringify({
        exposure: 6.0,
        sensitivity: 4.0,
        absorptionCapacity: 8.0,
        adaptiveCapacity: 7.0,
        recoveryCapacity: 9.0,
        methodology: 'OECD Test',
      }),
    });
    if (profileRes.status !== 201) {
      console.error(`  -> FAILURE: Failed to create ResilienceProfile: ${profileRes.status}`, profileRes.json);
      process.exit(1);
    }
    const profile = profileRes.json;
    console.log(`  -> SUCCESS: Created ResilienceProfile ID=${profile.id}`);
    
    // Validate calculations
    if (profile.vulnerability === 5.0) {
      console.log(`  -> SUCCESS: vulnerability automatically calculated ((6 + 4) / 2 = 5.0).`);
    } else {
      console.error(`  -> FAILURE: vulnerability was not calculated correctly. Expected 5.0, got ${profile.vulnerability}`);
      process.exit(1);
    }
    if (Math.abs(profile.overallResilience - 8.0) < 0.01) {
      console.log(`  -> SUCCESS: overallResilience automatically calculated ((8 + 7 + 9) / 3 = 8.0).`);
    } else {
      console.error(`  -> FAILURE: overallResilience was not calculated correctly. Expected 8.0, got ${profile.overallResilience}`);
      process.exit(1);
    }

    // 7. Test PATCH (Recalculations)
    console.log('\n7. Updating ResilienceProfile (PATCH)...');
    const updateProfileRes = await request(`/resilience-profiles/${profile.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        sensitivity: 2.0, // Should change vulnerability to (6 + 2) / 2 = 4.0
      }),
    });
    if (updateProfileRes.status !== 200) {
      console.error(`  -> FAILURE: Failed to update ResilienceProfile: ${updateProfileRes.status}`);
      process.exit(1);
    }
    const updatedProfile = updateProfileRes.json;
    if (updatedProfile.vulnerability === 4.0) {
      console.log(`  -> SUCCESS: vulnerability recalculated to 4.0 on PATCH.`);
    } else {
      console.error(`  -> FAILURE: vulnerability was not recalculated. Expected 4.0, got ${updatedProfile.vulnerability}`);
      process.exit(1);
    }

    // 8. Test GET Detail (Inclusions Strategy)
    console.log('\n8. Checking Include Strategy on GET /risks/:id...');
    const getRiskRes = await request(`/risks/${risk.id}`);
    if (getRiskRes.status !== 200) {
      console.error(`  -> FAILURE: GET detail failed: ${getRiskRes.status}`);
      process.exit(1);
    }
    const getRisk = getRiskRes.json;
    if (getRisk.threats && Array.isArray(getRisk.threats) && getRisk.scenarios && Array.isArray(getRisk.scenarios)) {
      console.log('  -> SUCCESS: Standard relations (threats, scenarios) correctly included.');
    } else {
      console.error('  -> FAILURE: Standard include strategy was not applied.', getRisk);
      process.exit(1);
    }

    // 9. Test Soft Delete
    console.log('\n9. Testing Soft Delete on Risk...');
    const deleteRiskRes = await request(`/risks/${risk.id}`, {
      method: 'DELETE',
    });
    if (deleteRiskRes.status !== 200) {
      console.error(`  -> FAILURE: Soft delete request failed: ${deleteRiskRes.status}`);
      process.exit(1);
    }
    console.log('  -> Soft delete request returned success.');

    // Verify it is hidden on GET detail
    const getDeletedRiskRes = await request(`/risks/${risk.id}`);
    if (getDeletedRiskRes.status === 404) {
      console.log('  -> SUCCESS: Soft-deleted risk returned 404 on GET detail.');
    } else {
      console.error(`  -> FAILURE: Expected 404 for deleted risk, got ${getDeletedRiskRes.status}`);
      process.exit(1);
    }

    // Verify it is hidden on GET list
    const getRisksListRes = await request('/risks');
    const risksList = getRisksListRes.json;
    const found = risksList.some(r => r.id === risk.id);
    if (!found) {
      console.log('  -> SUCCESS: Soft-deleted risk excluded from GET list by default.');
    } else {
      console.error('  -> FAILURE: Soft-deleted risk still present in GET list.');
      process.exit(1);
    }

    // Verify it is returned if includeInactive=true
    const getRisksListWithInactiveRes = await request('/risks?includeInactive=true');
    const risksListWithInactive = getRisksListWithInactiveRes.json;
    const foundWithInactive = risksListWithInactive.some(r => r.id === risk.id);
    if (foundWithInactive) {
      console.log('  -> SUCCESS: Soft-deleted risk included in GET list when ?includeInactive=true.');
    } else {
      console.error('  -> FAILURE: Soft-deleted risk not returned even with ?includeInactive=true.');
      process.exit(1);
    }

    // 10. Verify Audit Log Persistence
    console.log('\n10. Verifying Audit Logs via database query...');
    const auditLogs = await prisma.resilienceAuditLog.findMany({
      where: { entityType: 'Risk', entityId: risk.id },
      orderBy: { timestamp: 'asc' },
    });
    console.log(`  -> Found ${auditLogs.length} audit log entries for Risk ID=${risk.id}`);
    if (auditLogs.length >= 2) {
      const createLog = auditLogs.find(l => l.action === 'CREATE');
      const deleteLog = auditLogs.find(l => l.action === 'DELETE');
      if (createLog && deleteLog && deleteLog.userId === 'TEST_USER_ROLE') {
        console.log('  -> SUCCESS: Audit logs correctly recorded CREATE and DELETE actions with user role.');
      } else {
        console.error('  -> FAILURE: Audit logs data incorrect.', auditLogs);
        process.exit(1);
      }
    } else {
      console.error('  -> FAILURE: Missing audit log entries.');
      process.exit(1);
    }

    // Cleanup other objects from DB to leave it clean
    console.log('\nCleaning up database...');
    // Hard deletes for non-soft-delete tables and soft deletes cleanup via Prisma
    await prisma.resilienceProfile.deleteMany({ where: { id: profile.id } });
    await prisma.riskAssessment.deleteMany({ where: { id: assessment.id } });
    await prisma.scenario.deleteMany({ where: { id: scenario.id } });
    await prisma.risk.deleteMany({ where: { id: risk.id } });
    await prisma.riskRegister.deleteMany({ where: { id: register.id } });
    await prisma.resilienceAuditLog.deleteMany({ where: { entityId: { in: [risk.id, register.id, scenario.id, assessment.id, profile.id] } } });

    console.log('\n=== ALL VERIFICATIONS PASSED SUCCESSFULLY ===');
  } catch (e) {
    console.error('An unexpected error occurred during API verification:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
