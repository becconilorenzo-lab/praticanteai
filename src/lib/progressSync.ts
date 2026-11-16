import { supabase } from './supabase';

export type SyncableState = {
  schemaVersion?: number;
  accuracyIndex?: number | null;
  completedExerciseIds?: string[];
  simulationHistory?: unknown[];
  attemptCount?: number;
  simulationCount?: number;
  studyProfile?: unknown;
  studyPlan?: unknown;
  areaStats?: unknown;
  flashcardRatings?: unknown;
  lastShownTracciaByArea?: unknown;
  palestraTrack?: string;
  palestraTrackIndices?: Record<string, number>;
  palestraDraft?: unknown;
};

export async function saveProgress(userId: string, state: SyncableState): Promise<void> {
  try {
    await supabase.from('user_progress').upsert({
      user_id: userId,
      store_state: state,
      updated_at: new Date().toISOString(),
    });
  } catch {
    // Fire-and-forget: ignore sync errors to not disrupt UX
  }
}

export async function loadProgress(userId: string): Promise<SyncableState | null> {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('store_state')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) return null;
    return data.store_state as SyncableState;
  } catch {
    return null;
  }
}
