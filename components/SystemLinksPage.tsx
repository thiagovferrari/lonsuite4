import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Box,
  Brain,
  CircleEllipsis,
  DoorOpen,
  FileText,
  Home,
  Layers3,
  LayoutGrid,
  Link2,
  Milestone,
  Megaphone,
  Mic2,
  PenTool,
  Server,
  Settings,
  Sparkles,
  Stethoscope,
  Trash2,
  Users,
} from 'lucide-react';

export type SystemLinkAction =
  | 'login'
  | 'plans'
  | 'planDetails'
  | 'solutions'
  | 'materials'
  | 'publicity'
  | 'systems'
  | 'progress'
  | 'method'
  | 'congress'
  | 'speakerKit'
  | 'minds'
  | 'home'
  | 'intelligence'
  | 'assets'
  | 'cases'
  | 'trash'
  | 'settings';

type LinkItem = {
  action: SystemLinkAction;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  scope: 'public' | 'internal';
};

const systemLinks: LinkItem[] = [
  {
    action: 'login',
    title: 'Login',
    description: 'Acesso ao workspace Lon Suite e entrada principal do sistema.',
    icon: DoorOpen,
    scope: 'public',
  },
  {
    action: 'plans',
    title: 'Planos',
    description: 'Página comercial com planos, preços e proposta de valor da plataforma.',
    icon: FileText,
    scope: 'public',
  },
  {
    action: 'planDetails',
    title: 'Detalhes dos planos',
    description: 'Explicação ampliada sobre acervo, segurança, produção científica e uso da Lon Suite.',
    icon: Sparkles,
    scope: 'public',
  },
  {
    action: 'solutions',
    title: 'Nossas Soluções',
    description: 'Portfólio Longecta dividido em Para você, Para sua clínica e Para seu congresso.',
    icon: Layers3,
    scope: 'public',
  },
  {
    action: 'materials',
    title: 'Materiais',
    description: 'Artes premium, cenografia visual e projetos 3D para congressos, estandes e ativações.',
    icon: Box,
    scope: 'public',
  },
  {
    action: 'publicity',
    title: 'Publicity',
    description: 'Página black da Longecta para lideranças médicas, palestrantes, cursos, sociedades e congressos que precisam captar com autoridade.',
    icon: Megaphone,
    scope: 'public',
  },
  {
    action: 'systems',
    title: 'Sistemas',
    description: 'Página black da Longecta Systems para plataformas, integrações, IA e sistemas personalizados para negócios médicos.',
    icon: Server,
    scope: 'public',
  },
  {
    action: 'progress',
    title: 'Progress',
    description: 'Timeline infográfica da experiência Longecta, do primeiro contato ao próximo ciclo de crescimento.',
    icon: Milestone,
    scope: 'public',
  },
  {
    action: 'method',
    title: 'Método Longecta',
    description: 'Como plataforma, serviço, curadoria e inteligência transformam conhecimento médico em autoridade.',
    icon: CircleEllipsis,
    scope: 'public',
  },
  {
    action: 'congress',
    title: 'Longecta Congressos',
    description: 'Comunicação estratégica para transformar congressos médicos em marcas científicas de valor.',
    icon: Users,
    scope: 'public',
  },
  {
    action: 'speakerKit',
    title: 'Speaker Visibility Kit',
    description: 'Kit estratégico para transformar palestrantes em ativos de alcance, prestígio e inscrição.',
    icon: Mic2,
    scope: 'public',
  },
  {
    action: 'minds',
    title: 'Palestrantes',
    description: 'Solução Longecta para posicionar, apresentar e ativar palestrantes médicos antes, durante e depois dos congressos.',
    icon: PenTool,
    scope: 'public',
  },
  {
    action: 'home',
    title: 'Início',
    description: 'Busca central, atalhos e visão inicial do workspace científico.',
    icon: Home,
    scope: 'internal',
  },
  {
    action: 'intelligence',
    title: 'Intelligence',
    description: 'Área de inteligência para explorar acervo, contexto, buscas e conexões com IA.',
    icon: Brain,
    scope: 'internal',
  },
  {
    action: 'assets',
    title: 'Ativos',
    description: 'Biblioteca de imagens, PDFs, documentos e materiais científicos organizados.',
    icon: LayoutGrid,
    scope: 'internal',
  },
  {
    action: 'cases',
    title: 'Cases Científicos',
    description: 'Criação, edição e apresentação de cases médicos a partir do acervo.',
    icon: Stethoscope,
    scope: 'internal',
  },
  {
    action: 'trash',
    title: 'Lixeira',
    description: 'Itens excluídos, restauração e limpeza permanente do acervo.',
    icon: Trash2,
    scope: 'internal',
  },
  {
    action: 'settings',
    title: 'Ajustes',
    description: 'Perfil, métricas de uso, produção científica, armazenamento e configurações.',
    icon: Settings,
    scope: 'internal',
  },
];

interface SystemLinksPageProps {
  mode: 'public' | 'internal';
  onBack: () => void;
  onNavigate: (action: SystemLinkAction) => void;
}

export const SystemLinksButton: React.FC<{ onClick: () => void; className?: string }> = ({ onClick, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Abrir mapa de links do sistema"
    title="Mapa do sistema"
    className={`fixed right-4 top-4 z-[260] flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.06] bg-white/68 text-[#6e6e73] shadow-[0_12px_36px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all hover:bg-[#111113] hover:text-white active:scale-95 sm:right-5 sm:top-5 ${className}`}
  >
    <Link2 size={14} strokeWidth={1.7} />
  </button>
);

const SystemLinksPage: React.FC<SystemLinksPageProps> = ({ mode, onBack, onNavigate }) => {
  const publicLinks = systemLinks.filter(link => link.scope === 'public');
  const internalLinks = systemLinks.filter(link => link.scope === 'internal');

  const renderLink = (link: LinkItem) => {
    const Icon = link.icon;
    const unavailable = mode === 'public' && link.scope === 'internal';
    return (
      <button
        key={link.action}
        type="button"
        onClick={() => onNavigate(link.action)}
        className={`group flex w-full items-center gap-4 rounded-[22px] border p-4 text-left transition-all ${
          unavailable
            ? 'border-black/[0.045] bg-white/42 text-[#86868b] hover:bg-white/70'
            : 'border-black/[0.055] bg-white/70 text-[#111113] hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_56px_rgba(0,0,0,0.07)]'
        }`}
      >
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${unavailable ? 'bg-[#f5f5f7] text-[#a1a1a6]' : 'bg-[#111113] text-white'}`}>
          <Icon size={17} strokeWidth={1.5} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[16px] font-semibold leading-tight">{link.title}</span>
          <span className="mt-1.5 block text-[12px] font-light leading-relaxed text-[#6e6e73]">{link.description}</span>
          {unavailable && <span className="mt-2 block text-[9px] font-bold uppercase tracking-[0.16em] text-[#a1a1a6]">Requer login no workspace</span>}
        </span>
        <ArrowRight size={14} className={`shrink-0 transition-transform group-hover:translate-x-0.5 ${unavailable ? 'text-[#c7c7cc]' : 'text-[#86868b]'}`} />
      </button>
    );
  };

  return (
    <div className="plans-premium-page lon-soft-bg min-h-screen text-[#111113]">
      <section className="px-5 pb-20 pt-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <nav className="lon-glass-panel mb-12 flex items-center justify-between rounded-full px-3 py-2">
            <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold text-[#424245] hover:bg-[#1d1d1f] hover:text-white">
              <ArrowLeft size={14} />
              Voltar
            </button>
            <p className="pr-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a1a1a6]">Mapa do sistema</p>
          </nav>

          <header className="mb-10">
            <p className="plans-eyebrow lon-glass-panel mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase text-[#6e6e73]">
              <Link2 size={13} className="text-[#111113]" />
              Linktree Lon Suite
            </p>
            <h1 className="text-[42px] font-light leading-[1.02] tracking-tight sm:text-[64px]">Todos os caminhos do sistema.</h1>
            <p className="mt-5 max-w-2xl text-[15px] font-light leading-relaxed text-[#6e6e73]">
              Uma página minimalista para acessar rapidamente cada área pública e interna da Lon Suite, Longecta e suas frentes comerciais.
            </p>
          </header>

          <div className="space-y-8">
            <section>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Páginas públicas</p>
              <div className="grid gap-3">{publicLinks.map(renderLink)}</div>
            </section>

            <section>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Workspace interno</p>
              <div className="grid gap-3">{internalLinks.map(renderLink)}</div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SystemLinksPage;
