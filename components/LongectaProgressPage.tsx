import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Brain,
  Check,
  ClipboardCheck,
  Database,
  Flag,
  Layers3,
  MessageSquare,
  Milestone,
  PenLine,
  RefreshCw,
  Send,
  Sparkles,
  Target,
  UploadCloud,
} from 'lucide-react';

interface LongectaProgressPageProps {
  onBack: () => void;
  onMethod: () => void;
  onSolutions: () => void;
  onCongress: () => void;
  onPlans: () => void;
}

const progressMailto = (subject: string) =>
  `mailto:contato@lonsuite.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Olá, quero entender o fluxo Progress da Longecta e como ele se aplicaria ao meu contexto. Pode me orientar nos próximos passos?')}`;

const flowSteps = [
  {
    id: '00',
    icon: MessageSquare,
    title: 'Contato',
    headline: 'Entendemos o momento.',
    agency: 'Escuta, contexto e prioridade.',
    client: 'Conta objetivo e urgência.',
    output: 'Briefing inicial',
    x: 5,
    y: 18,
  },
  {
    id: '01',
    icon: Target,
    title: 'Diagnóstico',
    headline: 'Achamos o valor escondido.',
    agency: 'Mapeia gargalo e oportunidade.',
    client: 'Envia materiais e referências.',
    output: 'Mapa de valor',
    x: 23,
    y: 18,
  },
  {
    id: '02',
    icon: Layers3,
    title: 'Direção',
    headline: 'Definimos o plano certo.',
    agency: 'Escopo, régua e entregáveis.',
    client: 'Aprova direção e prioridade.',
    output: 'Plano de execução',
    x: 41,
    y: 18,
  },
  {
    id: '03',
    icon: UploadCloud,
    title: 'Acervo',
    headline: 'Organizamos a matéria-prima.',
    agency: 'Classifica, interpreta e estrutura.',
    client: 'Libera arquivos e acessos.',
    output: 'Base inteligente',
    x: 59,
    y: 18,
  },
  {
    id: '04',
    icon: Brain,
    title: 'Estratégia',
    headline: 'Criamos a narrativa.',
    agency: 'Mensagem, conceito e sistema.',
    client: 'Valida tom e precisão.',
    output: 'Sistema aprovado',
    x: 77,
    y: 18,
  },
  {
    id: '05',
    icon: PenLine,
    title: 'Produção',
    headline: 'Executamos com acabamento.',
    agency: 'Copy, design, peças e materiais.',
    client: 'Comenta pontos críticos.',
    output: 'Entregas premium',
    x: 77,
    y: 62,
  },
  {
    id: '06',
    icon: ClipboardCheck,
    title: 'Aprovação',
    headline: 'Revisamos sem ruído.',
    agency: 'Organiza ajustes e versões.',
    client: 'Aprova ou corrige nuances.',
    output: 'Material final',
    x: 59,
    y: 62,
  },
  {
    id: '07',
    icon: Send,
    title: 'Ativação',
    headline: 'Colocamos em circulação.',
    agency: 'Publica, envia, lança ou entrega.',
    client: 'Aciona equipe e canais.',
    output: 'Valor no mercado',
    x: 41,
    y: 62,
  },
  {
    id: '08',
    icon: BadgeCheck,
    title: 'Leitura',
    headline: 'Transformamos retorno em inteligência.',
    agency: 'Analisa impacto e aprendizados.',
    client: 'Compartilha retorno real.',
    output: 'Relatório de evolução',
    x: 23,
    y: 62,
  },
  {
    id: '09',
    icon: RefreshCw,
    title: 'Recomeço',
    headline: 'O próximo ciclo começa melhor.',
    agency: 'Propõe expansão ou nova régua.',
    client: 'Escolhe a próxima prioridade.',
    output: 'Nova evolução',
    x: 5,
    y: 62,
  },
];

const lanes = [
  ['Longecta faz', 'Estratégia, curadoria, copy, design e execução.'],
  ['Cliente faz', 'Contexto, decisões, aprovações e validação técnica.'],
  ['Plataforma guarda', 'Histórico, acervo, versões, aprendizados e próximos passos.'],
];

const proof = [
  ['Antes', 'ideias soltas'],
  ['Durante', 'operação clara'],
  ['Depois', 'memória reutilizável'],
];

const LongectaProgressPage: React.FC<LongectaProgressPageProps> = ({ onBack, onMethod, onSolutions, onCongress, onPlans }) => {
  return (
    <div className="longecta-method-page plans-premium-page lon-soft-bg min-h-screen overflow-hidden text-[#111113]">
      <section className="relative px-5 pb-20 pt-6 sm:px-8 lg:px-12">
        <div className="absolute inset-x-0 top-0 h-[420px] bg-white/30" />

        <div className="relative mx-auto max-w-7xl">
          <nav className="lon-glass-panel sticky top-4 z-30 mb-12 flex items-center justify-between rounded-full px-3 py-2">
            <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold text-[#424245] hover:bg-[#1d1d1f] hover:text-white">
              <ArrowLeft size={14} />
              Voltar
            </button>
            <div className="hidden items-center gap-6 text-[11px] font-semibold text-[#6e6e73] md:flex">
              <a href="#mapa" className="hover:text-[#1d1d1f]">Mapa</a>
              <a href="#responsabilidades" className="hover:text-[#1d1d1f]">Responsabilidades</a>
              <a href="#ciclo" className="hover:text-[#1d1d1f]">Ciclo</a>
            </div>
            <button onClick={onPlans} className="button-nowrap rounded-full bg-[#1d1d1f] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#2d2d2f]">
              Ver planos
            </button>
          </nav>

          <header className="mx-auto mb-12 max-w-4xl text-center">
            <p className="plans-eyebrow lon-glass-panel mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase text-[#6e6e73]">
              <Milestone size={13} className="text-[#1d1d1f]" />
              Progress Longecta
            </p>
            <h1 className="text-[42px] font-light leading-[1.02] sm:text-[68px]">
              Como a Longecta transforma contato em entrega, entrega em inteligência e inteligência em próximo ciclo.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-[16px] font-light leading-relaxed text-[#6e6e73] sm:text-[18px]">
              Uma visão simples do que fazemos, do que o cliente precisa fazer e do que a plataforma guarda para a operação ficar cada vez mais precisa.
            </p>
          </header>

          <section id="mapa" className="scroll-mt-24">
            <div className="rounded-[34px] border border-black/[0.055] bg-white/76 p-4 shadow-[0_26px_90px_rgba(0,0,0,0.07)] backdrop-blur-xl sm:p-6">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Fluxograma operacional</p>
                  <h2 className="text-[28px] font-light leading-tight sm:text-[40px]">O caminho completo, sem excesso de texto.</h2>
                </div>
                <a href={progressMailto('Quero entender meu fluxo Progress Longecta')} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-[#111113] px-5 py-3 text-[12px] font-semibold text-white hover:bg-[#2d2d2f]">
                  Entender meu fluxo
                  <ArrowRight size={14} />
                </a>
              </div>

              <div className="relative hidden min-h-[620px] lg:block">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 82" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M 10 28 H 82 Q 94 28 94 40 Q 94 52 82 52 H 10 Q 3 52 3 61 Q 3 70 10 70 H 92" fill="none" stroke="rgba(29,29,31,0.16)" strokeWidth="0.22" />
                  <path d="M 10 28 H 82 Q 94 28 94 40 Q 94 52 82 52 H 10" fill="none" stroke="rgba(29,29,31,0.07)" strokeWidth="3.2" strokeLinecap="round" />
                </svg>

                {flowSteps.map((step, index) => {
                  const Icon = step.icon;
                  const dark = index === 0 || index === 4 || index === 9;
                  return (
                    <article
                      key={step.id}
                      className={`absolute w-[210px] -translate-x-1/2 rounded-[26px] border p-5 shadow-[0_18px_56px_rgba(0,0,0,0.06)] ${dark ? 'border-[#111113] bg-[#111113] text-white' : 'border-black/[0.055] bg-white text-[#111113]'}`}
                      style={{ left: `${step.x}%`, top: `${step.y}%` }}
                    >
                      <div className="mb-5 flex items-center justify-between gap-4">
                        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${dark ? 'bg-white text-[#111113]' : 'bg-[#111113] text-white'}`}>
                          <Icon size={15} />
                        </span>
                        <span className={`text-[11px] font-bold ${dark ? 'text-white/42' : 'text-[#86868b]'}`}>{step.id}</span>
                      </div>
                      <p className={`mb-2 text-[9px] font-bold uppercase tracking-[0.16em] ${dark ? 'text-white/42' : 'text-[#86868b]'}`}>{step.title}</p>
                      <h3 className="text-[21px] font-light leading-tight">{step.headline}</h3>
                      <p className={`mt-5 text-[10px] font-bold uppercase tracking-[0.14em] ${dark ? 'text-white/42' : 'text-[#86868b]'}`}>Saída</p>
                      <p className={`mt-1 text-[12px] leading-relaxed ${dark ? 'text-white/68' : 'text-[#5f5f63]'}`}>{step.output}</p>
                    </article>
                  );
                })}
              </div>

              <div className="grid gap-3 lg:hidden">
                {flowSteps.map((step, index) => {
                  const Icon = step.icon;
                  const dark = index === 0 || index === 4 || index === 9;
                  return (
                    <article key={step.id} className={`grid gap-4 rounded-[24px] border p-4 shadow-sm sm:grid-cols-[48px_1fr] ${dark ? 'border-[#111113] bg-[#111113] text-white' : 'border-black/[0.055] bg-white text-[#111113]'}`}>
                      <span className={`flex h-11 w-11 items-center justify-center rounded-full ${dark ? 'bg-white text-[#111113]' : 'bg-[#111113] text-white'}`}>
                        <Icon size={16} />
                      </span>
                      <div>
                        <p className={`mb-1 text-[10px] font-bold uppercase tracking-[0.16em] ${dark ? 'text-white/42' : 'text-[#86868b]'}`}>{step.id} · {step.title}</p>
                        <h3 className="text-[23px] font-light leading-tight">{step.headline}</h3>
                        <p className={`mt-3 text-[12px] leading-relaxed ${dark ? 'text-white/62' : 'text-[#6e6e73]'}`}>{step.output}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="responsabilidades" className="mt-12 scroll-mt-24 grid gap-3 lg:grid-cols-3">
            {lanes.map(([title, body], index) => (
              <article key={title} className={`rounded-[30px] border p-6 shadow-[0_18px_60px_rgba(0,0,0,0.055)] ${index === 0 ? 'border-[#111113] bg-[#111113] text-white' : 'border-black/[0.055] bg-white/74 text-[#111113] backdrop-blur-xl'}`}>
                <div className={`mb-10 flex h-11 w-11 items-center justify-center rounded-full ${index === 0 ? 'bg-white text-[#111113]' : 'bg-[#111113] text-white'}`}>
                  {index === 0 ? <Sparkles size={17} /> : index === 1 ? <Check size={17} /> : <Database size={17} />}
                </div>
                <h2 className="text-[28px] font-light leading-tight">{title}</h2>
                <p className={`mt-4 text-[13px] leading-relaxed ${index === 0 ? 'text-white/62' : 'text-[#6e6e73]'}`}>{body}</p>
              </article>
            ))}
          </section>

          <section id="ciclo" className="mt-12 grid gap-3 rounded-[34px] border border-black/[0.055] bg-white/74 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.06)] backdrop-blur-xl lg:grid-cols-[0.74fr_1.26fr]">
            <div className="rounded-[28px] bg-[#111113] p-7 text-white">
              <RefreshCw size={20} className="mb-12 text-white/70" />
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/38">O ciclo real</p>
              <h2 className="text-[36px] font-extralight leading-tight">O trabalho não termina na entrega. Ele volta como memória para a próxima decisão.</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {proof.map(([title, body], index) => (
                <article key={title} className={`rounded-[26px] border p-6 ${index === 1 ? 'border-[#111113] bg-[#111113] text-white' : 'border-black/[0.045] bg-white text-[#111113]'}`}>
                  <p className={`mb-9 text-[10px] font-bold uppercase tracking-[0.18em] ${index === 1 ? 'text-white/42' : 'text-[#86868b]'}`}>{title}</p>
                  <p className="text-[30px] font-extralight leading-tight">{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-12 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
            <button onClick={onMethod} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.07] bg-white/72 px-6 py-3 text-[13px] font-semibold text-[#1d1d1f] shadow-sm backdrop-blur-xl hover:bg-white">
              Ver método
              <ArrowRight size={15} />
            </button>
            <button onClick={onSolutions} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.07] bg-white/72 px-6 py-3 text-[13px] font-semibold text-[#1d1d1f] shadow-sm backdrop-blur-xl hover:bg-white">
              Ver soluções
              <ArrowRight size={15} />
            </button>
            <button onClick={onCongress} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-[#111113] px-6 py-3 text-[13px] font-semibold text-white hover:bg-[#2d2d2f]">
              Aplicar em congressos
              <Flag size={15} />
            </button>
          </section>
        </div>
      </section>
    </div>
  );
};

export default LongectaProgressPage;
