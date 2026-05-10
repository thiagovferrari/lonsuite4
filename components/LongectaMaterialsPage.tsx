import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Box,
  Building2,
  Check,
  ClipboardList,
  FileText,
  Layers3,
  Megaphone,
  Monitor,
  PackageCheck,
  PenTool,
  Presentation,
  Send,
  Sparkles,
  Store,
} from 'lucide-react';

interface LongectaMaterialsPageProps {
  onBack: () => void;
  onCongress: () => void;
  onSolutions: () => void;
  onPlans: () => void;
}

type MaterialService = {
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  title: string;
  promise: string;
  description: string;
  examples: string[];
  deliverables: string[];
};

const materialsMailto = (subject: string) =>
  `mailto:contato@lonsuite.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Olá, quero entender como a Longecta pode desenvolver os materiais, artes ou projeto 3D do meu evento/estande. Pode me orientar nos próximos passos?')}`;

const services: MaterialService[] = [
  {
    icon: Presentation,
    title: 'Artes para cenografia',
    promise: 'O ambiente físico passa a comunicar a marca do evento.',
    description: 'Criamos o sistema visual aplicado em superfícies reais: fundos de palco, backdrops, painéis, testeiras, telas, ambientação e peças de presença institucional.',
    examples: ['Backdrop principal', 'Fundo de palco', 'Painéis laterais', 'Tela de plenária'],
    deliverables: ['Direção visual', 'Arte final', 'Variações por formato', 'Guia para fornecedor'],
  },
  {
    icon: Monitor,
    title: 'Palco, plenária e púlpito',
    promise: 'A apresentação ganha presença visual antes mesmo da fala começar.',
    description: 'Desenvolvemos a linguagem gráfica para palco, púlpito, telas, laterais, vinhetas estáticas e elementos de apoio para uma plenária mais premium.',
    examples: ['Púlpito', 'Painel LED', 'Moldura de tela', 'Identidade da sessão'],
    deliverables: ['Layouts de palco', 'Artes de tela', 'Arquivos finais', 'Checklist técnico'],
  },
  {
    icon: Store,
    title: 'Estandes e ativações',
    promise: 'O estande deixa de ser espaço vazio e vira experiência de marca.',
    description: 'Criamos a comunicação visual de estandes, balcões, paredes, displays, ativações, áreas de demonstração e pontos de relacionamento com patrocinadores.',
    examples: ['Parede principal', 'Balcão', 'Display demo', 'Área patrocinador'],
    deliverables: ['Conceito visual', 'Aplicações', 'Mockups', 'Arquivo para produção'],
  },
  {
    icon: Building2,
    title: 'Projetos 3D de estandes',
    promise: 'Antes de produzir, o cliente entende o espaço.',
    description: 'Desenvolvemos estudos e renders 3D de estandes para visualizar volumetria, circulação, pontos de comunicação, balcões, telas e áreas de experiência.',
    examples: ['Estande aberto', 'Corner booth', 'Recepção', 'Área de reunião'],
    deliverables: ['Render 3D', 'Estudo de layout', 'Vista por ângulos', 'Briefing para montadora'],
  },
  {
    icon: Megaphone,
    title: 'Totens, sinalização e wayfinding',
    promise: 'O participante entende o evento sem depender de improviso.',
    description: 'Criamos peças de orientação e presença visual: totens, placas, sinalização direcional, agenda, áreas de credenciamento, patrocinadores e fluxo de salas.',
    examples: ['Totem vertical', 'Direcional', 'Agenda do dia', 'Credenciamento'],
    deliverables: ['Sistema de placas', 'Artes por medida', 'Hierarquia visual', 'Mapa de aplicação'],
  },
  {
    icon: BadgeCheck,
    title: 'Visibilidade de patrocinadores',
    promise: 'O patrocinador aparece com valor, não apenas com logotipo.',
    description: 'Organizamos a presença de marcas em painéis, totens, estandes, áreas de ativação, telas, materiais físicos e pontos de experiência do congresso.',
    examples: ['Painel sponsor', 'Cotas visuais', 'Ativações', 'Área de relacionamento'],
    deliverables: ['Mapa de entregas', 'Artes de aplicação', 'Mockups', 'Prova visual'],
  },
  {
    icon: PackageCheck,
    title: 'Kit técnico para produção',
    promise: 'A montadora e a gráfica recebem arquivos com menos ambiguidade.',
    description: 'Preparamos arquivos finais, organização por peça, instruções de formato, checklist e pacote visual para facilitar a conversa com fornecedores.',
    examples: ['Arquivos finais', 'Peças por medida', 'Checklist', 'Referência visual'],
    deliverables: ['PDF de produção', 'Pacote de arquivos', 'Especificações', 'Controle de versões'],
  },
  {
    icon: Layers3,
    title: 'Sistema visual do ambiente',
    promise: 'Tudo parece pertencer à mesma edição.',
    description: 'Criamos uma linguagem consistente para palco, estande, totens, telas e materiais físicos, conectada ao branding do congresso ou da marca patrocinadora.',
    examples: ['Key visual', 'Grid de aplicação', 'Hierarquia', 'Padrão visual'],
    deliverables: ['Sistema visual', 'Templates', 'Guia rápido', 'Aplicações prioritárias'],
  },
];

const processSteps = [
  ['1. Briefing espacial', 'Entendemos evento, medidas, fornecedor, fluxo, pontos de atenção, patrocinadores, telas, palco e necessidades de produção.'],
  ['2. Direção visual', 'Transformamos a identidade do evento em uma lógica aplicável ao espaço físico, mantendo hierarquia e unidade visual.'],
  ['3. Arte e 3D', 'Criamos artes finais, mockups e renders 3D quando necessário para aprovar composição, volume, escala e experiência.'],
  ['4. Kit para fornecedor', 'Entregamos arquivos e instruções para gráfica, montadora ou equipe de produção executar com menos ruído.'],
];

const scope = [
  ['Fazemos', 'Estratégia visual, conceito, arte, mockup, render 3D, projeto visual de estande, arquivos finais e orientação para fornecedor.'],
  ['Não fazemos', 'Impressão, montagem física, marcenaria, locação de estrutura, instalação elétrica, operação de gráfica ou produção no local.'],
  ['Trabalhamos junto', 'Com montadoras, produtoras, gráficas, sociedades médicas, patrocinadores, organizadores e equipes de marketing.'],
];

const LongectaMaterialsPage: React.FC<LongectaMaterialsPageProps> = ({ onBack, onCongress, onSolutions, onPlans }) => {
  return (
    <div className="longecta-method-page plans-premium-page lon-soft-bg min-h-screen overflow-hidden text-[#111113]">
      <section className="relative px-5 pb-24 pt-6 sm:px-8 lg:px-12">
        <div className="absolute inset-x-0 top-0 h-[560px] bg-white/22" />

        <div className="relative mx-auto max-w-7xl">
          <nav className="lon-glass-panel sticky top-4 z-30 mb-10 flex items-center justify-between rounded-full px-3 py-2">
            <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold text-[#424245] hover:bg-[#1d1d1f] hover:text-white">
              <ArrowLeft size={14} />
              Voltar
            </button>
            <div className="hidden items-center gap-6 text-[11px] font-semibold text-[#6e6e73] md:flex">
              <a href="#servicos" className="hover:text-[#1d1d1f]">Serviços</a>
              <a href="#escopo" className="hover:text-[#1d1d1f]">Escopo</a>
              <a href="#processo" className="hover:text-[#1d1d1f]">Processo</a>
              <a href="#projetos-3d" className="hover:text-[#1d1d1f]">Projetos 3D</a>
            </div>
            <button onClick={onPlans} className="button-nowrap rounded-full bg-[#1d1d1f] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#2d2d2f]">
              Ver planos
            </button>
          </nav>

          <header className="mb-8 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="plans-eyebrow lon-glass-panel mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase text-[#6e6e73]">
                <Box size={13} className="text-[#1d1d1f]" />
                Materiais Longecta
              </p>
              <h1 className="max-w-4xl text-[42px] font-light leading-[1.02] tracking-tight sm:text-[64px] lg:text-[72px]">
                Artes e projetos visuais para ambientes científicos premium.
              </h1>
            </div>
            <div className="max-w-2xl lg:justify-self-end">
              <p className="text-[17px] font-light leading-relaxed text-[#6e6e73] sm:text-[19px]">
                Desenvolvemos a estratégia visual, as artes finais e os estudos 3D para cenografia, palco, estandes, totens, backdrops e materiais físicos de congressos e ativações médicas.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Arte estratégica', 'Projeto 3D', 'Kit para fornecedor', 'Não imprimimos'].map(item => (
                  <span key={item} className="rounded-full border border-black/[0.06] bg-white/72 px-4 py-2 text-[12px] font-semibold text-[#424245] shadow-sm backdrop-blur-xl">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </header>

          <section className="mb-12 grid gap-3 lg:grid-cols-[1.18fr_0.82fr]">
            <div className="overflow-hidden rounded-[34px] border border-black/[0.055] bg-white/72 shadow-[0_22px_70px_rgba(0,0,0,0.07)] backdrop-blur-xl">
              <img src="/assets/longecta-materials-system.png" alt="Sistema 3D de peças para cenografia e sinalização" className="h-[320px] w-full object-cover object-center sm:h-[460px]" />
            </div>
            <div className="grid gap-3">
              {scope.map(([title, body], index) => (
                <article key={title} className={`rounded-[28px] p-6 shadow-[0_16px_54px_rgba(0,0,0,0.05)] ${index === 0 ? 'bg-[#111113] text-white' : 'border border-black/[0.055] bg-white/76 text-[#111113] backdrop-blur-xl'}`}>
                  <p className={`mb-8 text-[10px] font-bold uppercase tracking-[0.18em] ${index === 0 ? 'text-white/42' : 'text-[#86868b]'}`}>{title}</p>
                  <p className={`text-[15px] leading-relaxed ${index === 0 ? 'text-white/66' : 'text-[#5f5f63]'}`}>{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="servicos" className="scroll-mt-24">
            <div className="mb-6 grid gap-4 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Serviços premium</p>
                <h2 className="text-[38px] font-light leading-tight tracking-tight sm:text-[54px]">O que desenvolvemos.</h2>
              </div>
              <p className="max-w-3xl text-[15px] leading-relaxed text-[#6e6e73]">
                A lógica é de produto: cada peça precisa ter função, hierarquia, acabamento e viabilidade de produção. Não entregamos apenas uma arte bonita; entregamos uma comunicação aplicável ao espaço real.
              </p>
            </div>

            <div className="grid gap-3 xl:grid-cols-2">
              {services.map(service => {
                const Icon = service.icon;
                return (
                  <article key={service.title} className="rounded-[26px] border border-black/[0.055] bg-white/78 p-5 shadow-[0_16px_54px_rgba(0,0,0,0.05)] backdrop-blur-xl transition-all hover:bg-white hover:shadow-[0_24px_70px_rgba(0,0,0,0.07)]">
                    <div className="grid gap-4 sm:grid-cols-[48px_1fr]">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111113] text-white">
                        <Icon size={18} />
                      </div>
                      <div>
                        <h3 className="text-[24px] font-light leading-tight tracking-tight">{service.title}</h3>
                        <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#86868b]">{service.promise}</p>
                        <p className="mt-4 text-[13px] leading-relaxed text-[#5f5f63]">{service.description}</p>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          <div className="rounded-[18px] bg-[#f5f5f7] p-4">
                            <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Exemplos</p>
                            <div className="flex flex-wrap gap-2">
                              {service.examples.map(item => (
                                <span key={item} className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.11em] text-[#6e6e73]">{item}</span>
                              ))}
                            </div>
                          </div>
                          <div className="rounded-[18px] bg-[#111113] p-4 text-white">
                            <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">Entregas</p>
                            <div className="flex flex-wrap gap-2">
                              {service.deliverables.map(item => (
                                <span key={item} className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.11em] text-white/70">{item}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section id="projetos-3d" className="mt-16 scroll-mt-24 grid gap-3 lg:grid-cols-2">
            <article className="overflow-hidden rounded-[34px] border border-black/[0.055] bg-white/72 shadow-[0_22px_70px_rgba(0,0,0,0.07)] backdrop-blur-xl">
              <img src="/assets/longecta-materials-stage.png" alt="Projeto 3D de palco, púlpito e totens" className="h-[310px] w-full object-cover object-center sm:h-[420px]" />
              <div className="p-6">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Palco e sinalização</p>
                <h3 className="text-[31px] font-light leading-tight">Elementos 3D para aprovar proporção, hierarquia e presença visual.</h3>
              </div>
            </article>
            <article className="overflow-hidden rounded-[34px] border border-black/[0.055] bg-white/72 shadow-[0_22px_70px_rgba(0,0,0,0.07)] backdrop-blur-xl">
              <img src="/assets/longecta-materials-stand.png" alt="Projeto 3D de estande premium" className="h-[310px] w-full object-cover object-center sm:h-[420px]" />
              <div className="p-6">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Estandes</p>
                <h3 className="text-[31px] font-light leading-tight">Renders de estande para visualizar espaço, fluxo, balcão, telas e paredes gráficas.</h3>
              </div>
            </article>
          </section>

          <section id="processo" className="mt-16 scroll-mt-24 rounded-[34px] border border-black/[0.055] bg-white/72 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.06)] backdrop-blur-xl">
            <div className="mb-6 grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
              <div className="rounded-[26px] bg-[#111113] p-6 text-white">
                <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/38">Processo</p>
                <h2 className="text-[34px] font-extralight leading-tight">Do briefing à entrega para fornecedor.</h2>
              </div>
              <div className="grid gap-px overflow-hidden rounded-[24px] border border-black/[0.045] bg-black/[0.045]">
                {processSteps.map(([title, body]) => (
                  <div key={title} className="grid gap-2 bg-white px-5 py-4 sm:grid-cols-[220px_1fr]">
                    <p className="text-[13px] font-semibold text-[#111113]">{title}</p>
                    <p className="text-[13px] leading-relaxed text-[#6e6e73]">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="escopo" className="mt-16 grid gap-3 lg:grid-cols-3">
            {[
              ['Para congressos', 'Palco, plenária, sinalização, áreas de sponsor, photo opportunity, credenciamento, agenda e ambientação científica.', Presentation],
              ['Para patrocinadores', 'Estandes, ativações, painéis, balcões, totens, displays e materiais de presença institucional dentro do evento.', Store],
              ['Para produção', 'Arquivos finais, mockups, renders, referências e pacote organizado para gráfica, montadora ou equipe técnica.', ClipboardList],
            ].map(([title, body, Icon]) => {
              const TypedIcon = Icon as React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
              return (
                <article key={title as string} className="rounded-[30px] border border-black/[0.055] bg-white/74 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl">
                  <TypedIcon size={19} className="mb-10 text-[#1d1d1f]/70" />
                  <h3 className="text-[28px] font-light leading-tight">{title as string}</h3>
                  <p className="mt-4 text-[13px] leading-relaxed text-[#6e6e73]">{body as string}</p>
                </article>
              );
            })}
          </section>

          <section className="relative mt-16 overflow-hidden rounded-[34px] bg-[#111113] px-7 py-12 text-white shadow-[0_32px_110px_rgba(0,0,0,0.22)] sm:px-10">
            <div className="relative z-10 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Materiais com inteligência de ambiente</p>
                <h2 className="max-w-4xl text-[36px] font-extralight leading-tight sm:text-[52px]">A arte certa ajuda o evento a parecer mais organizado, mais premium e mais valioso.</h2>
                <p className="mt-5 max-w-2xl text-[14px] leading-relaxed text-white/58">A Longecta estrutura a comunicação visual do espaço para que montadoras, gráficas e produtores tenham uma direção clara do que precisa ser executado.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <a href={materialsMailto('Quero desenvolver materiais premium Longecta')} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-[#111113] hover:bg-white/90">
                  Solicitar materiais
                  <Send size={15} />
                </a>
                <button onClick={onCongress} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-[13px] font-semibold text-white backdrop-blur hover:bg-white/16">
                  Ver Congressos
                  <ArrowRight size={15} />
                </button>
                <button onClick={onSolutions} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-[13px] font-semibold text-white backdrop-blur hover:bg-white/16">
                  Nossas Soluções
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default LongectaMaterialsPage;
