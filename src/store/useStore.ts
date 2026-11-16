import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { PlanActivity } from '../utils/planGenerator';
import type { TrackKey } from '../data/exerciseGenerator1000';
import { saveProgress } from '../lib/progressSync';

export interface PalestraDraftEntry {
  id: string;
  code: string;
  name: string;
  amount: number;
  type: 'DARE' | 'AVERE';
}

export interface PalestraDraft {
  track: TrackKey;
  exerciseIndex: number;
  dare: PalestraDraftEntry[];
  avere: PalestraDraftEntry[];
}

export type Difficulty = 'easy' | 'medium' | 'hard';
export type FlashcardRating = 'padroneggiato' | 'dubbio' | 'da_rivedere';

export interface SimulationRecord {
  id: string;
  date: string;
  trackTitle: string;
  score: number;
  feedback: string;
}

export type Goal = 'Partire da zero' | 'Ripassare' | 'Concentrarmi sulle tracce scritte';
export interface StudyProfile {
  dataEsame: string; // YYYY-MM-DD
  oreSettimana: number;
  giorniStudio: string[];
  obiettivo: Goal;
  livelli: Record<string, number>; // areaId: 1-5
  dataCreazione: string;
}

// Cloud sync: current logged-in userId (set by App.tsx on auth change)
let _syncUserId: string | null = null;
export function setSyncUserId(id: string | null) {
  _syncUserId = id;
}

function triggerSync(state: AccuracyState) {
  if (!_syncUserId) return;
  const partial = {
    schemaVersion: state.schemaVersion,
    accuracyIndex: state.accuracyIndex,
    completedExerciseIds: state.completedExerciseIds,
    simulationHistory: state.simulationHistory,
    attemptCount: state.attemptCount,
    simulationCount: state.simulationCount,
    studyProfile: state.studyProfile,
    studyPlan: state.studyPlan,
    areaStats: state.areaStats,
    flashcardRatings: state.flashcardRatings,
    lastShownTracciaByArea: state.lastShownTracciaByArea,
    palestraTrack: state.palestraTrack,
    palestraTrackIndices: state.palestraTrackIndices,
    palestraDraft: state.palestraDraft,
  };
  saveProgress(_syncUserId, partial);
}

interface AccuracyState {
  // Schema version for persistence migrations
  schemaVersion: number;
  // Existing fields
  accuracyIndex: number | null;
  completedExerciseIds: string[];
  simulationHistory: SimulationRecord[];
  attemptCount: number;
  simulationCount: number;
  flashcardRatings: Record<string, FlashcardRating>;
  lastShownTracciaByArea?: Record<string, string>;
  // Profile & Plan state
  studyProfile: StudyProfile | null;
  studyPlan: PlanActivity[] | null;
  areaStats: Record<string, { attempts: number; errors: number }>;
  // Palestra state
  palestraTrack: TrackKey;
  palestraTrackIndices: Record<string, number>;
  palestraDraft: PalestraDraft | null;
  // Methods
  setPalestraTrack: (track: TrackKey) => void;
  setPalestraTrackIndex: (track: TrackKey, index: number) => void;
  advancePalestraExercise: (track: TrackKey) => void;
  prevPalestraExercise: (track: TrackKey) => void;
  setPalestraDraft: (draft: PalestraDraft | null) => void;
  setStudyProfileAndPlan: (profile: StudyProfile | null, plan: PlanActivity[] | null) => void;
  loadFromCloud: (cloudState: Partial<AccuracyState>) => void;
  toggleActivityCompletion: (activityId: string) => void;
  recordAreaAttempt: (area: string, isCorrect: boolean) => void;
  setLastShownTraccia: (areaKey: string, title: string) => void;
  // Existing methods
  recordAttempt: (exerciseId: string, difficulty: Difficulty, isCorrect: boolean) => void;
  recordFlashcardRating: (cardId: string, rating: FlashcardRating) => void;
  resetFlashcardRatings: () => void;
  resetAccuracy: () => void;
  submitSimulation: (trackId: string, trackTitle: string, userText: string) => SimulationRecord;
  recordSimulationEvaluation: (trackId: string, trackTitle: string, scorePercent: number) => SimulationRecord;
  incrementSimulation: () => void;
}

// Existing constants
const CORRECT_INCREMENT = 0.10;
const WRONG_PENALTY = 0.10;
const SIM_FAIL_PENALTY = 8;

const FLASHCARD_DELTAS: Record<FlashcardRating, number> = {
  padroneggiato: 0.10,
  dubbio: 0.02,
  da_rivedere: -0.10,
};

function clamp2(value: number): number {
  const clamped = Math.max(0, Math.min(100, value));
  return Math.round(clamped * 100) / 100;
}

export const useStore = create<AccuracyState>()(
  persist(
    (set, get) => ({
      // Schema version
      schemaVersion: 2,
      // Existing fields
      accuracyIndex: null,
      completedExerciseIds: [],
      simulationHistory: [],
      attemptCount: 0,
      simulationCount: 0,
      flashcardRatings: {},
      lastShownTracciaByArea: {},
      // New profile state
      studyProfile: null,
      studyPlan: null,
      areaStats: {},
      // Palestra state
      palestraTrack: 'base' as TrackKey,
      palestraTrackIndices: { base: 0, intermedio: 0, avanzato: 0 },
      palestraDraft: null,
      // Methods
      setPalestraTrack: (track) => {
        set({ palestraTrack: track });
        triggerSync({ ...get(), palestraTrack: track });
      },
      setPalestraTrackIndex: (track, index) => {
        set((s) => {
          const nextIndices = { ...(s.palestraTrackIndices || {}), [track]: Math.max(0, index) };
          const updated = { ...s, palestraTrackIndices: nextIndices };
          triggerSync(updated);
          return { palestraTrackIndices: nextIndices };
        });
      },
      advancePalestraExercise: (track) => {
        set((s) => {
          const currentIndex = s.palestraTrackIndices?.[track] ?? 0;
          const nextIndex = currentIndex + 1;
          const nextIndices = { ...(s.palestraTrackIndices || {}), [track]: nextIndex };
          const nextDraft = (s.palestraDraft && s.palestraDraft.track === track && s.palestraDraft.exerciseIndex === currentIndex)
            ? null
            : s.palestraDraft;
          const updated = { ...s, palestraTrackIndices: nextIndices, palestraDraft: nextDraft };
          triggerSync(updated);
          return { palestraTrackIndices: nextIndices, palestraDraft: nextDraft };
        });
      },
      prevPalestraExercise: (track) => {
        set((s) => {
          const currentIndex = s.palestraTrackIndices?.[track] ?? 0;
          if (currentIndex <= 0) return {};
          const nextIndex = currentIndex - 1;
          const nextIndices = { ...(s.palestraTrackIndices || {}), [track]: nextIndex };
          const updated = { ...s, palestraTrackIndices: nextIndices };
          triggerSync(updated);
          return { palestraTrackIndices: nextIndices };
        });
      },
      setPalestraDraft: (draft) => {
        set({ palestraDraft: draft });
        triggerSync({ ...get(), palestraDraft: draft });
      },
      setStudyProfileAndPlan: (profile, plan) => set({ studyProfile: profile, studyPlan: plan }),
      loadFromCloud: (cloudState) => set((s) => ({ ...s, ...cloudState })),
      setLastShownTraccia: (areaKey, title) =>
        set((s) => ({
          lastShownTracciaByArea: {
            ...(s.lastShownTracciaByArea || {}),
            [areaKey]: title,
          },
        })),
      toggleActivityCompletion: (activityId) => {
        set((state) => {
          if (!state.studyPlan) return {};
          return {
            studyPlan: state.studyPlan.map((act) =>
              act.id === activityId ? { ...act, completata: !act.completata } : act
            ),
          };
        });
      },
      recordAreaAttempt: (area, isCorrect) => {
        const state = get();
        const currentStats = state.areaStats[area] ?? { attempts: 0, errors: 0 };
        const nextAttempts = currentStats.attempts + 1;
        const nextErrors = currentStats.errors + (isCorrect ? 0 : 1);
        const errorRate = nextErrors / nextAttempts;

        const updatedStats = {
          ...state.areaStats,
          [area]: { attempts: nextAttempts, errors: nextErrors },
        };

        // If error rate exceeds 40% with at least 3 attempts, automatically adjust level down
        let updatedProfile = state.studyProfile;
        if (state.studyProfile && nextAttempts >= 3 && errorRate > 0.40) {
          const currentLevel = state.studyProfile.livelli[area] ?? 3;
          if (currentLevel > 1) {
            updatedProfile = {
              ...state.studyProfile,
              livelli: {
                ...state.studyProfile.livelli,
                [area]: currentLevel - 1,
              },
            };
          }
        }

        set({
          areaStats: updatedStats,
          studyProfile: updatedProfile,
        });
      },


      recordAttempt: (exerciseId, _difficulty, isCorrect) => {
        const state = get();
        const nextAttempt = state.attemptCount + 1;
        const current = state.accuracyIndex ?? 0;

        if (!isCorrect) {
          set({
            attemptCount: nextAttempt,
            accuracyIndex: clamp2(current - WRONG_PENALTY),
          });
          triggerSync({ ...get() });
          return;
        }

        const isNew = !state.completedExerciseIds.includes(exerciseId);
        const nextCompleted = isNew
          ? [...state.completedExerciseIds, exerciseId]
          : state.completedExerciseIds;

        set({
          attemptCount: nextAttempt,
          completedExerciseIds: nextCompleted,
          accuracyIndex: clamp2(current + CORRECT_INCREMENT),
        });
        triggerSync({ ...get() });
      },

      recordFlashcardRating: (cardId, rating) => {
        const state = get();
        const prevRating = state.flashcardRatings?.[cardId];
        if (prevRating === rating) return;

        const prevDelta = prevRating ? FLASHCARD_DELTAS[prevRating] : 0;
        const newDelta = FLASHCARD_DELTAS[rating];
        const netChange = newDelta - prevDelta;

        const current = state.accuracyIndex ?? 0;
        const isNew = !prevRating;

        set({
          accuracyIndex: clamp2(current + netChange),
          attemptCount: isNew ? state.attemptCount + 1 : state.attemptCount,
          flashcardRatings: {
            ...(state.flashcardRatings || {}),
            [cardId]: rating,
          },
        });
      },

      resetFlashcardRatings: () => {
        set({ flashcardRatings: {} });
      },

      resetAccuracy: () => {
        set({ accuracyIndex: null, flashcardRatings: {}, completedExerciseIds: [], attemptCount: 0 });
      },

      submitSimulation: (trackId, trackTitle, userText) => {
        const wordCount = userText.trim().split(/\s+/).filter(Boolean).length;
        const charCount = userText.trim().length;

        let score: number;
        if (charCount === 0) {
          score = 12;
        } else {
          const base = Math.min(wordCount / 3, 30);
          const lengthBonus = Math.min(charCount / 100, 10);
          const seed = (trackId.charCodeAt(0) || 1) + wordCount;
          const variance = ((seed * 9301 + 49297) % 233280) / 233280;
          const jitter = variance * 18 - 9;
          score = Math.round(Math.max(1, Math.min(60, 18 + base + lengthBonus + jitter)));
        }

        const passed = score >= 36;
        const feedback = passed
          ? 'Superato'
          : 'Non superato';

        const record: SimulationRecord = {
          id: `sim-${Date.now()}`,
          date: new Date().toISOString(),
          trackTitle,
          score,
          feedback,
        };

        set((state) => {
          let newAccuracy = state.accuracyIndex ?? 0;
          if (!passed) {
            newAccuracy = clamp2(newAccuracy - SIM_FAIL_PENALTY);
          } else {
            newAccuracy = clamp2(newAccuracy + Math.min(score - 36, 3));
          }
          return {
            simulationHistory: [...state.simulationHistory, record],
            accuracyIndex: newAccuracy,
          };
        });

        return record;
      },

      recordSimulationEvaluation: (trackId, trackTitle, scorePercent) => {
        const passed = scorePercent >= 60;
        const feedback = passed ? 'Superato' : 'Da rivedere';

        const record: SimulationRecord = {
          id: `sim-${trackId}`,
          date: new Date().toISOString(),
          trackTitle,
          score: scorePercent,
          feedback,
        };

        set((state) => {
          const existingIndex = state.simulationHistory.findIndex((s) => s.id === `sim-${trackId}`);
          const prevRecord = existingIndex >= 0 ? state.simulationHistory[existingIndex] : null;

          const updatedHistory = existingIndex >= 0
            ? state.simulationHistory.map((s, idx) => (idx === existingIndex ? record : s))
            : [...state.simulationHistory, record];

          // Variazione graduale accuratezza: +0.10 se superato, -0.10 se da rivedere
          const prevDelta = prevRecord ? (prevRecord.score >= 60 ? 0.10 : -0.10) : 0;
          const newDelta = passed ? 0.10 : -0.10;
          const netDelta = newDelta - prevDelta;

          const currentAcc = state.accuracyIndex ?? 0;
          const newAccuracy = clamp2(currentAcc + netDelta);

          return {
            simulationHistory: updatedHistory,
            accuracyIndex: newAccuracy,
          };
        });

        return record;
      },

      incrementSimulation: () => set((s) => {
        const next = { ...s, simulationCount: s.simulationCount + 1 };
        triggerSync(next as AccuracyState);
        return { simulationCount: next.simulationCount };
      }),
    }),
    {
      name: 'praticante-ai-store',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        // One-time migration: if version < 2 or missing required fields, reset profile & plan
        if (
          !version ||
          version < 2 ||
          !persistedState?.studyProfile?.dataEsame ||
          !persistedState?.studyProfile?.livelli
        ) {
          return {
            ...persistedState,
            schemaVersion: 2,
            studyProfile: null,
            studyPlan: null,
          };
        }
        return persistedState;
      },
      partialize: (s) => ({
        schemaVersion: s.schemaVersion,
        accuracyIndex: s.accuracyIndex,
        completedExerciseIds: s.completedExerciseIds,
        simulationHistory: s.simulationHistory,
        attemptCount: s.attemptCount,
        simulationCount: s.simulationCount,
        studyProfile: s.studyProfile,
        studyPlan: s.studyPlan,
        areaStats: s.areaStats,
        flashcardRatings: s.flashcardRatings,
        lastShownTracciaByArea: s.lastShownTracciaByArea,
        palestraTrack: s.palestraTrack,
        palestraTrackIndices: s.palestraTrackIndices,
        palestraDraft: s.palestraDraft,
      }),
    }
  )
);
