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
  role: string;
  description: string;
  examples: string[];
  delivery: string;
};

const materialsMailto = (subject: string) =>
  `mailto:contato@lonsuite.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Olá, quero entender como a Longecta pode desenvolver os materiais, artes ou projeto 3D do meu evento/estande. Pode me orientar nos próximos passos?')}`;

const handleAnchor = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const position = [
  ['O que fazemos', 'Estratégia visual, artes finais, mockups, renders 3D, projeto visual de estande e kit técnico para fornecedor.'],
  ['O que não fazemos', 'Não imprimimos, não montamos, não fazemos marcenaria, elétrica, locação de estrutura ou produção física no local.'],
  ['Como entramos', 'Como camada de inteligência visual entre evento, patrocinador, gráfica, montadora e equipe de produção.'],
];

const gallery = [
  {
    image: '/assets/longecta-materials-system.png',
    label: 'Sistema de peças',
    title: 'Backdrops, totens, púlpito, sinalização e fundos.',
    body: 'Um conjunto visual padronizado para o evento parecer organizado em todos os pontos físicos.',
    tags: ['Backdrop', 'Totem', 'Púlpito', 'Sinalização'],
  },
  {
    image: '/assets/longecta-materials-stage.png',
    label: 'Palco e plenária',
    title: 'Volumetria e presença para o momento central.',
    body: 'Estudos visuais para palco, painel, tela, laterais, púlpito e elementos de orientação da sessão.',
    tags: ['Palco', 'Tela', 'Plenária', 'Sessão'],
  },
  {
    image: '/assets/longecta-materials-stand.png',
    label: 'Estande e ativação',
    title: 'Projeto 3D para entender espaço antes da produção.',
    body: 'Renders para visualizar paredes gráficas, balcão, telas, áreas de reunião e pontos de experiência.',
    tags: ['Estande', 'Balcão', 'Display', '3D'],
  },
];

const services: MaterialService[] = [
  {
    icon: Presentation,
    title: 'Artes para cenografia',
    role: 'Transformar identidade em ambiente.',
    description: 'Sistema visual aplicado em fundos de palco, backdrops, painéis, testeiras, telas, laterais e peças de presença institucional.',
    examples: ['Backdrop', 'Fundo de palco', 'Painéis', 'Tela de plenária'],
    delivery: 'Arte final por formato, mockups e guia para fornecedor.',
  },
  {
    icon: Monitor,
    title: 'Palco, plenária e púlpito',
    role: 'Elevar a percepção do momento principal.',
    description: 'Linguagem gráfica para palco, púlpito, telas, molduras, vinhetas estáticas, fundos de sessão e elementos de apoio.',
    examples: ['Púlpito', 'Painel LED', 'Moldura', 'Identidade da sessão'],
    delivery: 'Layouts de palco, artes de tela e checklist técnico.',
  },
  {
    icon: Store,
    title: 'Estandes e ativações',
    role: 'Fazer o espaço trabalhar pela marca.',
    description: 'Comunicação visual de estandes, balcões, paredes, displays, ativações, áreas de demonstração e pontos de relacionamento.',
    examples: ['Parede principal', 'Balcão', 'Display demo', 'Área sponsor'],
    delivery: 'Conceito visual, aplicações, mockups e arquivos finais.',
  },
  {
    icon: Building2,
    title: 'Projetos 3D de estandes',
    role: 'Aprovar espaço, fluxo e intenção antes de produzir.',
    description: 'Estudos e renders para visualizar volumetria, circulação, balcões, telas, paredes gráficas, reuniões e pontos de experiência.',
    examples: ['Corner booth', 'Recepção', 'Área de reunião', 'Ilha sponsor'],
    delivery: 'Render 3D, vistas por ângulo e briefing para montadora.',
  },
  {
    icon: Megaphone,
    title: 'Totens e sinalização',
    role: 'Orientar sem poluir o evento.',
    description: 'Peças de wayfinding, agenda, credenciamento, patrocinadores, salas, fluxo de público e comunicação de áreas importantes.',
    examples: ['Totem vertical', 'Direcional', 'Agenda do dia', 'Credenciamento'],
    delivery: 'Sistema de placas, artes por medida e mapa de aplicação.',
  },
  {
    icon: BadgeCheck,
    title: 'Visibilidade de patrocinadores',
    role: 'Mostrar entrega de valor, não apenas logotipo.',
    description: 'Presença de marcas em painéis, totens, estandes, áreas de ativação, telas, materiais físicos e pontos de experiência.',
    examples: ['Painel sponsor', 'Cotas visuais', 'Ativações', 'Área de relacionamento'],
    delivery: 'Mapa de entregas, aplicações e prova visual.',
  },
  {
    icon: PackageCheck,
    title: 'Kit técnico para produção',
    role: 'Reduzir ruído com gráfica, montadora e produção.',
    description: 'Organização de arquivos finais, medidas, referências, versões e instruções para que fornecedores executem com clareza.',
    examples: ['Arquivos finais', 'Peças por medida', 'Checklist', 'Referências'],
    delivery: 'Pacote de arquivos, PDF técnico e controle de versões.',
  },
  {
    icon: Layers3,
    title: 'Sistema visual do ambiente',
    role: 'Garantir unidade entre todas as peças.',
    description: 'Padrão visual para palco, estande, totens, telas e materiais físicos conectado ao branding do congresso ou patrocinador.',
    examples: ['Key visual', 'Grid', 'Hierarquia', 'Templates'],
    delivery: 'Sistema visual, guia rápido e aplicações prioritárias.',
  },
];

const process = [
  ['Briefing técnico', 'Medidas, fornecedores, superfícies, fluxo, patrocinadores, telas, prazos e contexto do evento.'],
  ['Direção visual', 'Transformação da identidade em uma lógica de aplicação física, com hierarquia e unidade.'],
  ['Mockups e 3D', 'Visualização de peças, escala, composição, volumetria, estande e relação com o espaço.'],
  ['Arquivos finais', 'Pacote organizado para gráfica, montadora ou equipe técnica executar com menos ambiguidade.'],
];

const valueBlocks = [
  ['Mais valor percebido', 'O evento parece mais estruturado porque cada superfície comunica com intenção.'],
  ['Menos improviso', 'Fornecedor recebe direção visual, medidas, hierarquia e arquivos mais organizados.'],
  ['Mais aprovação', 'Mockups e 3D ajudam diretoria, patrocinador e produção a enxergar antes de executar.'],
  ['Mais consistência', 'Palco, estande, sinalização e sponsor deixam de parecer peças desconectadas.'],
];

const packages = [
  ['Essential Visual Kit', 'Backdrops, telas, totens prioritários e arquivos finais para evento enxuto.'],
  ['Stage & Signage', 'Palco, plenária, púlpito, sinalização, agenda e experiência de circulação.'],
  ['Sponsor Visibility Kit', 'Mapa de entregas, aplicações de marca, estandes, ativações e provas visuais.'],
  ['3D Stand Preview', 'Render, volumetria, fluxo e briefing visual para aprovação antes da produção.'],
];

const technicalChecklist = [
  'Medidas por superfície',
  'Fornecedor responsável',
  'Formato de arquivo',
  'Prazo de aprovação',
  'Versão final',
  'Mockup ou render',
];

const LongectaMaterialsPage: React.FC<LongectaMaterialsPageProps> = ({ onBack, onCongress, onSolutions, onPlans }) => {
  return (
    <div className="longecta-method-page plans-premium-page lon-soft-bg min-h-screen overflow-hidden text-[#111113]">
      <section className="relative px-5 pb-24 pt-6 sm:px-8 lg:px-12">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-white/22" />

        <div className="relative mx-auto max-w-7xl">
          <nav className="lon-glass-panel sticky top-4 z-30 mb-10 flex items-center justify-between rounded-full px-3 py-2">
            <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold text-[#424245] hover:bg-[#1d1d1f] hover:text-white">
              <ArrowLeft size={14} />
              Voltar
            </button>
            <div className="hidden items-center gap-6 text-[11px] font-semibold text-[#6e6e73] md:flex">
              <button onClick={() => handleAnchor('mostruario')} className="hover:text-[#1d1d1f]">Mostruário</button>
              <button onClick={() => handleAnchor('servicos')} className="hover:text-[#1d1d1f]">Serviços</button>
              <button onClick={() => handleAnchor('processo')} className="hover:text-[#1d1d1f]">Processo</button>
              <button onClick={() => handleAnchor('valor')} className="hover:text-[#1d1d1f]">Valor</button>
            </div>
            <button onClick={onPlans} className="button-nowrap rounded-full bg-[#1d1d1f] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#2d2d2f]">
              Ver planos
            </button>
          </nav>

          <header className="mb-8 grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="plans-eyebrow lon-glass-panel mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase text-[#6e6e73]">
                <Box size={13} className="text-[#1d1d1f]" />
                Materiais Longecta
              </p>
              <h1 className="max-w-4xl text-[40px] font-light leading-[1.03] tracking-tight sm:text-[56px] lg:text-[62px]">
                Mostruário visual para ambientes científicos premium.
              </h1>
            </div>
            <div className="max-w-2xl lg:justify-self-end">
              <p className="text-[17px] font-light leading-relaxed text-[#6e6e73] sm:text-[19px]">
                Desenvolvemos a camada estratégica e visual de materiais físicos: artes finais, mockups, renders 3D e arquivos para fornecedores. A produção física fica com gráfica, montadora ou produtora.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Arte final', 'Mockup', 'Projeto 3D', 'Kit técnico', 'Não imprimimos'].map(item => (
                  <span key={item} className="rounded-full border border-black/[0.06] bg-white/72 px-4 py-2 text-[12px] font-semibold text-[#424245] shadow-sm backdrop-blur-xl">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </header>

          <section id="mostruario" className="scroll-mt-24">
            <div className="mb-4 grid gap-4 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Mostruário</p>
                <h2 className="text-[28px] font-light leading-tight tracking-tight sm:text-[36px]">Peças com linguagem de sistema.</h2>
              </div>
              <p className="max-w-3xl text-[15px] leading-relaxed text-[#6e6e73]">
                A página mostra exemplos em branco porque o valor está no sistema: proporção, hierarquia, aplicabilidade, unidade e clareza para produção.
              </p>
            </div>
            <div className="grid gap-3 lg:grid-cols-3">
              {gallery.map(item => (
                <article key={item.label} className="overflow-hidden rounded-[30px] border border-black/[0.055] bg-white/74 shadow-[0_18px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl">
                  <div className="aspect-[16/10] overflow-hidden bg-[#ececee]">
                    <img src={item.image} alt="" className="h-full w-full object-cover object-center" />
                  </div>
                  <div className="p-5">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">{item.label}</p>
                    <h3 className="text-[25px] font-light leading-tight">{item.title}</h3>
                    <p className="mt-4 text-[13px] leading-relaxed text-[#6e6e73]">{item.body}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {item.tags.map(tag => (
                        <span key={tag} className="rounded-full bg-[#f5f5f7] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.11em] text-[#6e6e73]">{tag}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-3 lg:grid-cols-3">
            {position.map(([title, body], index) => (
              <article key={title} className={`rounded-[24px] border p-5 shadow-[0_12px_42px_rgba(0,0,0,0.045)] ${index === 0 ? 'border-[#111113] bg-[#111113] text-white' : 'border-black/[0.055] bg-white/76 text-[#111113] backdrop-blur-xl'}`}>
                <p className={`mb-5 text-[10px] font-bold uppercase tracking-[0.18em] ${index === 0 ? 'text-white/42' : 'text-[#86868b]'}`}>{title}</p>
                <p className={`text-[13px] leading-relaxed ${index === 0 ? 'text-white/66' : 'text-[#5f5f63]'}`}>{body}</p>
              </article>
            ))}
          </section>

          <section className="mt-16 grid gap-3 rounded-[34px] border border-black/[0.055] bg-white/74 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.06)] backdrop-blur-xl lg:grid-cols-[0.72fr_1.28fr]">
            <div className="rounded-[26px] bg-[#111113] p-6 text-white">
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Pacotes premium</p>
              <h2 className="text-[34px] font-extralight leading-tight">Materiais deixam de ser pedidos soltos e viram sistemas de ambiente.</h2>
              <a href={materialsMailto('Quero avaliar um pacote visual Longecta')} className="button-nowrap mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[12px] font-semibold text-[#111113] hover:bg-white/90">
                Avaliar pacote visual
                <ArrowRight size={14} />
              </a>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {packages.map(([title, body], index) => (
                <article key={title} className={`rounded-[24px] border p-5 ${index === 2 ? 'border-[#111113] bg-[#111113] text-white' : 'border-black/[0.045] bg-white text-[#111113]'}`}>
                  <p className={`mb-7 text-[10px] font-bold uppercase tracking-[0.16em] ${index === 2 ? 'text-white/40' : 'text-[#86868b]'}`}>Produto</p>
                  <h3 className="text-[24px] font-light leading-tight">{title}</h3>
                  <p className={`mt-4 text-[13px] leading-relaxed ${index === 2 ? 'text-white/58' : 'text-[#6e6e73]'}`}>{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="servicos" className="mt-16 scroll-mt-24">
            <div className="mb-6 grid gap-4 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Serviços</p>
                <h2 className="text-[38px] font-light leading-tight tracking-tight sm:text-[54px]">O que desenvolvemos.</h2>
              </div>
              <p className="max-w-3xl text-[15px] leading-relaxed text-[#6e6e73]">
                Cada item abaixo é tratado como produto: tem função, aplicação, entrega e papel dentro da experiência física do evento.
              </p>
            </div>

            <div className="overflow-hidden rounded-[30px] border border-black/[0.055] bg-white/76 shadow-[0_22px_70px_rgba(0,0,0,0.06)] backdrop-blur-xl">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <article key={service.title} className={`grid gap-5 px-5 py-5 lg:grid-cols-[52px_minmax(230px,0.72fr)_minmax(280px,1fr)_minmax(230px,0.78fr)] ${index < services.length - 1 ? 'border-b border-black/[0.055]' : ''}`}>
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111113] text-white">
                      <Icon size={17} />
                    </div>
                    <div>
                      <h3 className="text-[22px] font-light leading-tight tracking-tight">{service.title}</h3>
                      <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#86868b]">{service.role}</p>
                    </div>
                    <p className="text-[13px] leading-relaxed text-[#5f5f63]">{service.description}</p>
                    <div>
                      <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Exemplos e entrega</p>
                      <div className="flex flex-wrap gap-2">
                        {[...service.examples.slice(0, 3), service.delivery].map(item => (
                          <span key={item} className="rounded-full bg-[#f5f5f7] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.11em] text-[#6e6e73]">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section id="processo" className="mt-16 scroll-mt-24 grid gap-3 lg:grid-cols-[0.76fr_1.24fr]">
            <div className="rounded-[30px] bg-[#111113] p-7 text-white shadow-[0_24px_80px_rgba(0,0,0,0.16)]">
              <PenTool size={20} className="mb-12 text-white/68" />
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/38">Processo</p>
              <h2 className="text-[36px] font-extralight leading-tight">Da intenção visual ao pacote para fornecedor.</h2>
              <p className="mt-5 text-[14px] leading-relaxed text-white/56">O objetivo é que o cliente aprove com clareza e que a produção execute sem depender de interpretação solta.</p>
            </div>
            <div className="overflow-hidden rounded-[30px] border border-black/[0.055] bg-white/76 shadow-[0_22px_70px_rgba(0,0,0,0.06)] backdrop-blur-xl">
              {process.map(([title, body], index) => (
                <div key={title} className={`grid gap-3 px-5 py-5 sm:grid-cols-[46px_220px_1fr] ${index < process.length - 1 ? 'border-b border-black/[0.055]' : ''}`}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111113] text-[12px] font-bold text-white">{index + 1}</span>
                  <p className="text-[14px] font-semibold text-[#111113]">{title}</p>
                  <p className="text-[13px] leading-relaxed text-[#6e6e73]">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 grid gap-3 rounded-[34px] border border-black/[0.055] bg-white/74 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.06)] backdrop-blur-xl lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Controle de produção</p>
              <h2 className="text-[34px] font-light leading-tight sm:text-[46px]">O pacote técnico reduz ruído entre cliente, fornecedor e produção.</h2>
              <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-[#6e6e73]">Cada peça precisa sair da Longecta com contexto suficiente para aprovação, orçamento, impressão, montagem ou execução digital sem perda de intenção visual.</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {technicalChecklist.map(item => (
                <div key={item} className="flex items-center gap-3 rounded-[20px] bg-white p-4 text-[12px] font-semibold text-[#424245] shadow-sm">
                  <Check size={14} className="shrink-0 text-[#111113]" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section id="valor" className="mt-16 scroll-mt-24">
            <div className="mb-6 grid gap-4 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Valor agregado</p>
                <h2 className="text-[38px] font-light leading-tight tracking-tight sm:text-[54px]">Por que isso muda a percepção.</h2>
              </div>
              <p className="max-w-3xl text-[15px] leading-relaxed text-[#6e6e73]">
                Materiais físicos são pontos de prova. Quando parecem improvisados, o evento perde valor; quando têm sistema, o congresso parece maior, mais confiável e mais desejável.
              </p>
            </div>
            <div className="grid gap-3 lg:grid-cols-4">
              {valueBlocks.map(([title, body], index) => (
                <article key={title} className={`rounded-[28px] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] ${index === 0 ? 'bg-[#111113] text-white' : 'border border-black/[0.055] bg-white/74 text-[#111113] backdrop-blur-xl'}`}>
                  <Check size={18} className={`mb-10 ${index === 0 ? 'text-white/70' : 'text-[#111113]/70'}`} />
                  <h3 className="text-[24px] font-light leading-tight">{title}</h3>
                  <p className={`mt-4 text-[13px] leading-relaxed ${index === 0 ? 'text-white/58' : 'text-[#6e6e73]'}`}>{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-16 grid gap-3 lg:grid-cols-3">
            {[
              ['Congressos', 'Palco, plenária, credenciamento, photo opportunity, agenda, sinalização e áreas de sponsor.', Presentation],
              ['Patrocinadores', 'Estandes, ativações, painéis, balcões, totens, displays e presença de marca no ambiente.', Store],
              ['Produção', 'Arquivos finais, mockups, renders, referências e pacote para gráfica, montadora ou equipe técnica.', ClipboardList],
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
                <h2 className="max-w-4xl text-[36px] font-extralight leading-tight sm:text-[52px]">Quando o espaço parece premium, o valor do congresso sobe antes da primeira palestra.</h2>
                <p className="mt-5 max-w-2xl text-[14px] leading-relaxed text-white/58">A Longecta organiza a linguagem visual para que cada superfície tenha função, presença e coerência com a marca científica do evento.</p>
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
