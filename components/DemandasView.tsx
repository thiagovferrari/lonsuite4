import React, { useState } from 'react';
import { Demand, Project } from '../types';
import { matchDemandToProject } from '../services/geminiService';
import { Circle, Loader2, Sparkles, Folder, Calendar as CalendarIcon, Plus, Check } from 'lucide-react';

interface DemandasViewProps {
  demands: Demand[];
  setDemands: React.Dispatch<React.SetStateAction<Demand[]>>;
  projects: Project[];
}

// Date classification
const classifyDate = (dateStr?: string): 'overdue' | 'today' | 'tomorrow' | 'future' | 'none' => {
  if (!dateStr) return 'none';
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(dateStr + 'T00:00:00');
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (due < today) return 'overdue';
  if (due.getTime() === today.getTime()) return 'today';
  if (due.getTime() === tomorrow.getTime()) return 'tomorrow';
  return 'future';
};

const dateColorMap: Record<string, string> = {
  overdue: 'text-red-500',
  today: 'text-emerald-600',
  tomorrow: 'text-[#1d1d1f]',
  future: 'text-[#86868b]',
  none: 'text-[#86868b]',
};

const datePriority: Record<string, number> = {
  overdue: 0,
  today: 1,
  tomorrow: 2,
  future: 3,
  none: 4,
};

export const DemandasView = ({ demands, setDemands, projects }: DemandasViewProps) => {
  const [intentTitle, setIntentTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Only show pending demands
  const pendingDemands = demands
    .filter(d => d.status === 'Pendente')
    .sort((a, b) => {
      const classA = classifyDate(a.dueDate);
      const classB = classifyDate(b.dueDate);
      if (datePriority[classA] !== datePriority[classB]) return datePriority[classA] - datePriority[classB];
      // Within same class, sort by date ascending
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
      if (a.dueDate) return -1;
      return 1;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsLoading(true);
    let matchedProjectId: string | undefined = undefined;

    if (intentTitle.trim() && projects.length > 0) {
      const match = await matchDemandToProject(intentTitle, description, projects);
      if (match) matchedProjectId = match;
    }

    const newDemand: Demand = {
      id: crypto.randomUUID(),
      intentProjectTitle: intentTitle,
      description,
      dueDate,
      priority: 'media',
      status: 'Pendente',
      projectId: matchedProjectId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setDemands([newDemand, ...demands]);

    setIntentTitle('');
    setDescription('');
    setDueDate('');
    setIsLoading(false);
  };

  const handleComplete = (demand: Demand) => {
    if (demand.projectId) {
      // Has project: mark as done (stays in data for project view)
      setDemands(prev => prev.map(d => d.id === demand.id ? {
        ...d,
        status: 'Concluído' as const,
        updatedAt: new Date().toISOString()
      } : d));
    } else {
      // No project: delete permanently
      setDemands(prev => prev.filter(d => d.id !== demand.id));
    }
  };

  const getMatchedProjectName = (projectId?: string) => {
    if (!projectId) return null;
    return projects.find(p => p.id === projectId)?.name || null;
  };

  const formatDueLabel = (dateStr?: string) => {
    if (!dateStr) return null;
    const cls = classifyDate(dateStr);
    if (cls === 'overdue') {
      const due = new Date(dateStr + 'T00:00:00');
      const now = new Date();
      const diff = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
      return `${diff}d atrasada`;
    }
    if (cls === 'today') return 'Hoje';
    if (cls === 'tomorrow') return 'Amanhã';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="px-5 sm:px-10 md:px-12 pt-8 md:pt-10 pb-10 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extralight tracking-tight text-[#1d1d1f]">
          Demandas
        </h1>
        <p className="text-[11px] font-medium text-[#86868b] tracking-wider mt-1.5">
          {pendingDemands.length} {pendingDemands.length === 1 ? 'tarefa pendente' : 'tarefas pendentes'}
        </p>
      </div>

      {/* Minimal Form */}
      <form onSubmit={handleSubmit} className="mb-10">
        <div className="bg-white border border-black/6 rounded-apple-xl shadow-apple overflow-hidden">
          <div className="flex items-center">
            <div className="shrink-0 pl-4">
              <Plus size={16} className="text-[#aeaeb2]" />
            </div>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="O que precisa ser feito?"
              required
              className="flex-1 py-4 px-3 text-[14px] outline-none bg-transparent placeholder:text-[#aeaeb2]"
            />
          </div>
          {/* Expandable row */}
          <div className="flex items-center gap-3 px-4 pb-3 pt-0">
            <div className="relative flex-1">
              <Folder className="w-3.5 h-3.5 text-[#aeaeb2] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={intentTitle}
                onChange={e => setIntentTitle(e.target.value)}
                placeholder="Projeto (IA)"
                className="w-full bg-[#f5f5f7] border border-black/4 rounded-apple py-2 pl-8 pr-3 text-[12px] outline-none focus:border-[#0071e3]/30 transition-all"
              />
            </div>
            <div className="relative w-36">
              <CalendarIcon className="w-3.5 h-3.5 text-[#aeaeb2] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-black/4 rounded-apple py-2 pl-8 pr-2 text-[12px] outline-none focus:border-[#0071e3]/30 transition-all text-[#86868b]"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !description.trim()}
              className="px-4 py-2 btn-ai rounded-apple text-[11px] font-semibold disabled:opacity-50 flex items-center gap-1.5 shrink-0"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles size={12} />}
              Registrar
            </button>
          </div>
        </div>
      </form>

      {/* Demand List */}
      {pendingDemands.length === 0 ? (
        <div className="text-center py-16 text-[#aeaeb2]">
          <Check size={32} className="mx-auto mb-3 opacity-20" />
          <p className="text-[13px] font-medium">Tudo em dia</p>
          <p className="text-[11px] mt-1">Nenhuma demanda pendente</p>
        </div>
      ) : (
        <div className="space-y-px">
          {pendingDemands.map(demand => {
            const projectName = getMatchedProjectName(demand.projectId);
            const cls = classifyDate(demand.dueDate);
            const color = dateColorMap[cls];
            const dueLabel = formatDueLabel(demand.dueDate);

            return (
              <div
                key={demand.id}
                className="flex items-center gap-3 py-3 px-1 group hover:bg-white/60 rounded-apple transition-all"
              >
                {/* Check button */}
                <button
                  onClick={() => handleComplete(demand)}
                  className="shrink-0 w-5 h-5 rounded-full border-[1.5px] border-[#d1d1d6] flex items-center justify-center text-transparent hover:border-emerald-400 hover:text-emerald-400 hover:bg-emerald-50 transition-all"
                >
                  <Check size={11} strokeWidth={2.5} />
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] leading-snug ${color}`}>
                    {projectName && (
                      <span className="font-bold text-[#1d1d1f]">{projectName} · </span>
                    )}
                    {demand.description}
                  </p>
                </div>

                {/* Due date label */}
                {dueLabel && (
                  <span className={`text-[10px] font-semibold shrink-0 ${color}`}>
                    {dueLabel}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
