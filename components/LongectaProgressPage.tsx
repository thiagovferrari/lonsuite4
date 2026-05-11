import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Brain,
  Check,
  CircleDot,
  ClipboardCheck,
  Clock3,
  Database,
  FileCheck2,
  Flag,
  Layers3,
  LineChart,
  MessageSquare,
  Milestone,
  PenLine,
  RefreshCw,
  Send,
  Sparkles,
  Target,
  UploadCloud,
  Wand2,
} from 'lucide-react';

interface LongectaProgressPageProps {
  onBack: () => void;
  onMethod: () => void;
  onSolutions: () => void;
  onCongress: () => void;
  onPlans: () => void;
}

const progressMailto = (subject: string) =>
  `mailto:contato@lonsuite.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Olá, quero entender o fluxo Progress da Longecta e como a operação funcionaria para meu contexto. Pode me orientar nos próximos passos?')}`;

const journey = [
  {
    icon: MessageSquare,
    phase: '01',
    title: 'Contato qualificado',
    time: 'Primeira conversa',
    promise: 'Entendemos o cenário antes de sugerir qualquer entrega.',
    longecta: 'Escutamos objetivo, urgência, público, ativos disponíveis, gargalos e nível de maturidade da comunicação.',
    client: 'Conta o momento atual, mostra referências, define prioridade e sinaliza quem decide.',
    platform: 'Cria o primeiro contexto estratégico: segmento, intenção, materiais, histórico e oportunidade.',
    output: 'Briefing inicial claro',
  },
  {
    icon: Target,
    phase: '02',
    title: 'Diagnóstico',
    time: 'Mapa de valor',
    promise: 'O problema certo vem antes da solução bonita.',
    longecta: 'Identificamos onde o valor está escondido: acervo, programação, speakers, serviço, campanha, patrocínio ou experiência.',
    client: 'Compartilha materiais, datas, metas, restrições, exemplos bons e problemas que não podem se repetir.',
    platform: 'Organiza sinais por prioridade, impacto comercial, complexidade e potencial de reaproveitamento.',
    output: 'Oportunidade priorizada',
  },
  {
    icon: Layers3,
    phase: '03',
    title: 'Arquitetura',
    time: 'Escopo e direção',
    promise: 'A operação ganha forma antes da produção começar.',
    longecta: 'Define método, pacote, entregáveis, régua, responsáveis, checkpoints e lógica de aprovação.',
    client: 'Valida escopo, aprova direção, confirma equipe envolvida e alinha critérios de sucesso.',
    platform: 'Transforma a decisão em um plano vivo: fases, materiais, status, responsáveis e dependências.',
    output: 'Plano operacional premium',
  },
  {
    icon: UploadCloud,
    phase: '04',
    title: 'Imersão e acervo',
    time: 'Entrada organizada',
    promise: 'Tudo que estava solto vira matéria-prima inteligível.',
    longecta: 'Recebe, limpa, categoriza e interpreta arquivos, referências, histórico, imagens, aulas, programação e mensagens.',
    client: 'Envia o que já existe, responde lacunas críticas e libera acessos ou materiais necessários.',
    platform: 'Indexa contexto, tema, origem, finalidade, sensibilidade, versão e potencial de uso.',
    output: 'Base de inteligência',
  },
  {
    icon: Brain,
    phase: '05',
    title: 'Estratégia criativa',
    time: 'Narrativa e sistema',
    promise: 'A estética nasce de uma tese, não de decoração.',
    longecta: 'Cria narrativa, mensagens-chave, conceito, hierarquia visual, régua editorial e ângulos de comunicação.',
    client: 'Escolhe direção, corrige nuances técnicas e protege precisão médica ou institucional.',
    platform: 'Registra tom de voz, decisões, argumentos aprovados, rejeições e padrões reutilizáveis.',
    output: 'Sistema de comunicação',
  },
  {
    icon: PenLine,
    phase: '06',
    title: 'Produção premium',
    time: 'Copy, design e materiais',
    promise: 'A execução vira uma linha de montagem sofisticada.',
    longecta: 'Produz posts, páginas, apresentações, kits, materiais técnicos, campanhas, relatórios ou peças presenciais.',
    client: 'Acompanha pontos críticos, aprova blocos e evita refazer o briefing a cada entrega.',
    platform: 'Controla versões, status, entregáveis, pendências, arquivos finais e histórico de aprovação.',
    output: 'Entregas prontas para uso',
  },
  {
    icon: ClipboardCheck,
    phase: '07',
    title: 'Aprovação sem ruído',
    time: 'Revisão guiada',
    promise: 'O cliente aprova com clareza, não por troca infinita de mensagens.',
    longecta: 'Apresenta racional, organiza ajustes, protege consistência e transforma feedback em decisão.',
    client: 'Aprova, comenta ou ajusta com foco no que muda resultado, precisão ou percepção.',
    platform: 'Preserva histórico de versão, comentários, decisões e critérios para próximas entregas.',
    output: 'Material validado',
  },
  {
    icon: Send,
    phase: '08',
    title: 'Publicação e ativação',
    time: 'Entrega em circulação',
    promise: 'O material sai do arquivo e começa a trabalhar.',
    longecta: 'Orquestra lançamento, distribuição, envio, publicação, speaker kit, e-mail, sponsor, evento ou apresentação.',
    client: 'Publica, encaminha, apresenta, libera equipe, aciona stakeholders ou autoriza distribuição.',
    platform: 'Registra destino, formato, canal, data, público, material final e contexto de uso.',
    output: 'Valor em movimento',
  },
  {
    icon: BarChart3,
    phase: '09',
    title: 'Leitura de impacto',
    time: 'Aprendizado',
    promise: 'O que aconteceu vira inteligência, não só lembrança.',
    longecta: 'Analisa desempenho, percepção, aprendizados, lacunas, objeções, entregas e oportunidades de expansão.',
    client: 'Compartilha retorno de campo, dúvidas recebidas, métricas disponíveis e decisões para o próximo ciclo.',
    platform: 'Consolida evidências, arquivos finais, métricas, aprendizados e recomendações.',
    output: 'Relatório de inteligência',
  },
  {
    icon: RefreshCw,
    phase: '10',
    title: 'Recomeço mais forte',
    time: 'Novo ciclo',
    promise: 'Cada ciclo começa com mais repertório e menos improviso.',
    longecta: 'Propõe próxima campanha, nova edição, novo kit, nova régua ou expansão de produto.',
    client: 'Escolhe prioridade seguinte e usa o histórico acumulado para acelerar a próxima decisão.',
    platform: 'Reabre o ciclo com contexto enriquecido, memória estratégica e biblioteca pronta para reutilização.',
    output: 'Próxima evolução',
  },
];

const lanes = [
  ['Longecta', 'Estratégia, curadoria, copy, design, operação, inteligência e acabamento premium.'],
  ['Cliente', 'Contexto, decisões, aprovações, conhecimento técnico e validação de prioridade.'],
  ['Plataforma', 'Memória, status, arquivos, aprovações, histórico, aprendizado e reuso.'],
];

const operatingPrinciples = [
  ['Clareza antes de volume', 'Cada entrega nasce de uma decisão estratégica, não de uma lista infinita de peças.'],
  ['Produção com memória', 'Nada morre no envio final. Tudo volta para o sistema como repertório reutilizável.'],
  ['Aprovação com direção', 'O cliente revisa o que importa: precisão, posicionamento, reputação e impacto.'],
  ['Ciclo contínuo', 'A operação melhora a cada campanha porque o contexto acumulado fica vivo.'],
];

const proofStack = [
  ['Briefing', 'O problema é traduzido em direção.'],
  ['Sistema', 'A direção vira arquitetura de execução.'],
  ['Entrega', 'A arquitetura vira material premium.'],
  ['Impacto', 'O material vira aprendizado e próximo ciclo.'],
];

const LongectaProgressPage: React.FC<LongectaProgressPageProps> = ({ onBack, onMethod, onSolutions, onCongress, onPlans }) => {
  return (
    <div className="longecta-method-page plans-premium-page lon-soft-bg min-h-screen overflow-hidden text-[#111113]">
      <section className="relative px-5 pb-24 pt-6 sm:px-8 lg:px-12">
        <div className="absolute inset-x-0 top-0 h-[760px] bg-white/20" />
        <div className="plans-orbit absolute right-[8%] top-28 h-56 w-56 rounded-full border border-black/[0.05]" />

        <div className="relative mx-auto max-w-7xl">
          <nav className="lon-glass-panel sticky top-4 z-30 mb-12 flex items-center justify-between rounded-full px-3 py-2">
            <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold text-[#424245] hover:bg-[#1d1d1f] hover:text-white">
              <ArrowLeft size={14} />
              Voltar
            </button>
            <div className="hidden items-center gap-6 text-[11px] font-semibold text-[#6e6e73] md:flex">
              <a href="#timeline" className="hover:text-[#1d1d1f]">Timeline</a>
              <a href="#camadas" className="hover:text-[#1d1d1f]">Camadas</a>
              <a href="#governanca" className="hover:text-[#1d1d1f]">Governança</a>
              <a href="#recomeco" className="hover:text-[#1d1d1f]">Recomeço</a>
            </div>
            <button onClick={onPlans} className="button-nowrap rounded-full bg-[#1d1d1f] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#2d2d2f]">
              Ver planos
            </button>
          </nav>

          <header className="grid min-h-[680px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="plans-eyebrow lon-glass-panel mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase text-[#6e6e73]">
                <Milestone size={13} className="text-[#1d1d1f]" />
                Progress Longecta
              </p>
              <h1 className="max-w-5xl text-[44px] leading-[0.98] sm:text-[66px] lg:text-[76px]">
                A experiência completa, do primeiro contato ao próximo ciclo de crescimento.
              </h1>
              <p className="mt-8 max-w-2xl text-[18px] font-light leading-relaxed text-[#6e6e73] sm:text-[21px]">
                Uma operação híbrida de estratégia, plataforma, inteligência e execução premium. O cliente entende o que vem primeiro, o que precisa aprovar, o que a Longecta entrega e como cada ciclo deixa a próxima etapa mais forte.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href={progressMailto('Quero entender o Progress Longecta')} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-6 py-3 text-[13px] font-semibold text-white shadow-[0_18px_44px_rgba(0,0,0,0.18)] hover:bg-[#2d2d2f]">
                  Quero ver meu fluxo
                  <ArrowRight size={15} />
                </a>
                <a href="#timeline" className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.07] bg-white/72 px-6 py-3 text-[13px] font-semibold text-[#1d1d1f] shadow-sm backdrop-blur-xl hover:bg-white">
                  Explorar timeline
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[40px] bg-[#111113] p-4 text-white shadow-[0_42px_130px_rgba(0,0,0,0.26)]">
                <div className="grid gap-2 md:grid-cols-[1.2fr_0.8fr]">
                  <div className="relative min-h-[480px] overflow-hidden rounded-[30px] bg-[#050506]">
                    <img src="/assets/longecta-doctor-macbook.png" alt="Profissional médico usando plataforma Longecta" className="absolute inset-0 h-full w-full object-cover object-center grayscale opacity-72" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,19,0.10),rgba(17,17,19,0.92))]" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Operação visível</p>
                      <h2 className="text-[34px] font-extralight leading-tight">O cliente sabe onde está, o que falta e por que aquilo importa.</h2>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    {proofStack.map(([title, body], index) => (
                      <div key={title} className={`rounded-[26px] p-5 ${index === 1 ? 'bg-white text-[#111113]' : 'bg-white/[0.08] text-white'}`}>
                        <p className={`mb-6 text-[10px] font-bold uppercase tracking-[0.16em] ${index === 1 ? 'text-[#86868b]' : 'text-white/40'}`}>{title}</p>
                        <p className={`text-[13px] leading-relaxed ${index === 1 ? 'text-[#424245]' : 'text-white/58'}`}>{body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="lon-glass-panel-strong absolute -bottom-5 left-5 right-5 rounded-[24px] px-5 py-4 shadow-[0_18px_56px_rgba(29,29,31,0.12)] sm:left-10 sm:right-10">
                <div className="grid gap-3 text-center sm:grid-cols-3">
                  {['Estratégia', 'Execução', 'Memória'].map(item => (
                    <p key={item} className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6e6e73]">{item}</p>
                  ))}
                </div>
              </div>
            </div>
          </header>

          <section id="timeline" className="mt-24 scroll-mt-24">
            <div className="mb-10 grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Timeline infográfica</p>
                <h2 className="text-[40px] font-semibold leading-tight sm:text-[60px]">Uma barra de progresso para uma operação que não improvisa.</h2>
              </div>
              <p className="max-w-3xl text-[15px] leading-relaxed text-[#6e6e73]">
                A jornada mostra a sequência real de trabalho: diagnóstico, arquitetura, acervo, estratégia, produção, aprovação, ativação, leitura e recomeço. Cada fase tem uma entrega, uma responsabilidade do cliente e uma camada de memória.
              </p>
            </div>

            <div className="mb-5 overflow-hidden rounded-[32px] border border-black/[0.055] bg-white/72 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.07)] backdrop-blur-xl">
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-5 lg:grid-cols-10">
                {journey.map((step, index) => (
                  <a key={step.title} href={`#step-${step.phase}`} className={`group flex min-h-[118px] flex-col justify-between rounded-[22px] p-3 transition-all hover:-translate-y-0.5 ${index === 0 || index === journey.length - 1 ? 'bg-[#111113] text-white' : 'bg-[#f5f5f7] text-[#111113] hover:bg-white'}`}>
                    <span className={`text-[10px] font-bold uppercase tracking-[0.16em] ${index === 0 || index === journey.length - 1 ? 'text-white/42' : 'text-[#86868b]'}`}>{step.phase}</span>
                    <span className="text-[11px] font-semibold leading-tight">{step.title}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-6 top-0 hidden h-full w-px bg-[linear-gradient(180deg,transparent,rgba(17,17,19,0.22),transparent)] lg:block" />
              <div className="grid gap-5">
                {journey.map((step, index) => {
                  const Icon = step.icon;
                  const featured = index === 2 || index === 5 || index === 9;
                  return (
                    <article key={step.title} id={`step-${step.phase}`} className={`scroll-mt-24 rounded-[34px] border p-5 shadow-[0_22px_70px_rgba(0,0,0,0.06)] ${featured ? 'border-[#111113] bg-[#111113] text-white' : 'border-black/[0.055] bg-white/74 text-[#111113] backdrop-blur-xl'}`}>
                      <div className="grid gap-6 lg:grid-cols-[92px_0.8fr_1.2fr] lg:items-start">
                        <div className="flex items-center gap-4 lg:block">
                          <div className={`flex h-14 w-14 items-center justify-center rounded-full ${featured ? 'bg-white text-[#111113]' : 'bg-[#111113] text-white'}`}>
                            <Icon size={20} />
                          </div>
                          <p className={`mt-0 text-[12px] font-bold uppercase tracking-[0.18em] lg:mt-5 ${featured ? 'text-white/42' : 'text-[#86868b]'}`}>{step.time}</p>
                        </div>
                        <div>
                          <p className={`mb-3 text-[10px] font-bold uppercase tracking-[0.18em] ${featured ? 'text-white/42' : 'text-[#86868b]'}`}>Fase {step.phase}</p>
                          <h3 className="text-[34px] font-light leading-tight sm:text-[44px]">{step.title}</h3>
                          <p className={`mt-5 text-[15px] leading-relaxed ${featured ? 'text-white/62' : 'text-[#5f5f63]'}`}>{step.promise}</p>
                          <div className={`mt-7 rounded-[22px] p-4 ${featured ? 'bg-white text-[#111113]' : 'bg-[#f5f5f7]'}`}>
                            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Entrega da fase</p>
                            <p className="text-[20px] font-light leading-tight">{step.output}</p>
                          </div>
                        </div>
                        <div className="grid gap-3">
                          {[
                            ['Longecta faz', step.longecta, Wand2],
                            ['Cliente participa', step.client, Check],
                            ['Plataforma registra', step.platform, Database],
                          ].map(([label, body, LaneIcon], laneIndex) => {
                            const TypedIcon = LaneIcon as React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
                            return (
                              <div key={label as string} className={`grid gap-3 rounded-[24px] p-4 sm:grid-cols-[38px_1fr] ${featured ? 'bg-white/[0.08]' : 'bg-white'} border ${featured ? 'border-white/10' : 'border-black/[0.045]'}`}>
                                <span className={`flex h-9 w-9 items-center justify-center rounded-full ${featured ? laneIndex === 1 ? 'bg-white text-[#111113]' : 'bg-white/10 text-white' : 'bg-[#111113] text-white'}`}>
                                  <TypedIcon size={15} />
                                </span>
                                <span>
                                  <span className={`block text-[9px] font-bold uppercase tracking-[0.18em] ${featured ? 'text-white/42' : 'text-[#86868b]'}`}>{label as string}</span>
                                  <span className={`mt-2 block text-[13px] leading-relaxed ${featured ? 'text-white/60' : 'text-[#5f5f63]'}`}>{body as string}</span>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="camadas" className="mt-24 scroll-mt-24 overflow-hidden rounded-[42px] bg-[#111113] text-white shadow-[0_38px_120px_rgba(0,0,0,0.25)]">
            <div className="grid lg:grid-cols-[0.96fr_1.04fr]">
              <div className="relative min-h-[560px] overflow-hidden bg-[#050506]">
                <img src="/assets/longecta-congress-networking.png" alt="Equipe e networking em operação Longecta" className="h-full w-full object-cover object-center grayscale opacity-78" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,19,0.82),rgba(17,17,19,0.12))]" />
                <div className="absolute bottom-8 left-8 right-8 rounded-[28px] border border-white/12 bg-black/35 p-6 backdrop-blur-xl">
                  <LineChart size={18} className="mb-8 text-white/58" />
                  <p className="text-[28px] font-extralight leading-tight">A agência opera. A plataforma lembra. O cliente decide com menos ruído.</p>
                </div>
              </div>
              <div className="p-8 sm:p-12 lg:p-16">
                <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/38">Três camadas trabalhando juntas</p>
                <h2 className="max-w-3xl text-[40px] font-extralight leading-tight sm:text-[62px]">Não é agência tradicional. Não é ferramenta solta. É operação híbrida.</h2>
                <div className="mt-9 grid gap-3">
                  {lanes.map(([title, body], index) => (
                    <article key={title} className={`rounded-[24px] border p-5 ${index === 0 ? 'border-white/24 bg-white text-[#111113]' : 'border-white/10 bg-white/[0.06] text-white'}`}>
                      <div className="mb-5 flex items-center gap-3">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold ${index === 0 ? 'bg-[#111113] text-white' : 'bg-white/10 text-white/70'}`}>{index + 1}</span>
                        <p className="text-[18px] font-semibold">{title}</p>
                      </div>
                      <p className={`text-[13px] leading-relaxed ${index === 0 ? 'text-[#6e6e73]' : 'text-white/56'}`}>{body}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="governanca" className="mt-24 scroll-mt-24">
            <div className="mb-8 max-w-4xl">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Governança premium</p>
              <h2 className="text-[40px] font-semibold leading-tight sm:text-[60px]">A sensação premium vem da clareza operacional, não só do visual.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {operatingPrinciples.map(([title, body], index) => (
                <article key={title} className={`rounded-[30px] border p-6 shadow-[0_22px_70px_rgba(0,0,0,0.06)] ${index === 1 ? 'border-[#111113] bg-[#111113] text-white' : 'border-black/[0.055] bg-white/70 text-[#111113] backdrop-blur-xl'}`}>
                  <BadgeCheck size={18} className={`mb-10 ${index === 1 ? 'text-white/70' : 'text-[#1d1d1f]/70'}`} />
                  <h3 className="text-[25px] font-light leading-tight">{title}</h3>
                  <p className={`mt-4 text-[13px] leading-relaxed ${index === 1 ? 'text-white/58' : 'text-[#6e6e73]'}`}>{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="recomeco" className="mt-24 grid gap-3 rounded-[42px] border border-black/[0.055] bg-white/74 p-5 shadow-[0_26px_90px_rgba(0,0,0,0.08)] backdrop-blur-xl lg:grid-cols-[0.76fr_1.24fr]">
            <div className="rounded-[34px] bg-[#111113] p-7 text-white">
              <RefreshCw size={20} className="mb-12 text-white/68" />
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/38">O fim é o começo</p>
              <h2 className="text-[38px] font-extralight leading-tight sm:text-[52px]">Cada entrega aumenta a velocidade e a inteligência da próxima.</h2>
              <p className="mt-6 text-[14px] leading-relaxed text-white/58">Esse é o ponto que separa a Longecta de fornecedores comuns: o trabalho não acaba no arquivo final. Ele volta como contexto, aprendizado e vantagem estratégica.</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                ['O que foi feito', 'Materiais, campanhas, relatórios, kits, apresentações e peças finais ficam organizados.'],
                ['O que aprendemos', 'Mensagens, objeções, métricas, aprovações e decisões viram repertório acionável.'],
                ['O que vem depois', 'A próxima campanha nasce com base real, não com briefing refeito do zero.'],
                ['Onde cresce', 'A operação pode expandir para congresso, clínica, autoridade médica, patrocinador ou acervo.'],
              ].map(([title, body], index) => (
                <article key={title} className={`rounded-[28px] p-6 ${index === 2 ? 'bg-[#111113] text-white' : 'bg-white text-[#111113]'} border border-black/[0.045]`}>
                  <CircleDot size={18} className={`mb-9 ${index === 2 ? 'text-white/70' : 'text-[#111113]/70'}`} />
                  <h3 className="text-[25px] font-light leading-tight">{title}</h3>
                  <p className={`mt-4 text-[13px] leading-relaxed ${index === 2 ? 'text-white/58' : 'text-[#6e6e73]'}`}>{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="relative mt-24 overflow-hidden rounded-[42px] bg-[#111113] px-7 py-16 text-center text-white shadow-[0_38px_130px_rgba(0,0,0,0.26)] sm:px-12 sm:py-20">
            <img src="/assets/longecta-doctor-camera.png" alt="" className="absolute inset-0 h-full w-full object-cover object-center grayscale opacity-42" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,19,0.95),rgba(17,17,19,0.62),rgba(17,17,19,0.95))]" />
            <div className="relative z-10">
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/44">Progress Longecta</p>
              <h2 className="mx-auto max-w-4xl text-[42px] font-extralight leading-tight sm:text-[66px]">O cliente não compra peças. Compra uma operação que sabe evoluir.</h2>
              <p className="mx-auto mt-7 max-w-2xl text-[16px] font-light leading-relaxed text-white/62">
                Do contato ao recomeço, a Longecta transforma intenção em estrutura, estrutura em execução e execução em memória estratégica.
              </p>
              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <a href={progressMailto('Quero estruturar meu Progress Longecta')} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-[13px] font-semibold text-[#111113] hover:bg-white/90">
                  Estruturar meu fluxo
                  <Send size={15} />
                </a>
                <button onClick={onMethod} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3 text-[13px] font-semibold text-white backdrop-blur hover:bg-white/16">
                  Ver método
                  <ArrowRight size={15} />
                </button>
                <button onClick={onSolutions} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3 text-[13px] font-semibold text-white backdrop-blur hover:bg-white/16">
                  Soluções
                  <Sparkles size={15} />
                </button>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-3 sm:grid-cols-2">
            <button onClick={onCongress} className="rounded-[30px] border border-black/[0.055] bg-white/72 p-6 text-left shadow-[0_20px_70px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white">
              <Flag size={18} className="mb-8 text-[#111113]/70" />
              <h3 className="text-[28px] font-light leading-tight">Aplicar em congressos</h3>
              <p className="mt-4 text-[13px] leading-relaxed text-[#6e6e73]">Veja como a mesma lógica vira marca científica, campanha, patrocínio, experiência e legado.</p>
            </button>
            <button onClick={onPlans} className="rounded-[30px] border border-black/[0.055] bg-white/72 p-6 text-left shadow-[0_20px_70px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white">
              <Clock3 size={18} className="mb-8 text-[#111113]/70" />
              <h3 className="text-[28px] font-light leading-tight">Entender plano e continuidade</h3>
              <p className="mt-4 text-[13px] leading-relaxed text-[#6e6e73]">A experiência Progress funciona melhor quando vira cadência, memória e evolução contínua.</p>
            </button>
          </section>
        </div>
      </section>
    </div>
  );
};

export default LongectaProgressPage;
