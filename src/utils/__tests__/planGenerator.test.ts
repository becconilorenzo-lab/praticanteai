import {
  generaPiano,
  rigeneraPiano,
  toLocalDateStr,
  fromLocalDateStr,
  addDays,
  round5,
  IT_DAYS,
  type PlanActivity,
} from '../planGenerator';
import type { StudyProfile } from '../../store/useStore';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const testList: { name: string; fn: () => void }[] = [];

function it(name: string, fn: () => void) {
  testList.push({ name, fn });
}

function expect(actual: any) {
  return {
    toBe: (exp: any) => {
      if (actual !== exp) throw new Error(`Expected ${exp} but got ${actual}`);
    },
    toBeGreaterThan: (exp: any) => {
      if (!(actual > exp)) throw new Error(`Expected ${actual} > ${exp}`);
    },
    toBeGreaterThanOrEqual: (exp: any) => {
      if (!(actual >= exp)) throw new Error(`Expected ${actual} >= ${exp}`);
    },
    toBeLessThanOrEqual: (exp: any) => {
      if (!(actual <= exp)) throw new Error(`Expected ${actual} <= ${exp}`);
    },
  };
}

// ── Test Cases ──────────────────────────────────────────────────────

const fixedTodayStr = '2026-11-04'; // Wednesday

function testScenario(profile: StudyProfile, scenarioName: string) {
  const plan = generaPiano(profile, fixedTodayStr);
  const examDateStr = profile.dataEsame;
  const numDays = profile.giorniStudio.length;
  const expectedDailyMin = round5((profile.oreSettimana * 60) / numDays);

  // 1. Group activities by day
  const byDay = new Map<string, PlanActivity[]>();
  for (const act of plan) {
    if (!byDay.has(act.data)) byDay.set(act.data, []);
    byDay.get(act.data)!.push(act);
  }

  // 2. Sum minutes per day = dailyMin
  for (const [day, acts] of byDay.entries()) {
    const daySum = acts.reduce((s, a) => s + a.durataMin, 0);
    if (daySum !== expectedDailyMin) {
      throw new Error(
        `[${scenarioName}] In date ${day}, sum is ${daySum} but expected dailyMin ${expectedDailyMin}`
      );
    }
  }

  // 3. Check normal blocks in 15-45 and simulations <= 90
  for (const act of plan) {
    if (act.tipo === 'simulazione') {
      expect(act.durataMin).toBeGreaterThanOrEqual(15);
      expect(act.durataMin).toBeLessThanOrEqual(Math.max(90, expectedDailyMin));
    } else {
      expect(act.durataMin).toBeGreaterThanOrEqual(15);
      expect(act.durataMin).toBeLessThanOrEqual(45);
    }
  }

  // 4. No activities in non-selected days, before today, or on/after exam date
  for (const act of plan) {
    if (act.data < fixedTodayStr) {
      throw new Error(`[${scenarioName}] Activity before today: ${act.data}`);
    }
    if (act.data >= examDateStr) {
      throw new Error(`[${scenarioName}] Activity on/after exam date: ${act.data} >= ${examDateStr}`);
    }
    const d = fromLocalDateStr(act.data);
    const dayName = IT_DAYS[d.getDay()];
    if (!profile.giorniStudio.includes(dayName)) {
      throw new Error(`[${scenarioName}] Activity on unselected day: ${dayName} (${act.data})`);
    }
  }

  // 5. No 'accademia' type
  for (const act of plan) {
    if ((act.tipo as string) === 'accademia') {
      throw new Error(`[${scenarioName}] Found forbidden tipo 'accademia'`);
    }
  }

  // 6. Same input = same output (deterministic)
  const plan2 = generaPiano(profile, fixedTodayStr);
  if (JSON.stringify(plan) !== JSON.stringify(plan2)) {
    throw new Error(`[${scenarioName}] Generator is not deterministic!`);
  }

  return plan;
}

// Scenario 1: 5 ore/settimana su 3 giorni, esame tra 6 settimane
it('Caso 1: 5 ore/settimana su 3 giorni, esame tra 6 settimane', () => {
  const exam = addDays(fromLocalDateStr(fixedTodayStr), 6 * 7);
  const profile: StudyProfile = {
    dataEsame: toLocalDateStr(exam),
    oreSettimana: 5,
    giorniStudio: ['Lunedì', 'Mercoledì', 'Venerdì'],
    obiettivo: 'Partire da zero',
    livelli: {
      contabilita: 1, // lowest
      tributario: 5,   // highest
      commerciale: 3,
      revisione: 3,
      economia: 3,
      informatica: 3,
    },
    dataCreazione: fixedTodayStr,
  };

  const plan = testScenario(profile, 'Caso 1');

  // Verify area with lowest level gets more total minutes than highest
  const minByArea: Record<string, number> = {};
  for (const a of plan) {
    minByArea[a.areaId] = (minByArea[a.areaId] ?? 0) + a.durataMin;
  }
  expect(minByArea['contabilita'] ?? 0).toBeGreaterThan(minByArea['tributario'] ?? 0);
});

// Scenario 2: 15 ore su 5 giorni, esame tra 20 settimane
it('Caso 2: 15 ore su 5 giorni, esame tra 20 settimane', () => {
  const exam = addDays(fromLocalDateStr(fixedTodayStr), 20 * 7);
  const profile: StudyProfile = {
    dataEsame: toLocalDateStr(exam),
    oreSettimana: 15,
    giorniStudio: ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì'],
    obiettivo: 'Concentrarmi sulle tracce scritte',
    livelli: {
      contabilita: 2,
      tributario: 1, // lowest
      commerciale: 5, // highest
      revisione: 4,
      economia: 3,
      informatica: 3,
    },
    dataCreazione: fixedTodayStr,
  };

  const plan = testScenario(profile, 'Caso 2');

  const minByArea: Record<string, number> = {};
  for (const a of plan) {
    minByArea[a.areaId] = (minByArea[a.areaId] ?? 0) + a.durataMin;
  }
  expect(minByArea['tributario'] ?? 0).toBeGreaterThan(minByArea['commerciale'] ?? 0);
});

// Scenario 3: 10 ore su 4 giorni, esame tra 10 giorni + test rigeneraPiano
it('Caso 3: 10 ore su 4 giorni, esame tra 10 giorni e rigenerazione', () => {
  const exam = addDays(fromLocalDateStr(fixedTodayStr), 10);
  const profile: StudyProfile = {
    dataEsame: toLocalDateStr(exam),
    oreSettimana: 10,
    giorniStudio: ['Lunedì', 'Mercoledì', 'Venerdì', 'Domenica'],
    obiettivo: 'Ripassare',
    livelli: {
      contabilita: 1,
      tributario: 4,
      commerciale: 2,
      revisione: 5,
      economia: 3,
      informatica: 3,
    },
    dataCreazione: fixedTodayStr,
  };

  const plan = testScenario(profile, 'Caso 3');

  // Verify rigeneraPiano keeps completed activities
  const firstAct = plan[0];
  if (firstAct) {
    firstAct.completata = true;
    const modifiedProfile = { ...profile, oreSettimana: 12 };
    const regenerated = rigeneraPiano(plan, modifiedProfile, fixedTodayStr);

    const foundCompleted = regenerated.find((a) => a.id === firstAct.id);
    if (!foundCompleted || !foundCompleted.completata) {
      throw new Error('rigeneraPiano non ha mantenuto l\'attività completata!');
    }
  }
});

export function runPlanTests(): TestResult[] {
  return testList.map((t) => {
    try {
      t.fn();
      return { name: t.name, passed: true };
    } catch (err: any) {
      return { name: t.name, passed: false, error: err?.message || String(err) };
    }
  });
}
