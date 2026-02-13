import React from 'react';
import { AppView } from '../types';
import { useExerciseEngineSnapshot } from '../utils/useExerciseEngineData';

interface Props {
  onNavigate: (view: AppView) => void;
}

const AdminExerciseEngineScreen: React.FC<Props> = ({ onNavigate }) => {
  const snapshot = useExerciseEngineSnapshot();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display px-4 pt-12 pb-8">
      <div className="max-w-md mx-auto space-y-4">
        <button
          onClick={() => onNavigate(AppView.ADMIN_DASHBOARD)}
          className="h-10 px-4 rounded-xl border border-slate-300 text-sm font-semibold"
        >
          Back to Admin
        </button>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h1 className="text-lg font-semibold">Exercise Engine Check</h1>
          <p className="mt-1 text-xs text-slate-500">Read-only verification for Phase 0 data contract.</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-sm space-y-2">
          <p><span className="font-semibold">Status:</span> {snapshot.loading ? 'Loading...' : 'Loaded'}</p>
          <p><span className="font-semibold">Exercises:</span> {snapshot.exercises.length}</p>
          <p><span className="font-semibold">Movement exercises:</span> {snapshot.movementCount}</p>
          <p><span className="font-semibold">Wellness exercises:</span> {snapshot.wellnessCount}</p>
          <p><span className="font-semibold">Categories:</span> {snapshot.categories.join(', ') || 'None'}</p>
          <p><span className="font-semibold">System config:</span> {snapshot.systemConfig ? 'Present' : 'Missing'}</p>
          <p><span className="font-semibold">Payload valid:</span> {snapshot.isPayloadValid ? 'Yes' : 'No'}</p>
        </section>

        {!snapshot.isPayloadValid && (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 space-y-1">
            <p className="font-semibold">Validation errors</p>
            {snapshot.validationErrors.map((error) => (
              <p key={error}>- {error}</p>
            ))}
          </section>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">
            Paywall behavior remains disabled in MVP UI/logic, even if monetization config exists in `systemConfig`.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AdminExerciseEngineScreen;
