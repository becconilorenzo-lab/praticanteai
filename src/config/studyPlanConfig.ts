export interface AreaConfig {
  id: string;
  label: string;
  importanza: number; // default 1
}

export const AREE_STUDIO: AreaConfig[] = [
  { id: 'contabilita', label: 'Contabilità e Bilancio', importanza: 1 },
  { id: 'tributario', label: 'Diritto Tributario', importanza: 1 },
  { id: 'commerciale', label: 'Diritto Commerciale', importanza: 1 },
  { id: 'revisione', label: 'Revisione e Deontologia', importanza: 1 },
  { id: 'economia', label: 'Economia Aziendale', importanza: 1 },
  { id: 'informatica', label: 'Informatica e Sistemi', importanza: 1 },
];

export type TipoAttivita = 'biblioteca' | 'palestra' | 'simulazione';
export type FaseId = 'apprendimento' | 'pratica' | 'simulazione' | 'ripasso';
export type ObiettivoStudio = 'Partire da zero' | 'Ripassare' | 'Concentrarmi sulle tracce scritte';

export const STUDY_PLAN_CONFIG = {
  giorniValidi: ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'] as const,
  limitiOreSettimana: { min: 2, max: 40 },
  limitiDailyMin: { min: 30, max: 240 },
  bloccoNormaleMinuti: { min: 15, max: 45 },
  simulazioneMinuti: { max: 90, minDailyPerAbilitare: 45 },

  // Percentuali fasi in base a W (settimane)
  fasiPerSettimane: (W: number): { faseId: FaseId; quota: number }[] => {
    if (W >= 8) {
      return [
        { faseId: 'apprendimento', quota: 0.40 },
        { faseId: 'pratica', quota: 0.30 },
        { faseId: 'simulazione', quota: 0.20 },
        { faseId: 'ripasso', quota: 0.10 },
      ];
    }
    if (W >= 4) {
      return [
        { faseId: 'pratica', quota: 0.45 },
        { faseId: 'simulazione', quota: 0.35 },
        { faseId: 'ripasso', quota: 0.20 },
      ];
    }
    if (W >= 2) {
      return [
        { faseId: 'simulazione', quota: 0.50 },
        { faseId: 'ripasso', quota: 0.50 },
      ];
    }
    return [
      { faseId: 'ripasso', quota: 1.00 },
    ];
  },

  // Mix standard non-simulazione (biblioteca / palestra)
  mixAttivitaPerFase: {
    apprendimento: { biblioteca: 0.60, palestra: 0.40 },
    pratica:       { biblioteca: 0.20, palestra: 0.80 },
    simulazione:   { biblioteca: 0.10, palestra: 0.90 },
    ripasso:       { biblioteca: 0.20, palestra: 0.80 },
  } as Record<FaseId, { biblioteca: number; palestra: number }>,

  // Frequenza simulazioni per fase
  simulazioniPerFase: {
    apprendimento: { attiva: false, frequenzaSettimane: 0 },
    pratica:       { attiva: true,  frequenzaSettimane: 2 }, // settimane pari (2, 4...)
    simulazione:   { attiva: true,  frequenzaSettimane: 1 }, // ogni settimana
    ripasso:       { attiva: true,  frequenzaSettimane: 1 }, // ogni settimana
  } as Record<FaseId, { attiva: boolean; frequenzaSettimane: number }>,
};
