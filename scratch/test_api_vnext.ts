import http from 'http';

const request = (method: string, path: string, body?: any): Promise<{ status: number; data: any }> => {
  return new Promise((resolve) => {
    const postData = body ? JSON.stringify(body) : '';
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3001,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode || 0, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode || 0, data });
          }
        });
      }
    );
    req.on('error', (err) => {
      console.error(`Request to ${path} failed:`, err.message);
      resolve({ status: 500, data: err.message });
    });
    if (body) {
      req.write(postData);
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('⚡ DÉMARRAGE DES TESTS D\'INTÉGRATION API V2 & DUAL-WRITE ⚡\n');

  // Test 1: GET /api/v2/services
  console.log('Test 1: GET /api/v2/services...');
  const res1 = await request('GET', '/api/v2/services?pageSize=2');
  console.log(`Status: ${res1.status}`);
  let validServiceId = 1;
  let validOperatorId = 1;
  if (res1.status === 200 && res1.data.meta) {
    console.log('✅ Success! meta:', res1.data.meta);
    if (res1.data.data && res1.data.data.length > 0) {
      validServiceId = res1.data.data[0].id;
      validOperatorId = res1.data.data[0].organizationId || res1.data.data[0].organization?.id || 1;
      console.log(`Using validServiceId: ${validServiceId}, validOperatorId: ${validOperatorId}`);
    }
  } else {
    console.log('❌ Failed:', res1.data);
  }

  // Test 2: GET /api/v2/journeys
  console.log('\nTest 2: GET /api/v2/journeys...');
  const res2 = await request('GET', '/api/v2/journeys?pageSize=1');
  console.log(`Status: ${res2.status}`);
  if (res2.status === 200 && res2.data.data) {
    console.log('✅ Success! Found journeys:', res2.data.data.length);
  } else {
    console.log('❌ Failed');
  }

  // Test 3: GET /api/v2/taxonomies/drbest
  console.log('\nTest 3: GET /api/v2/taxonomies/drbest...');
  const res3 = await request('GET', '/api/v2/taxonomies/drbest');
  console.log(`Status: ${res3.status}`);
  if (res3.status === 200 && Array.isArray(res3.data.data)) {
    console.log('✅ Success! Dimensions count:', res3.data.data.length);
  } else {
    console.log('❌ Failed');
  }

  // Test 4: GET /api/v2/search?q=IA
  console.log('\nTest 4: GET /api/v2/search?q=IA...');
  const res4 = await request('GET', '/api/v2/search?q=IA');
  console.log(`Status: ${res4.status}`);
  if (res4.status === 200 && res4.data.data) {
    console.log('✅ Success! Keys in search response:', Object.keys(res4.data.data));
  } else {
    console.log('❌ Failed');
  }

  // Test 5: GET /api/v2/assessment-frameworks (Placeholder)
  console.log('\nTest 5: GET /api/v2/assessment-frameworks...');
  const res5 = await request('GET', '/api/v2/assessment-frameworks');
  console.log(`Status: ${res5.status}`);
  if (res5.status === 200 && res5.data.status === 'planned_for_sprint_5') {
    console.log('✅ Success! Placeholder returned planned status.');
  } else {
    console.log('❌ Failed');
  }

  // Test 6: GET /api/v2/openapi.json
  console.log('\nTest 6: GET /api/v2/openapi.json...');
  const res6 = await request('GET', '/api/v2/openapi.json');
  console.log(`Status: ${res6.status}`);
  if (res6.status === 200 && res6.data.paths) {
    console.log('✅ Success! OpenAPI spec parsed. Paths count:', Object.keys(res6.data.paths).length);
  } else {
    console.log('❌ Failed');
  }

  // Fetch a valid beneficiary
  console.log('\nFetching a valid beneficiary for writes...');
  const benRes = await request('GET', '/api/v2/beneficiaries?pageSize=1');
  let validBeneficiaryId = 1;
  if (benRes.status === 200 && benRes.data.data && benRes.data.data.length > 0) {
    validBeneficiaryId = benRes.data.data[0].id;
    console.log(`Found validBeneficiaryId: ${validBeneficiaryId}`);
  } else {
    console.log('Warning: No beneficiaries found, using default id 1');
  }

  // Test 7: DUAL WRITE Test - POST /api/action-instances
  console.log('\nTest 7: DUAL WRITE - POST /api/action-instances...');
  const actionBody = {
    title: 'Diagnostic IA Test Dual-Write',
    objective: 'Tester la double-écriture synchrone',
    status: 'PLANNED',
    beneficiaryId: validBeneficiaryId
  };
  const res7 = await request('POST', '/api/action-instances', actionBody);
  console.log(`Status POST: ${res7.status}`);
  if (res7.status === 201) {
    console.log('✅ V1 POST success. Checking if vNext Action exists...');
    const res7b = await request('GET', `/api/v2/actions?pageSize=50`);
    const actions = res7b.data.data || [];
    const found = actions.some((act: any) => act.title === 'Diagnostic IA Test Dual-Write');
    if (found) {
      console.log('✅ Success! Action successfully created in vNext Actions table.');
    } else {
      console.log('❌ Failed! Action was not found in vNext Actions table.');
    }
  } else {
    console.log('❌ V1 POST failed:', res7.data);
  }

  // Test 8: DUAL WRITE Test - POST /api/service-deliveries
  console.log('\nTest 8: DUAL WRITE - POST /api/service-deliveries...');
  const deliveryBody = {
    beneficiaryId: validBeneficiaryId,
    serviceId: validServiceId,
    status: 'IN_PROGRESS',
    operatorId: validOperatorId
  };
  const res8 = await request('POST', '/api/service-deliveries', deliveryBody);
  console.log(`Status POST: ${res8.status}`);
  if (res8.status === 201) {
    console.log('✅ V1 POST success. Checking if vNext Activity exists...');
    const res8b = await request('GET', `/api/v2/activities?pageSize=50`);
    const activities = res8b.data.data || [];
    const found = activities.some((act: any) => act.beneficiaryId === validBeneficiaryId && act.serviceId === validServiceId && act.activityType === 'INDIVIDUAL');
    if (found) {
      console.log('✅ Success! Activity successfully created in vNext Activities table.');
    } else {
      console.log('❌ Failed! Activity was not found in vNext Activities table.');
    }
  } else {
    console.log('❌ V1 POST failed:', res8.data);
  }

  console.log('\n⚡ FIN DES TESTS D\'INTÉGRATION API ⚡');
};

runTests();
