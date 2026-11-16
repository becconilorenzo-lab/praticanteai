export type Section = 'dashboard' | 'palestra' | 'accademia' | 'praticante' | 'biblioteca';
export type Difficulty = 'base' | 'intermedio' | 'avanzato';
export type AccountType = 'patrimoniale' | 'economico';
export type AccountSubtype = 'attivo' | 'passivo' | 'costo' | 'ricavo' | 'netto';
export type Side = 'dare' | 'avere';

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  subtype: AccountSubtype;
  description: string;
  normalBalance: Side;
}

export interface SolutionEntry {
  accountId: string;
  amount: number;
}

export interface Exercise {
  id: string;
  title: string;
  scenario: string;
  availableAccounts: string[];
  solution: {
    dare: SolutionEntry[];
    avere: SolutionEntry[];
  };
  hints: Record<string, string>;
  explanation: string;
  xp: number;
  difficulty: Difficulty;
}

export interface TEntry {
  id: string;
  accountId: string;
  amount: number;
}

export interface VideoLesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: Difficulty;
  youtubeId?: string;
  thumbnail: string;
  tags: string[];
  views: number;
}

// ── Accademia ────────────────────────────────────────────────────────────

export interface DiagnosticQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type DiagnosticLevel = 'base' | 'esperto';

