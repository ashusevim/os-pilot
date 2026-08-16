import React, { useState, useEffect, useRef } from 'react';
import { Trophy, GitPullRequest, GraduationCap, Compass } from 'lucide-react';

function useCountUp(target, duration = 800) {
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
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    prevTarget.current = target;
  }, [target, duration]);

  return value;
}

export default function StatsOverview({ kanbanItems = [], completedLessons = [] }) {
  const merged = kanbanItems.filter(i => i.status === 'merged').length;
  const inProgress = kanbanItems.filter(i => i.status === 'in_progress' || i.status === 'exploring').length;
  const prSubmitted = kanbanItems.filter(i => i.status === 'pr_submitted').length;
  const totalTracked = kanbanItems.length;

  const mergedDisplay = useCountUp(merged);
  const activeDisplay = useCountUp(inProgress + prSubmitted);
  const academyDisplay = useCountUp(completedLessons.length);
  const pipelineDisplay = useCountUp(totalTracked);

  const motivationalMessage = () => {
    if (merged >= 3) return '🔥 Open source veteran! Keep shipping.';
    if (merged >= 1) return '🎉 First PR merged! You belong here.';
    if (totalTracked >= 3) return '👀 Great exploration — pick one to start!';
    if (totalTracked >= 1) return '📌 Nice find! Inspect and start contributing.';
    return '🚀 Discover your first issue below!';
  };

  const stats = [
    {
      label: 'Merged',
      value: mergedDisplay,
      sub: merged === 0 ? 'Your first is waiting!' : `${merged} contribution${merged > 1 ? 's' : ''}`,
      icon: Trophy,
      gradient: 'from-emerald-950/40 to-slate-950',
      borderColor: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/20 text-emerald-300',
      textColor: 'text-emerald-400'
    },
    {
      label: 'Active',
      value: activeDisplay,
      sub: `${prSubmitted} awaiting review`,
      icon: GitPullRequest,
      gradient: 'from-indigo-950/40 to-slate-950',
      borderColor: 'border-indigo-500/30',
      iconBg: 'bg-indigo-500/20 text-indigo-300',
      textColor: 'text-indigo-400'
    },
    {
      label: 'Academy',
      value: academyDisplay,
      sub: `of 6 modules`,
      icon: GraduationCap,
      gradient: 'from-slate-900 to-slate-950',
      borderColor: 'border-slate-800',
      iconBg: 'bg-cyan-500/20 text-cyan-300',
      textColor: 'text-cyan-400'
    },
    {
      label: 'Pipeline',
      value: pipelineDisplay,
      sub: 'tracked issues',
      icon: Compass,
      gradient: 'from-slate-900 to-slate-950',
      borderColor: 'border-slate-800',
      iconBg: 'bg-purple-500/20 text-purple-300',
      textColor: 'text-purple-400'
    }
  ];

  return (
    <div className="mb-5 sm:mb-6 space-y-3">
      {/* Motivational message strip */}
      <div className="text-[11px] sm:text-xs text-slate-400 px-1">
        {motivationalMessage()}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${s.gradient} border ${s.borderColor}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] sm:text-xs font-bold ${s.textColor}`}>{s.label}</span>
                <div className={`p-1 sm:p-1.5 rounded-lg ${s.iconBg}`}>
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-white count-up">
                {s.value}
              </div>
              <p className="text-[9px] sm:text-[11px] text-slate-400 mt-0.5">{s.sub}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
