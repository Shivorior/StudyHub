import React from 'react';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Clock, 
  TrendingUp,
  Sparkles,
  Download
} from 'lucide-react';

export default function StatsOverview({ 
  totalSubjects, 
  totalFiles, 
  totalTutorials,
  totalPdfs,
  totalPpts
}) {
  const stats = [
    {
      label: 'Enrolled Subjects',
      value: totalSubjects,
      detail: 'Active Fall 2026',
      icon: BookOpen,
      color: 'from-violet-500/20 to-indigo-500/20',
      textColor: 'text-violet-400',
      borderColor: 'border-violet-500/30'
    },
    {
      label: 'Class Notes & Slides',
      value: totalFiles,
      detail: `${totalPdfs} PDFs • ${totalPpts} PPTs`,
      icon: FileText,
      color: 'from-rose-500/20 to-amber-500/20',
      textColor: 'text-rose-400',
      borderColor: 'border-rose-500/30'
    },
    {
      label: 'Tutorials & Guides',
      value: totalTutorials,
      detail: 'Video lectures & reads',
      icon: Video,
      color: 'from-sky-500/20 to-teal-500/20',
      textColor: 'text-sky-400',
      borderColor: 'border-sky-500/30'
    },
    {
      label: 'Learning Hours',
      value: '38.5 hrs',
      detail: 'Curated curriculum',
      icon: Clock,
      color: 'from-emerald-500/20 to-green-500/20',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-8">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className={`glass-card p-4 sm:p-5 rounded-2xl border ${stat.borderColor} relative overflow-hidden group hover:scale-[1.02] transition-all duration-200`}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} rounded-bl-full -mr-6 -mt-6 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity`} />
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                {stat.label}
              </span>
              <div className={`p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 ${stat.textColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight mb-1">
              {stat.value}
            </div>

            <p className="text-xs text-zinc-400 font-medium">
              {stat.detail}
            </p>
          </div>
        );
      })}
    </div>
  );
}
