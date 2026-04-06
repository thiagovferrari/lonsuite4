import React, { useState, useEffect, useRef } from 'react';
import { Project, ProjectLink, ProjectScheduleItem, Attachment, Demand } from '../types';
import { chatWithProjectAI, summarizeProjectDemands } from '../services/geminiService';
import { Plus, ChevronLeft, Send, Sparkles, Folder, Calendar, Link as LinkIcon, FileText, Clock, CheckCircle2, Circle, MoreVertical, Trash2, Type as TypeIcon, Bot, CheckSquare, Edit2, User, Loader2, Upload, Table } from 'lucide-react';

interface ProjectsViewProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  demands: Demand[];
  setDemands: React.Dispatch<React.SetStateAction<Demand[]>>;
}

type TabType = 'geral' | 'cronograma' | 'arquivos' | 'demandas';

export const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, setProjects, demands, setDemands }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('geral');
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  // AI Chat State
  const [chatMessages, setChatMessages] = useState<{ role: string; parts: { text: string }[] }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const lastSummarizedProjectId = useRef<string | null>(null);

  // Auto-summarize Demands
  useEffect(() => {
    const runSummary = async () => {
      if (selectedProject && selectedProject.autoSummarizeDemands !== false) {
        const projectDemands = demands.filter(d => d.projectId === selectedProject.id).slice(0, 5);
        if (projectDemands.length === 0) return;
        
        setIsSummaryLoading(true);
        const summary = await summarizeProjectDemands(selectedProject, projectDemands);
        
        setProjects(prev => prev.map(pr => pr.id === selectedProject.id ? { ...pr, demandsSummary: summary } : pr));
        setSelectedProject(prev => prev?.id === selectedProject.id ? { ...prev, demandsSummary: summary } : prev);
        setIsSummaryLoading(false);
      }
    };
    
    if (selectedProject?.id && selectedProject.id !== lastSummarizedProjectId.current) {
      lastSummarizedProjectId.current = selectedProject.id;
      runSummary();
    }
  }, [selectedProject?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    const now = new Date().toISOString();
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: newProjectName,
      description: '',
      date: now,
      links: [],
      attachments: [],
      schedule: [],
      designSystem: { colors: [], typography: 'Inter', notes: '' },
      createdAt: now,
      updatedAt: now
    };
    setProjects(prev => [newProject, ...prev]);
    setNewProjectName('');
    setIsCreating(false);
    setSelectedProject(newProject);
    setChatMessages([]);
  };

  const updateSelectedProject = (updated: Project) => {
    const withTimestamp = { ...updated, updatedAt: new Date().toISOString() };
    setSelectedProject(withTimestamp);
    setProjects(prev => prev.map(p => p.id === updated.id ? withTimestamp : p));
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      setProjects(prev => prev.filter(p => p.id !== id));
      if (selectedProject?.id === id) setSelectedProject(null);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedProject) return;
    const message = chatInput;
    setChatInput('');
    
    const newUserMsg = { role: 'user', parts: [{ text: message }] };
    setChatMessages(prev => [...prev, newUserMsg]);
    setIsChatLoading(true);

    const response = await chatWithProjectAI(selectedProject, message, chatMessages);
    
    setChatMessages(prev => [...prev, { role: 'model', parts: [{ text: response }] }]);
    setIsChatLoading(false);
  };

  if (!selectedProject) {
    return (
      <div className="w-full h-full flex flex-col p-8 lg:p-12 overflow-y-auto no-scrollbar pb-32">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-medium text-slate-900 tracking-tight">Projetos</h1>
              <p className="text-sm text-slate-500 mt-1">Gerencie seus projetos, cronogramas e converse com a IA dedicada.</p>
            </div>
            <button 
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-sm"
            >
              <Plus size={18} /> Novo Projeto
            </button>
          </div>

          {isCreating && (
            <div className="mb-8 p-6 glass rounded-2xl border border-black/5 animate-fade-in flex items-center gap-4">
              <input 
                autoFocus
                type="text"
                placeholder="Nome do Novo Projeto..."
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreateProject()}
                className="flex-1 bg-transparent text-xl font-medium outline-none placeholder:text-slate-300 text-slate-800"
              />
              <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">Cancelar</button>
              <button onClick={handleCreateProject} className="px-5 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">Criar</button>
            </div>
          )}

          {projects.length === 0 && !isCreating ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                <Folder size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">Nenhum projeto encontrado</h3>
              <p className="text-sm">Comece criando seu primeiro projeto para gerenciar campanhas e tarefas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <div 
                  key={project.id} 
                  onClick={() => { setSelectedProject(project); setChatMessages([]); }}
                  className="group relative p-6 glass rounded-3xl border border-black/5 hover:border-blue-500/20 hover:shadow-lg transition-all cursor-pointer bg-white/40 hover:bg-white/60"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mb-5 text-blue-500">
                    <Folder size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{project.name}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">{project.description || 'Sem descrição'}</p>
                  
                  <div className="mt-6 flex items-center gap-4 text-xs font-medium text-slate-400">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(project.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {project.schedule.length} Tarefas</span>
                  </div>

                  <button onClick={(e) => handleDeleteProject(project.id, e)} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-[#fafafa]">
      <div className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar border-r border-black/5">
        <div className="p-8 lg:p-12 pb-32 max-w-4xl mx-auto w-full">
          <button 
            onClick={() => setSelectedProject(null)}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors mb-10"
          >
            <ChevronLeft size={16} /> Voltar para Projetos
          </button>

          <input 
            value={selectedProject.name}
            onChange={e => updateSelectedProject({...selectedProject, name: e.target.value})}
            className="w-full text-4xl font-semibold tracking-tight text-slate-900 bg-transparent outline-none placeholder:text-slate-300 mb-2"
            placeholder="Nome do Projeto"
          />
          
          <div className="flex flex-wrap gap-2 mb-10 border-b border-black/5 pb-6">
            {(['geral', 'cronograma', 'arquivos', 'demandas'] as TabType[]).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-sm' : 'bg-transparent text-slate-500 hover:bg-black/5'}`}
              >
                {tab === 'geral' && 'Visão Geral'}
                {tab === 'cronograma' && 'Cronograma'}
                {tab === 'arquivos' && 'Arquivos'}
                {tab === 'demandas' && 'Demandas'}
              </button>
            ))}
          </div>

          <div className="animate-fade-in min-h-[50vh]">
            {activeTab === 'geral' && (
              <div className="space-y-10">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><FileText size={16} className="text-blue-500" /> Descrição e Contexto</h4>
                  <textarea 
                    value={selectedProject.description}
                    onChange={e => updateSelectedProject({...selectedProject, description: e.target.value})}
                    placeholder="Descreva o propósito deste projeto, público alvo e os objetivos principais..."
                    className="w-full bg-white border border-slate-100 rounded-2xl p-5 text-slate-600 font-light leading-relaxed outline-none focus:border-blue-200 focus:shadow-sm transition-all resize-y min-h-[150px]"
                  />
                </div>
              </div>
            )}

            {activeTab === 'cronograma' && (() => {
              const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = async (ev) => {
                  const data = ev.target?.result as string;
                  updateSelectedProject({
                    ...selectedProject,
                    scheduleFileData: data,
                    scheduleFileName: file.name,
                  });
                };
                reader.readAsDataURL(file);
              };

              const renderExcelTable = () => {
                if (!selectedProject.scheduleFileData) return null;
                try {
                  const XLSX = require('xlsx');
                  const base64 = selectedProject.scheduleFileData.split(',')[1];
                  const binaryStr = atob(base64);
                  const bytes = new Uint8Array(binaryStr.length);
                  for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
                  const workbook = XLSX.read(bytes, { type: 'array' });
                  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                  const jsonData: any[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
                  
                  if (jsonData.length === 0) return <p className="text-sm text-slate-400 text-center py-6">Planilha vazia.</p>;
                  
                  return (
                    <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100">
                            {jsonData[0]?.map((header: any, i: number) => (
                              <th key={i} className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">{String(header || '')}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {jsonData.slice(1).map((row, rowIdx) => (
                            <tr key={rowIdx} className={`border-b border-slate-50 ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-blue-50/30 transition-colors`}>
                              {jsonData[0]?.map((_: any, colIdx: number) => (
                                <td key={colIdx} className="px-4 py-2.5 text-slate-700 whitespace-nowrap">{String(row[colIdx] ?? '')}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                } catch (err) {
                  return <p className="text-sm text-red-500 text-center py-6">Erro ao ler a planilha.</p>;
                }
              };

              return (
                <div className="space-y-8">
                  {/* Excel import area */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                        <Table size={16} className="text-blue-500" /> Planilha do Cronograma
                      </h4>
                      {selectedProject.scheduleFileData && (
                        <button
                          onClick={() => updateSelectedProject({ ...selectedProject, scheduleFileData: undefined, scheduleFileName: undefined })}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-red-500 bg-red-50 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={12} /> Remover
                        </button>
                      )}
                    </div>

                    {selectedProject.scheduleFileData ? (
                      <div>
                        <div className="flex items-center gap-2 mb-4 px-1">
                          <FileText size={14} className="text-emerald-500" />
                          <span className="text-xs font-medium text-slate-600">{selectedProject.scheduleFileName}</span>
                        </div>
                        {renderExcelTable()}
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-10 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all group">
                        <Upload size={28} className="text-slate-300 group-hover:text-blue-400 mb-3 transition-colors" />
                        <p className="text-sm font-medium text-slate-500 group-hover:text-blue-600 transition-colors">Importar Planilha Excel</p>
                        <p className="text-[11px] text-slate-400 mt-1">Arraste ou clique para enviar .xlsx</p>
                        <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleExcelUpload} />
                      </label>
                    )}
                  </div>

                  {/* Manual tasks */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2"><Calendar size={16} className="text-blue-500" /> Tarefas Manuais</h4>
                      <button 
                        onClick={() => updateSelectedProject({
                          ...selectedProject, 
                          schedule: [...selectedProject.schedule, { id: crypto.randomUUID(), date: new Date().toISOString().split('T')[0], type: 'Post', title: '', description: '', status: 'Pendente' }]
                        })}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors"
                      >
                        <Plus size={14} /> Nova Tarefa
                      </button>
                    </div>
                    <div className="space-y-3">
                      {selectedProject.schedule.length === 0 ? (
                        <div className="text-sm text-slate-400 p-8 bg-slate-50 rounded-2xl text-center border border-slate-100 border-dashed">Nenhuma tarefa manual adicionada.</div>
                      ) : (
                        selectedProject.schedule.map(item => (
                          <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 group">
                            <input type="date" value={item.date} onChange={e => {
                              const ns = selectedProject.schedule.map(s => s.id === item.id ? { ...s, date: e.target.value } : s);
                              updateSelectedProject({ ...selectedProject, schedule: ns });
                            }} className="text-xs font-medium text-slate-500 bg-slate-50 p-2 rounded-lg outline-none w-32 shrink-0" />
                            <input value={item.title} onChange={e => {
                              const ns = selectedProject.schedule.map(s => s.id === item.id ? { ...s, title: e.target.value } : s);
                              updateSelectedProject({ ...selectedProject, schedule: ns });
                            }} placeholder="Título da tarefa..." className="flex-1 text-sm font-medium text-slate-900 bg-transparent outline-none" />
                            <button onClick={() => {
                              updateSelectedProject({ ...selectedProject, schedule: selectedProject.schedule.filter(s => s.id !== item.id) });
                            }} className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}



            {activeTab === 'arquivos' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2"><Folder size={16} className="text-blue-500" /> Arquivos Anexados</h4>
                  <p className="text-xs text-slate-500">Links para drive ou arquivos leves.</p>
                </div>
                <div className="text-sm text-slate-400 p-10 bg-slate-50 rounded-3xl text-center border border-slate-100 border-dashed flex flex-col items-center">
                  <Folder size={32} className="mb-4 text-slate-300" />
                  Para esta versão do sistema, o uso recomendado para não pesar a plataforma é gerenciar os arquivos grandes nas pastas de "Ativos" normais ou salvar links do Google Drive/Figma na aba "Geral".
                  <br className="mt-2"/>
                  Você também pode colar links diretos na aba de links.
                </div>
              </div>
            )}

            {activeTab === 'demandas' && (() => {
              const projectDemands = demands.filter(d => d.projectId === selectedProject.id);
              
              return (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <CheckSquare size={16} className="text-blue-500" /> Demandas do Projeto
                    </h4>
                  </div>

                  {projectDemands.length === 0 ? (
                    <div className="text-sm text-slate-400 p-10 bg-slate-50 rounded-3xl text-center border border-slate-100 border-dashed flex flex-col items-center">
                      <CheckSquare size={32} className="mb-4 text-slate-300" />
                      Nenhuma demanda atrelada a este projeto.
                      <br className="mt-2"/>
                      Crie as tarefas na página de "Demandas" direcionando para "{selectedProject.name}".
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projectDemands.map(demand => (
                        <div 
                          key={demand.id} 
                          className={`bg-white border rounded-xl p-4 flex items-center justify-between transition-all ${demand.status === 'Concluído' ? 'border-slate-100 bg-slate-50/50 opacity-60' : 'border-slate-200 shadow-sm'}`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                setDemands(prev => prev.map(d => d.id === demand.id ? { ...d, status: d.status === 'Pendente' ? 'Concluído' : 'Pendente' } : d));
                              }}
                              className="text-slate-400 hover:text-blue-600 transition-colors"
                            >
                              {demand.status === 'Concluído' ? <CheckCircle2 size={20} className="text-green-500" /> : <Circle size={20} />}
                            </button>
                            <div>
                              <p className={`text-sm text-slate-900 ${demand.status === 'Concluído' ? 'line-through text-slate-500' : ''}`}>
                                {demand.description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {demand.dueDate && (
                              <span className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md hidden sm:block">
                                {new Date(demand.dueDate).toLocaleDateString('pt-BR', {timeZone:'UTC'})}
                              </span>
                            )}
                            <button
                              onClick={() => setDemands(prev => prev.filter(d => d.id !== demand.id))}
                              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

          </div>
        </div>
      </div>

      {/* Right Area: AI Chat */}
      <div className="w-full md:w-[380px] lg:w-[420px] bg-white h-full border-l border-black/5 flex flex-col shrink-0 relative overflow-hidden">
        <div className="h-[72px] shrink-0 border-b border-black/5 flex items-center justify-between px-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 leading-tight">Copiloto do Projeto</h3>
              <p className="text-[10px] font-medium text-blue-500 uppercase tracking-widest">Especialista Ativo</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 relative">
          {chatMessages.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <Bot size={48} className="mb-4 opacity-20" />
              <p className="text-sm leading-relaxed">Olá! Eu sou a IA especialista em <strong>{selectedProject.name}</strong>. Conheço todos os links, o cronograma e o design system que você cadastrou.</p>
              <p className="text-xs mt-4">Pergunte-me qualquer coisa sobre o projeto ou peça ideias para novos conteúdos!</p>
            </div>
          )}
          
          {chatMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-tr-sm' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'}`}>
                <p className="text-sm font-light leading-relaxed whitespace-pre-wrap">{msg.parts[0].text}</p>
              </div>
            </div>
          ))}

          {isChatLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-2 text-slate-400">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-black/5 shrink-0">
          <div className="relative flex items-center">
            <input 
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              disabled={isChatLoading}
              placeholder="Pergunte ao especialista do projeto..."
              className="w-full bg-slate-50 border border-slate-100 disabled:opacity-50 rounded-full pl-5 pr-12 py-3.5 text-sm outline-none focus:border-blue-300 focus:bg-white transition-all shadow-inner"
            />
            <button 
              onClick={handleSendMessage}
              disabled={isChatLoading || !chatInput.trim()}
              className="absolute right-1.5 w-10 h-10 rounded-full bg-blue-500 disabled:bg-slate-300 text-white flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm"
            >
              <Send size={16} className="ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
