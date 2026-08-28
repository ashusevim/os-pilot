import React, { useState, useEffect, useRef } from 'react';
import { Trophy, GitPullRequest, GraduationCap, Bookmark } from 'lucide-react';

function useCountUp(target, duration = 600) {
  const [value, setValue] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    const start = prevTarget.current;
    const diff = target - start;
    if (diff === 0) return;

    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    prevTarget.current = target;
  }, [target, duration]);

  return value;
}

export default function StatsOverview({ kanbanItems = [], completedLessons = [], onNavigate }) {
  const merged = kanbanItems.filter(i => i.status === 'merged').length;
  const inProgress = kanbanItems.filter(i => i.status === 'in_progress' || i.status === 'exploring' || i.status === 'pr_submitted').length;
  const totalTracked = kanbanItems.length;

  const mergedDisplay = useCountUp(merged);
  const activeDisplay = useCountUp(inProgress);
  const academyDisplay = useCountUp(completedLessons.length);
  const savedDisplay = useCountUp(totalTracked);

  const stats = [
    { label: 'Merged', value: mergedDisplay, icon: Trophy, tab: 'kanban' },
    { label: 'In flight', value: activeDisplay, icon: GitPullRequest, tab: 'kanban' },
    { label: 'Academy', value: academyDisplay, suffix: '/6', icon: GraduationCap, tab: 'academy' },
    { label: 'Saved', value: savedDisplay, icon: Bookmark, tab: 'kanban' },
  ];

  return (
    <div className="mb-8 flex flex-wrap items-center gap-x-1 gap-y-2">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <React.Fragment key={s.label}>
            {i > 0 && <span className="hidden sm:inline text-zinc-700 px-2">·</span>}
            <button
              type="button"
              onClick={() => onNavigate?.(s.tab)}
              className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition"
            >
              <Icon className="w-3.5 h-3.5 text-zinc-500" />
              <span>{s.label}</span>
              <span className="font-semibold tabular-nums text-zinc-100">
                {s.value}{s.suffix || ''}
              </span>
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
