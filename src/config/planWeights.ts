// The thematic areas for the exam
export const AREE_TEMATICHE = [
  { id: 'contabilita', label: 'Contabilità e Bilancio', defaultWeight: 0.25 },
  { id: 'tributario', label: 'Diritto Tributario', defaultWeight: 0.25 },
  { id: 'commerciale', label: 'Diritto Commerciale', defaultWeight: 0.15 },
  { id: 'revisione', label: 'Revisione e Deontologia', defaultWeight: 0.15 },
  { id: 'economia', label: 'Economia Aziendale', defaultWeight: 0.10 },
  { id: 'informatica', label: 'Informatica e Sistemi', defaultWeight: 0.10 },
] as const;

export type AreaId = (typeof AREE_TEMATICHE)[number]['id'];

// Phase distribution (percentage of total weeks)
export const PHASE_CONFIG = {
  apprendimento: { label: 'Apprendimento', fraction: 0.30, module: 'accademia' as const },
  pratica: { label: 'Pratica', fraction: 0.30, module: 'palestra' as const },
  simulazione: { label: 'Simulazione', fraction: 0.25, module: 'praticante' as const },
  ripasso: { label: 'Ripasso Finale', fraction: 0.15, module: 'palestra' as const },
} as const;

export type PhaseId = keyof typeof PHASE_CONFIG;

// Level-to-weight multiplier: lower level = more hours needed
export const LEVEL_MULTIPLIERS: Record<number, number> = {
  1: 2.0,
  2: 1.5,
  3: 1.0,
  4: 0.7,
  5: 0.4,
};

// Module mapping for activities
export type ModuleId = 'palestra' | 'accademia' | 'praticante' | 'biblioteca';
