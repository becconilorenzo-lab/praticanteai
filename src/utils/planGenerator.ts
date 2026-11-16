import {
  AREE_STUDIO,
  STUDY_PLAN_CONFIG,
  type TipoAttivita,
  type FaseId,
  type ObiettivoStudio,
} from '../config/studyPlanConfig';
import type { StudyProfile } from '../store/useStore';

export interface PlanActivity {
  id: string;
  data: string; // YYYY-MM-DD
  areaId: string;
  areaLabel: string;
  tipo: TipoAttivita;
  durataMin: number;
  faseId: FaseId;
  titolo: string;
  completata: boolean;
  saltata?: boolean;
}

export interface PlanStatistics {
  minutiTotali: number;
  minutiCompletati: number;
  percentuale: number;
  giorniAllEsame: number;
  prossimaAttivita: PlanActivity | null;
  oreTotali: number;
  settimaneTotali: number;
}

// ── Date utilities (local date strings only) ─────────────────────────

export const IT_DAYS = [
  'Domenica',
  'Lunedì',
  'Martedì',
  'Mercoledì',
  'Giovedì',
  'Venerdì',
  'Sabato',
] as const;

export function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function fromLocalDateStr(s: string): Date {
  const parts = s.split('-').map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
}

export function addDays(d: Date, n: number): Date {
  const res = new Date(d);
  res.setDate(res.getDate() + n);
  return res;
}

export function round5(n: number): number {
  return Math.round(n / 5) * 5;
}

function getMonday(d: Date): Date {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(d, diff);
}

// ── Slicing normal blocks ──────────────────────────────────────────

export function splitIntoNormalBlocks(m: number): number[] {
  if (m <= 0) return [];
  if (m <= 45) return [Math.max(15, m)];

  const n = Math.ceil(m / 45);
  const base = round5(m / n);
  const blocks: number[] = [];
  let sum = 0;

  for (let i = 0; i < n - 1; i++) {
    blocks.push(base);
    sum += base;
  }
  let last = m - sum;
  blocks.push(last);

  // Adjust any edge cases outside [15, 45]
  for (let i = blocks.length - 1; i > 0; i--) {
    if (blocks[i] < 15) {
      const diff = 15 - blocks[i];
      blocks[i] += diff;
      blocks[i - 1] -= diff;
    } else if (blocks[i] > 45) {
      const diff = blocks[i] - 45;
      blocks[i] -= diff;
      blocks[i - 1] += diff;
    }
  }

  return blocks;
}

// ── Deficit Picker ─────────────────────────────────────────────────

function pickByDeficit<T extends { id: string }>(
  items: T[],
  targets: Record<string, number>,
  assigned: Record<string, number>,
  totalAssigned: number,
  blockDuration: number,
  candidates?: T[]
): T {
  const pool = candidates && candidates.length > 0 ? candidates : items;
  let bestItem = pool[0];
  let maxDeficit = -Infinity;

  for (const item of pool) {
    const quota = targets[item.id] ?? 0;
    const currentAssigned = assigned[item.id] ?? 0;
    // Deficit = (quotaTarget * (totalAssigned + blockDuration)) - currentAssigned
    const deficit = quota * (totalAssigned + blockDuration) - currentAssigned;

    if (deficit > maxDeficit) {
      maxDeficit = deficit;
      bestItem = item;
    }
  }

  return bestItem;
}

// ── Phase Weeks Allocation (Largest Remainder) ─────────────────────

function allocatePhaseWeeks(
  totalWeeks: number,
  obiettivo: ObiettivoStudio
): { faseId: FaseId; weeks: number }[] {
  let phases = STUDY_PLAN_CONFIG.fasiPerSettimane(totalWeeks);

  // If obiettivo === 'Ripassare', skip apprendimento and pass its quota to pratica
  if (obiettivo === 'Ripassare') {
    const appIndex = phases.findIndex((p) => p.faseId === 'apprendimento');
    if (appIndex >= 0) {
      const appQuota = phases[appIndex].quota;
      phases = phases.filter((p) => p.faseId !== 'apprendimento');
      const prat = phases.find((p) => p.faseId === 'pratica');
      if (prat) {
        prat.quota += appQuota;
      } else {
        phases.unshift({ faseId: 'pratica', quota: appQuota });
      }
    }
  }

  const raw = phases.map((p) => ({
    faseId: p.faseId,
    exact: totalWeeks * p.quota,
    weeks: Math.max(1, Math.floor(totalWeeks * p.quota)),
    remainder: (totalWeeks * p.quota) % 1,
  }));

  let allocated = raw.reduce((acc, r) => acc + r.weeks, 0);

  // If over-allocated because of min 1
  while (allocated > totalWeeks && raw.length > 1) {
    // reduce from largest weeks > 1
    const maxItem = raw.filter((r) => r.weeks > 1).reduce((prev, curr) => (curr.weeks > prev.weeks ? curr : prev), raw[0]);
    if (maxItem && maxItem.weeks > 1) {
      maxItem.weeks--;
      allocated--;
    } else {
      break;
    }
  }

  // If under-allocated, distribute to largest remainder
  if (allocated < totalWeeks) {
    const sorted = [...raw].sort((a, b) => b.remainder - a.remainder);
    for (let i = 0; i < totalWeeks - allocated; i++) {
      sorted[i % sorted.length].weeks++;
    }
  }

  return raw.map((r) => ({ faseId: r.faseId, weeks: r.weeks }));
}

// ── Main Generator: generaPiano ────────────────────────────────────

export function generaPiano(profilo: StudyProfile, oggiStr?: string): PlanActivity[] {
  const oggi = oggiStr ? fromLocalDateStr(oggiStr) : new Date();
  const todayDateStr = toLocalDateStr(oggi);
  const examDate = fromLocalDateStr(profilo.dataEsame);

  // End date is the day BEFORE the exam
  const endDate = addDays(examDate, -1);
  const endDateStr = toLocalDateStr(endDate);

  if (endDateStr < todayDateStr) {
    return [];
  }

  // Daily minutes
  const numDays = Math.max(1, profilo.giorniStudio.length);
  const dailyMin = round5((profilo.oreSettimana * 60) / numDays);

  // Calendar weeks touched by the period
  const startMonday = getMonday(oggi);
  const endMonday = getMonday(endDate);
  const msDiff = endMonday.getTime() - startMonday.getTime();
  const totalCalendarWeeks = Math.max(1, Math.round(msDiff / (7 * 24 * 60 * 60 * 1000)) + 1);

  // Allocate phases across weeks
  const phaseAllocations = allocatePhaseWeeks(totalCalendarWeeks, profilo.obiettivo);

  // Map each calendar week (0-based) to a phase
  const weekPhaseMap: { faseId: FaseId; weekInPhase: number }[] = [];
  let wCursor = 0;
  for (const pa of phaseAllocations) {
    for (let i = 0; i < pa.weeks; i++) {
      if (wCursor < totalCalendarWeeks) {
        weekPhaseMap.push({ faseId: pa.faseId, weekInPhase: i + 1 });
        wCursor++;
      }
    }
  }
  while (weekPhaseMap.length < totalCalendarWeeks) {
    weekPhaseMap.push({ faseId: 'ripasso', weekInPhase: 1 });
  }

  // Area Target Quotas
  const areaWeights: Record<string, number> = {};
  let totalAreaWeight = 0;
  for (const a of AREE_STUDIO) {
    const userLevel = profilo.livelli[a.id] ?? 3;
    const peso = (6 - userLevel) * (a.importanza ?? 1);
    areaWeights[a.id] = peso;
    totalAreaWeight += peso;
  }
  const areaTargets: Record<string, number> = {};
  for (const a of AREE_STUDIO) {
    areaTargets[a.id] = totalAreaWeight > 0 ? areaWeights[a.id] / totalAreaWeight : 1 / AREE_STUDIO.length;
  }

  // Tracking assigned minutes
  const assignedAreaMin: Record<string, number> = {};
  let totalAssignedAreaMin = 0;

  const assignedTypeMin: Record<string, number> = { biblioteca: 0, palestra: 0 };
  let totalAssignedTypeMin = 0;

  const activities: PlanActivity[] = [];
  let activityCounter = 1;

  // Iterate calendar week by calendar week
  for (let w = 0; w < totalCalendarWeeks; w++) {
    const wMonday = addDays(startMonday, w * 7);
    const { faseId, weekInPhase } = weekPhaseMap[w] ?? { faseId: 'ripasso', weekInPhase: 1 };

    // Identify study days in this week that fall inside [todayDateStr, endDateStr]
    const studyDaysThisWeek: { dateStr: string; dateObj: Date; dayName: string }[] = [];
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const d = addDays(wMonday, dayOffset);
      const dStr = toLocalDateStr(d);
      if (dStr >= todayDateStr && dStr <= endDateStr) {
        const dName = IT_DAYS[d.getDay()];
        if (profilo.giorniStudio.includes(dName)) {
          studyDaysThisWeek.push({ dateStr: dStr, dateObj: d, dayName: dName });
        }
      }
    }

    if (studyDaysThisWeek.length === 0) continue;

    // Simulation check for this week
    const simConfig = STUDY_PLAN_CONFIG.simulazioniPerFase[faseId];
    let hasSimulation = false;
    if (simConfig.attiva && dailyMin >= STUDY_PLAN_CONFIG.simulazioneMinuti.minDailyPerAbilitare) {
      if (simConfig.frequenzaSettimane === 1) {
        hasSimulation = true;
      } else if (simConfig.frequenzaSettimane === 2 && weekInPhase % 2 === 0) {
        hasSimulation = true;
      }
    }

    const lastStudyDayIndex = studyDaysThisWeek.length - 1;

    // Mix for this phase
    let baseMix = { ...STUDY_PLAN_CONFIG.mixAttivitaPerFase[faseId] };
    if (profilo.obiettivo === 'Concentrarmi sulle tracce scritte') {
      const shift = 0.20;
      const newBib = Math.max(0, baseMix.biblioteca - shift);
      const newPal = Math.min(1, baseMix.palestra + shift);
      baseMix = { biblioteca: newBib, palestra: newPal };
    }

    // Process each study day in the week
    for (let sIdx = 0; sIdx < studyDaysThisWeek.length; sIdx++) {
      const sDay = studyDaysThisWeek[sIdx];
      const isSimDay = hasSimulation && sIdx === lastStudyDayIndex;

      let blocksToCreate: { tipo: TipoAttivita; duration: number }[] = [];

      if (isSimDay) {
        const rawSimDuration = Math.min(STUDY_PLAN_CONFIG.simulazioneMinuti.max, dailyMin);
        const remaining = dailyMin - rawSimDuration;

        if (remaining >= 15) {
          // Normal blocks + simulation block
          const normalBlocks = splitIntoNormalBlocks(remaining);
          for (const bDur of normalBlocks) {
            blocksToCreate.push({ tipo: 'palestra', duration: bDur }); // tipo determined below
          }
          blocksToCreate.push({ tipo: 'simulazione', duration: rawSimDuration });
        } else {
          // Absorbed by simulation
          blocksToCreate.push({ tipo: 'simulazione', duration: dailyMin });
        }
      } else {
        const normalBlocks = splitIntoNormalBlocks(dailyMin);
        for (const bDur of normalBlocks) {
          blocksToCreate.push({ tipo: 'palestra', duration: bDur }); // tipo determined below
        }
      }

      // Assign area and type for each block of the day
      const usedAreasToday = new Set<string>();

      for (const b of blocksToCreate) {
        // Pick Area: if areas > blocks today, avoid repeating same area
        const candidates = AREE_STUDIO.filter(
          (a) => !usedAreasToday.has(a.id) || usedAreasToday.size >= AREE_STUDIO.length
        );

        const chosenArea = pickByDeficit(
          AREE_STUDIO,
          areaTargets,
          assignedAreaMin,
          totalAssignedAreaMin,
          b.duration,
          candidates
        );

        usedAreasToday.add(chosenArea.id);
        assignedAreaMin[chosenArea.id] = (assignedAreaMin[chosenArea.id] ?? 0) + b.duration;
        totalAssignedAreaMin += b.duration;

        // Pick Type: if simulation, it's fixed. Otherwise pick between biblioteca and palestra
        let chosenTipo: TipoAttivita = b.tipo;
        if (b.tipo !== 'simulazione') {
          const typeCandidates = [
            { id: 'biblioteca' as const },
            { id: 'palestra' as const },
          ];
          const typeTargets = {
            biblioteca: baseMix.biblioteca,
            palestra: baseMix.palestra,
          };
          const chosenTypeObj = pickByDeficit(
            typeCandidates,
            typeTargets,
            assignedTypeMin,
            totalAssignedTypeMin,
            b.duration
          );
          chosenTipo = chosenTypeObj.id;
          assignedTypeMin[chosenTipo] = (assignedTypeMin[chosenTipo] ?? 0) + b.duration;
          totalAssignedTypeMin += b.duration;
        }

        // Title
        let titolo = '';
        if (chosenTipo === 'biblioteca') {
          titolo = `Biblioteca: ${chosenArea.label}`;
        } else if (chosenTipo === 'palestra') {
          titolo = `Palestra: ${chosenArea.label}`;
        } else {
          titolo = `Simulazione: traccia ${chosenArea.label}`;
        }

        activities.push({
          id: `act-${activityCounter++}`,
          data: sDay.dateStr,
          areaId: chosenArea.id,
          areaLabel: chosenArea.label,
          tipo: chosenTipo,
          durataMin: b.duration,
          faseId: faseId,
          titolo,
          completata: false,
        });
      }
    }
  }

  return activities;
}

// ── Rigenera Piano ─────────────────────────────────────────────────

export function rigeneraPiano(
  pianoEsistente: PlanActivity[] | null,
  nuovoProfilo: StudyProfile,
  oggiStr?: string
): PlanActivity[] {
  const oggi = oggiStr ? fromLocalDateStr(oggiStr) : new Date();
  const todayDateStr = toLocalDateStr(oggi);

  const mantenute: PlanActivity[] = [];

  if (pianoEsistente) {
    for (const act of pianoEsistente) {
      if (act.data < todayDateStr) {
        if (act.completata) {
          mantenute.push(act);
        } else {
          // Quelle non completate nel passato diventano "saltate" ed escono dal conteggio
          mantenute.push({ ...act, saltata: true });
        }
      } else {
        if (act.completata) {
          // Attività già completate oggi o nel futuro restano intatte
          mantenute.push(act);
        }
      }
    }
  }

  // Genera da oggi in poi con il nuovo profilo
  const nuoveAttivita = generaPiano(nuovoProfilo, todayDateStr);

  // Evita duplicati di attività già completate per lo stesso slot se presenti
  const dateAreaCompletate = new Set(
    mantenute.filter((m) => m.completata && m.data >= todayDateStr).map((m) => `${m.data}-${m.areaId}`)
  );

  const nuoveFiltrate = nuoveAttivita.filter(
    (n) => !dateAreaCompletate.has(`${n.data}-${n.areaId}`)
  );

  return [...mantenute, ...nuoveFiltrate].sort((a, b) => a.data.localeCompare(b.data));
}

// ── Statistiche Piano ──────────────────────────────────────────────

export function statistichePiano(
  piano: PlanActivity[] | null,
  oggiStr?: string
): PlanStatistics {
  const oggi = oggiStr ? fromLocalDateStr(oggiStr) : new Date();
  const todayDateStr = toLocalDateStr(oggi);

  if (!piano || piano.length === 0) {
    return {
      minutiTotali: 0,
      minutiCompletati: 0,
      percentuale: 0,
      giorniAllEsame: 0,
      prossimaAttivita: null,
      oreTotali: 0,
      settimaneTotali: 0,
    };
  }

  // Escludi le attività saltate
  const valide = piano.filter((a) => !a.saltata);

  let minutiTotali = 0;
  let minutiCompletati = 0;

  for (const a of valide) {
    minutiTotali += a.durataMin;
    if (a.completata) {
      minutiCompletati += a.durataMin;
    }
  }

  const percentuale = minutiTotali > 0 ? Math.round((minutiCompletati / minutiTotali) * 100) : 0;

  // Prossima attività non completata da oggi in poi
  const prossime = valide
    .filter((a) => !a.completata && a.data >= todayDateStr)
    .sort((a, b) => a.data.localeCompare(b.data));

  const prossimaAttivita = prossime.length > 0 ? prossime[0] : null;

  // Ultima data (giorno prima dell'esame o dell'ultima attività)
  const sortedDates = [...valide].sort((a, b) => a.data.localeCompare(b.data));
  const lastDateStr = sortedDates[sortedDates.length - 1]?.data ?? todayDateStr;
  const lastDate = fromLocalDateStr(lastDateStr);

  const diffMs = lastDate.getTime() - oggi.getTime();
  const giorniAllEsame = Math.max(0, Math.ceil(diffMs / (24 * 60 * 60 * 1000)));

  const oreTotali = Math.round((minutiTotali / 60) * 10) / 10;

  // Calcola settimane toccate
  const uniqueDates = new Set(valide.map((v) => v.data));
  const settimaneTotali = Math.max(1, Math.ceil(uniqueDates.size / 3));

  return {
    minutiTotali,
    minutiCompletati,
    percentuale,
    giorniAllEsame,
    prossimaAttivita,
    oreTotali,
    settimaneTotali,
  };
}
