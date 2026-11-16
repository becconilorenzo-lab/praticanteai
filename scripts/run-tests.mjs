import { runPlanTests } from '../src/utils/__tests__/planGenerator.test.ts';

const results = runPlanTests();
console.log('--- TEST RESULTS ---');
let allPassed = true;
for (const r of results) {
  if (r.passed) {
    console.log(`✅ PASS: ${r.name}`);
  } else {
    console.error(`❌ FAIL: ${r.name} - ${r.error}`);
    allPassed = false;
  }
}

if (!allPassed) {
  process.exit(1);
} else {
  console.log('All tests passed successfully!');
}
