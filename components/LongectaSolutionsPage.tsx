import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Brain,
  Building2,
  CalendarDays,
  Check,
  ClipboardList,
  Database,
  FileText,
  Layers3,
  Megaphone,
  Mic2,
  Network,
  Presentation,
  Send,
  Sparkles,
  Store,
  Stethoscope,
  Users,
} from 'lucide-react';

interface LongectaSolutionsPageProps {
  onBack: () => void;
  onMethod: () => void;
  onCongress: () => void;
  onSpeakerKit: () => void;
  onPlans: () => void;
}

type SolutionAction = 'speakerKit';

type Solution = {
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  title: string;
  promise: string;
  description: string;
  bestFor: string;
  outputs: string[];
  action?: SolutionAction;
};

type Segment = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  summary: string;
  image: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  mainResult: string;
  useWhen: string[];
  solutions: Solution[];
};

const solutionsMailto = (subject: string) =>
  `mailto:contato@lonsuite.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Olá, quero entender qual solução Longecta faz mais sentido para meu contexto. Pode me orientar nos próximos passos?')}`;

const segments: Segment[] = [
  {
    id: 'para-voce',
    label: 'Para você',
    eyebrow: 'Médicos, especialistas e palestrantes',
    title: 'Presença médica construída a partir do seu repertório real.',
    summary: 'Para transformar casos, aulas, imagens, ideias e experiência acumulada em autoridade, conteúdo, apresentações e materiais científicos com acabamento premium.',
    image: '/assets/longecta-solutions-you.png',
    icon: Stethoscope,
    mainResult: 'Autoridade pessoal mais clara, recorrente e reaproveitável.',
    useWhen: ['Você dá aulas ou participa de eventos', 'Tem acervo clínico disperso', 'Quer publicar com mais consistência', 'Precisa transformar conhecimento em presença'],
    solutions: [
      {
        icon: Stethoscope,
        title: 'Lon Authority Médico',
        promise: 'Autoridade recorrente, sem parecer conteúdo genérico.',
        description: 'Estratégia mensal de presença para médicos especialistas: temas, narrativa, posts, carrosséis, LinkedIn, roteiros e posicionamento conectado à prática real.',
        bestFor: 'Médicos que querem crescer autoridade sem depender de improviso semanal.',
        outputs: ['Calendário editorial', 'Posts e carrosséis', 'LinkedIn médico', 'Roteiros curtos'],
      },
      {
        icon: Mic2,
        title: 'Speaker Visibility Kit',
        promise: 'Sua participação em eventos vira ativo de prestígio.',
        description: 'Kit para divulgar aulas, mesas, cursos, moderações e convites científicos com cards, mini bio, legendas e textos prontos para redes profissionais.',
        bestFor: 'Palestrantes, moderadores, professores e especialistas convidados.',
        outputs: ['Speaker card', 'Mini bio', 'Legenda pronta', 'Texto LinkedIn'],
        action: 'speakerKit',
      },
      {
        icon: BookOpen,
        title: 'Lon Casebook',
        promise: 'Casos e imagens deixam de ser arquivo morto.',
        description: 'Organização editorial de casos, imagens, temas e registros clínicos para uso em aulas, reuniões científicas, publicações e construção de memória profissional.',
        bestFor: 'Quem tem muito material clínico e pouco reaproveitamento.',
        outputs: ['Biblioteca de casos', 'Narrativas clínicas', 'Acervo visual', 'Material reutilizável'],
      },
      {
        icon: Presentation,
        title: 'Aulas e Materiais Científicos',
        promise: 'Seu conhecimento ganha forma de apresentação premium.',
        description: 'Estruturação de aulas, apresentações, roteiros, storylines e materiais de apoio com curadoria científica, copy e acabamento visual.',
        bestFor: 'Aulas, congressos, reuniões, rounds, bancas e apresentações institucionais.',
        outputs: ['Slides', 'Storyline', 'Roteiro', 'Material de apoio'],
      },
    ],
  },
  {
    id: 'para-clinica',
    label: 'Para sua clínica',
    eyebrow: 'Clínicas, serviços e equipes médicas',
    title: 'Comunicação institucional para a clínica parecer tão forte quanto ela é.',
    summary: 'Para organizar serviços, corpo clínico, campanhas, diferenciais, jornada do paciente e materiais institucionais com linguagem premium e operação contínua.',
    image: '/assets/longecta-solutions-clinic.png',
    icon: Building2,
    mainResult: 'Marca clínica mais confiável, organizada e comercialmente clara.',
    useWhen: ['A clínica comunica abaixo do próprio padrão', 'Os serviços não estão claros', 'A equipe depende de materiais soltos', 'Campanhas parecem genéricas'],
    solutions: [
      {
        icon: Building2,
        title: 'Lon Clinic Authority',
        promise: 'Posicionamento e conteúdo para a marca clínica.',
        description: 'Estrutura de comunicação para serviços, diferenciais, equipe, campanhas e autoridade institucional, com consistência visual e editorial.',
        bestFor: 'Clínicas que precisam comunicar valor com mais seriedade e recorrência.',
        outputs: ['Pilares de marca', 'Campanhas mensais', 'Posts e materiais', 'Comunicação institucional'],
      },
      {
        icon: Megaphone,
        title: 'Campanhas Médicas',
        promise: 'Campanhas por serviço, procedimento, prevenção ou agenda comercial.',
        description: 'Planejamento e execução de campanhas com linguagem médica, argumento claro, peças digitais, e-mails e materiais de apoio para conversão e educação.',
        bestFor: 'Lançar serviços, reforçar especialidades, divulgar procedimentos ou educar pacientes.',
        outputs: ['Conceito de campanha', 'Posts', 'E-mails', 'Landing copy'],
      },
      {
        icon: Users,
        title: 'Materiais para Equipe e Paciente',
        promise: 'A experiência da clínica também é comunicação.',
        description: 'Materiais para recepção, orientação pré e pós-atendimento, equipe, apresentação de serviços, educação do paciente e padronização de linguagem.',
        bestFor: 'Clínicas que precisam reduzir ruído e melhorar a percepção em cada ponto de contato.',
        outputs: ['Recepção', 'Orientações', 'Apresentações', 'Materiais internos'],
      },
      {
        icon: Database,
        title: 'Acervo Institucional Inteligente',
        promise: 'A memória da clínica deixa de ficar espalhada.',
        description: 'Organização de fotos, campanhas, cases, equipe, serviços, materiais e histórico para reaproveitamento rápido em novos conteúdos e apresentações.',
        bestFor: 'Clínicas com muitos materiais, mas pouca organização estratégica.',
        outputs: ['Acervo da clínica', 'Histórico de campanhas', 'Banco visual', 'Busca por contexto'],
      },
    ],
  },
  {
    id: 'para-congresso',
    label: 'Para seu congresso',
    eyebrow: 'Congressos, jornadas, simpósios e eventos científicos',
    title: 'Estrutura de comunicação para transformar evento científico em marca.',
    summary: 'Para posicionar, lançar, vender, comunicar programação, ativar palestrantes, valorizar patrocinadores e transformar o pós-evento em legado.',
    image: '/assets/longecta-solutions-congress.png',
    icon: Mic2,
    mainResult: 'Mais percepção de valor antes, durante e depois da edição.',
    useWhen: ['A programação é forte, mas pouco comunicada', 'Inscrições dependem de esforço manual', 'Patrocinadores precisam enxergar valor', 'O pós-evento se perde'],
    solutions: [
      {
        icon: Layers3,
        title: 'Congress Brand System',
        promise: 'Conceito, narrativa e sistema visual para a edição.',
        description: 'Criação da base estratégica e visual do congresso: posicionamento, promessa, mensagens-chave, key visual, templates e linguagem de campanha.',
        bestFor: 'Eventos que precisam parecer marca científica, não apenas agenda.',
        outputs: ['Conceito', 'Key visual', 'Mensagens-chave', 'Templates'],
      },
      {
        icon: CalendarDays,
        title: 'Congress Launch',
        promise: 'Lançamento com percepção premium desde o primeiro contato.',
        description: 'Teaser, save the date, abertura de inscrições, e-mails, posts iniciais, landing page e argumento comercial para inaugurar a campanha.',
        bestFor: 'Abrir inscrições, anunciar edição ou reposicionar um evento existente.',
        outputs: ['Teaser', 'Save the date', 'Landing page', 'Campanha inicial'],
      },
      {
        icon: Network,
        title: 'Congress Communication 360',
        promise: 'Campanha completa antes, durante e depois.',
        description: 'Planejamento e execução de comunicação para social, e-mails, lotes, programação, palestrantes, patrocinadores, experiência presencial e pós-evento.',
        bestFor: 'Congressos que precisam de operação contínua e não só artes isoladas.',
        outputs: ['Social media', 'E-mails', 'Lotes', 'Cobertura e pós'],
      },
      {
        icon: ClipboardList,
        title: 'Scientific Program Marketing',
        promise: 'A programação vira argumento de inscrição.',
        description: 'Trilhas, mesas, cursos e temas são traduzidos em chamadas, carrosséis, e-mails segmentados e conteúdos que mostram o valor científico da edição.',
        bestFor: 'Eventos com programação forte que ainda parece apenas um PDF.',
        outputs: ['Trilhas comunicadas', 'Cards de programação', 'E-mails segmentados', 'Argumentos de valor'],
      },
      {
        icon: Mic2,
        title: 'Speaker Visibility Kit',
        promise: 'Palestrantes viram ativos de alcance e prestígio.',
        description: 'Kit individual por speaker com cards, mini bios, legendas, LinkedIn e materiais compartilháveis para ativar redes próprias e ampliar a campanha.',
        bestFor: 'Congressos com corpo docente forte e pouco ativado na divulgação.',
        outputs: ['Cards por speaker', 'Mini bios', 'Legendas', 'Hub de materiais'],
        action: 'speakerKit',
      },
      {
        icon: Store,
        title: 'Sponsor Sales Kit',
        promise: 'Patrocínio vendido com argumento e prova de valor.',
        description: 'Book comercial, cotas, ativações, perfil de público, pitch deck e materiais para captação de patrocinadores com clareza e estética premium.',
        bestFor: 'Eventos que precisam vender ou elevar patrocínio.',
        outputs: ['Book comercial', 'Cotas', 'Pitch deck', 'Ativações'],
      },
      {
        icon: BadgeCheck,
        title: 'Lon Sponsor Report',
        promise: 'O patrocinador enxerga o que recebeu.',
        description: 'Relatório visual pós-evento com entregas, ativações, presença de marca, fotos, números, clipping e argumentos para renovação.',
        bestFor: 'Renovar patrocinadores e demonstrar valor com maturidade.',
        outputs: ['Relatório premium', 'Clipping', 'Provas de entrega', 'Renovação'],
      },
      {
        icon: Brain,
        title: 'Lon Event Brain',
        promise: 'Memória estratégica para a próxima edição.',
        description: 'Organização de programação, palestrantes, campanhas, materiais, patrocinadores, fotos, relatórios e aprendizados para reaproveitar inteligência ano a ano.',
        bestFor: 'Eventos recorrentes que querem parar de recomeçar do zero.',
        outputs: ['Histórico da edição', 'Banco de materiais', 'Memória estratégica', 'Base futura'],
      },
    ],
  },
];

const hybridLayers = [
  ['Plataforma', 'Centraliza acervo, materiais, histórico, aprovações e memória reutilizável.'],
  ['Serviço', 'Executa estratégia, copy, design, campanhas, apresentações e materiais.'],
  ['Curadoria', 'Seleciona ângulos, filtra excessos e protege a sofisticação médica.'],
  ['Inteligência', 'Acelera busca, análise, planejamento e reaproveitamento entre entregas.'],
];

const diagnosticSignals = [
  ['Quem compra', 'Médico, clínica, sociedade, comissão científica ou organização de evento.'],
  ['Valor escondido', 'Acervo, programação, speakers, serviços, patrocinadores, aulas ou materiais antigos.'],
  ['Resultado desejado', 'Autoridade, inscrição, patrocínio, presença institucional, campanha ou legado.'],
];

const productPaths = [
  ['Entrada rápida', 'Speaker Kit, campanha médica pontual ou diagnóstico de acervo.', 'Quando há dor clara e ciclo curto.'],
  ['Operação recorrente', 'Lon Authority Médico, Clinic Authority ou Communication 360.', 'Quando a presença precisa de constância.'],
  ['Sistema proprietário', 'Lon Event Brain, acervo institucional ou memória estratégica.', 'Quando o objetivo é reaproveitar inteligência ao longo do tempo.'],
];

const handleAnchor = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const LongectaSolutionsPage: React.FC<LongectaSolutionsPageProps> = ({ onBack, onMethod, onCongress, onSpeakerKit, onPlans }) => {
  const handleAction = (action?: SolutionAction) => {
    if (action === 'speakerKit') onSpeakerKit();
  };

  return (
    <div className="longecta-method-page plans-premium-page lon-soft-bg min-h-screen overflow-hidden text-[#111113]">
      <section className="relative px-5 pb-24 pt-6 sm:px-8 lg:px-12">
        <div className="absolute inset-x-0 top-0 h-[540px] bg-white/22" />

        <div className="relative mx-auto max-w-7xl">
          <nav className="lon-glass-panel sticky top-4 z-30 mb-10 flex items-center justify-between rounded-full px-3 py-2">
            <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold text-[#424245] hover:bg-[#1d1d1f] hover:text-white">
              <ArrowLeft size={14} />
              Voltar
            </button>
            <div className="hidden items-center gap-6 text-[11px] font-semibold text-[#6e6e73] md:flex">
              <button onClick={() => handleAnchor('para-voce')} className="hover:text-[#1d1d1f]">Para você</button>
              <button onClick={() => handleAnchor('para-clinica')} className="hover:text-[#1d1d1f]">Para sua clínica</button>
              <button onClick={() => handleAnchor('para-congresso')} className="hover:text-[#1d1d1f]">Para seu congresso</button>
              <button onClick={() => handleAnchor('modelo')} className="hover:text-[#1d1d1f]">Modelo híbrido</button>
            </div>
            <button onClick={onPlans} className="button-nowrap rounded-full bg-[#1d1d1f] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#2d2d2f]">
              Ver planos
            </button>
          </nav>

          <header className="mb-8 grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
            <div>
              <p className="plans-eyebrow lon-glass-panel mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase text-[#6e6e73]">
                <Sparkles size={13} className="text-[#1d1d1f]" />
                Nossas soluções
              </p>
              <h1 className="max-w-4xl text-[42px] font-light leading-[1.02] tracking-tight sm:text-[64px] lg:text-[72px]">
                Um portfólio para cada forma de autoridade médica.
              </h1>
            </div>
            <div className="max-w-2xl lg:justify-self-end">
              <p className="text-[17px] font-light leading-relaxed text-[#6e6e73] sm:text-[19px]">
                A Longecta combina plataforma, serviço, curadoria e inteligência para transformar repertório médico em comunicação clara, materiais premium e crescimento percebido.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Para você', 'Para sua clínica', 'Para seu congresso'].map((item, index) => (
                  <button
                    key={item}
                    onClick={() => handleAnchor(segments[index].id)}
                    className="rounded-full border border-black/[0.06] bg-white/72 px-4 py-2 text-[12px] font-semibold text-[#424245] shadow-sm backdrop-blur-xl hover:bg-[#111113] hover:text-white"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <section className="mb-14 grid gap-3 lg:grid-cols-3">
            {segments.map(segment => {
              const Icon = segment.icon;
              return (
                <button
                  key={segment.id}
                  onClick={() => handleAnchor(segment.id)}
                  className="group overflow-hidden rounded-[28px] border border-black/[0.055] bg-white/72 text-left shadow-[0_18px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_26px_80px_rgba(0,0,0,0.08)]"
                >
                  <div className="aspect-[16/7] overflow-hidden bg-[#e9e9eb]">
                    <img src={segment.image} alt="" className="h-full w-full object-cover object-center grayscale transition-transform duration-700 group-hover:scale-[1.025]" />
                  </div>
                  <div className="p-5">
                    <div className="mb-5 flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111113] text-white">
                        <Icon size={17} />
                      </span>
                      <ArrowRight size={14} className="text-[#86868b] transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">{segment.eyebrow}</p>
                    <h2 className="text-[27px] font-light leading-tight">{segment.label}</h2>
                    <p className="mt-3 text-[13px] leading-relaxed text-[#6e6e73]">{segment.summary}</p>
                  </div>
                </button>
              );
            })}
          </section>

          <section id="modelo" className="mb-16 scroll-mt-24 rounded-[30px] border border-black/[0.055] bg-[#111113] p-4 text-white shadow-[0_24px_80px_rgba(0,0,0,0.16)] sm:p-5">
            <div className="grid gap-2 md:grid-cols-4">
              {hybridLayers.map(([title, body], index) => (
                <div key={title} className={`rounded-[22px] p-5 ${index === 0 ? 'bg-white text-[#111113]' : 'bg-white/[0.07] text-white'}`}>
                  <p className={`mb-7 text-[10px] font-bold uppercase tracking-[0.16em] ${index === 0 ? 'text-[#86868b]' : 'text-white/38'}`}>{title}</p>
                  <p className={`text-[13px] leading-relaxed ${index === 0 ? 'text-[#424245]' : 'text-white/58'}`}>{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16 grid gap-3 rounded-[34px] border border-black/[0.055] bg-white/74 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.06)] backdrop-blur-xl lg:grid-cols-[0.74fr_1.26fr]">
            <div className="rounded-[26px] bg-[#111113] p-6 text-white">
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Diagnóstico de solução</p>
              <h2 className="text-[34px] font-extralight leading-tight">Antes de vender uma entrega, a Longecta identifica onde o valor está parado.</h2>
              <a href={solutionsMailto('Quero diagnosticar minha solução Longecta')} className="button-nowrap mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[12px] font-semibold text-[#111113] hover:bg-white/90">
                Diagnosticar meu contexto
                <ArrowRight size={14} />
              </a>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {diagnosticSignals.map(([title, body], index) => (
                <article key={title} className={`rounded-[24px] p-5 ${index === 1 ? 'bg-[#f5f5f7]' : 'bg-white'} border border-black/[0.045]`}>
                  <p className="mb-7 text-[10px] font-bold uppercase tracking-[0.16em] text-[#86868b]">{title}</p>
                  <p className="text-[13px] leading-relaxed text-[#424245]">{body}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="space-y-16">
            {segments.map(segment => (
              <section key={segment.id} id={segment.id} className="scroll-mt-24">
                <div className="mb-5 grid gap-5 rounded-[34px] border border-black/[0.055] bg-white/68 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.06)] backdrop-blur-xl lg:grid-cols-[300px_1fr]">
                  <div className="overflow-hidden rounded-[26px] bg-[#ececee]">
                    <img src={segment.image} alt="" className="h-full min-h-[220px] w-full object-cover object-center grayscale" />
                  </div>
                  <div className="grid gap-5 p-2 sm:p-4 lg:grid-cols-[1fr_330px] lg:items-center">
                    <div>
                      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">{segment.eyebrow}</p>
                      <h2 className="max-w-3xl text-[36px] font-light leading-tight tracking-tight sm:text-[50px]">{segment.title}</h2>
                      <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[#6e6e73]">{segment.summary}</p>
                    </div>
                    <div className="rounded-[24px] bg-[#111113] p-5 text-white">
                      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white/38">Resultado esperado</p>
                      <p className="text-[24px] font-extralight leading-tight">{segment.mainResult}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-5 grid gap-3 lg:grid-cols-4">
                  {segment.useWhen.map(item => (
                    <div key={item} className="flex gap-3 rounded-[20px] border border-black/[0.045] bg-white/72 p-4 text-[12px] font-medium leading-relaxed text-[#424245] shadow-sm backdrop-blur-xl">
                      <Check size={14} className="mt-0.5 shrink-0 text-[#111113]" />
                      {item}
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 xl:grid-cols-2">
                  {segment.solutions.map(solution => {
                    const Icon = solution.icon;
                    return (
                      <article key={solution.title} className="rounded-[26px] border border-black/[0.055] bg-white/78 p-5 shadow-[0_16px_54px_rgba(0,0,0,0.05)] backdrop-blur-xl transition-all hover:bg-white hover:shadow-[0_24px_70px_rgba(0,0,0,0.07)]">
                        <div className="grid gap-4 sm:grid-cols-[48px_1fr]">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111113] text-white">
                            <Icon size={18} />
                          </div>
                          <div>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <h3 className="text-[24px] font-light leading-tight tracking-tight">{solution.title}</h3>
                                <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#86868b]">{solution.promise}</p>
                              </div>
                              {solution.action ? (
                                <button onClick={() => handleAction(solution.action)} className="button-nowrap inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#111113] px-4 py-2 text-[11px] font-semibold text-white hover:bg-[#2d2d2f]">
                                  Ver página
                                  <ArrowRight size={13} />
                                </button>
                              ) : (
                                <a href={solutionsMailto(`Quero conhecer ${solution.title}`)} className="button-nowrap inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-black/[0.06] bg-white px-4 py-2 text-[11px] font-semibold text-[#111113] hover:bg-[#111113] hover:text-white">
                                  Solicitar
                                  <ArrowRight size={13} />
                                </a>
                              )}
                            </div>
                            <p className="mt-4 text-[13px] leading-relaxed text-[#5f5f63]">{solution.description}</p>
                            <div className="mt-4 rounded-[18px] bg-[#f5f5f7] p-4">
                              <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Melhor para</p>
                              <p className="text-[13px] leading-relaxed text-[#424245]">{solution.bestFor}</p>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {solution.outputs.map(output => (
                                <span key={output} className="rounded-full bg-[#f5f5f7] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.11em] text-[#6e6e73]">
                                  {output}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-16 grid gap-3 rounded-[34px] border border-black/[0.055] bg-white/72 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.06)] backdrop-blur-xl lg:grid-cols-[0.7fr_1.3fr]">
            <div className="rounded-[26px] bg-[#111113] p-6 text-white">
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/38">Como escolher</p>
              <h2 className="text-[34px] font-extralight leading-tight">O ponto de partida depende de onde está o valor escondido.</h2>
            </div>
            <div className="grid gap-px overflow-hidden rounded-[24px] border border-black/[0.045] bg-black/[0.045]">
              {[
                ['Tenho repertório, mas pouca presença', 'Comece por Lon Authority Médico ou Lon Casebook.'],
                ['Tenho clínica, mas comunicação inconsistente', 'Comece por Lon Clinic Authority e campanhas médicas.'],
                ['Tenho congresso, mas baixo valor percebido', 'Comece por Congress Brand System ou Communication 360.'],
                ['Tenho palestrantes fortes, mas pouca divulgação', 'Comece por Speaker Visibility Kit.'],
              ].map(([signal, recommendation]) => (
                <div key={signal} className="grid gap-2 bg-white px-5 py-4 sm:grid-cols-[0.78fr_1.22fr]">
                  <p className="text-[13px] font-semibold text-[#111113]">{signal}</p>
                  <p className="text-[13px] leading-relaxed text-[#6e6e73]">{recommendation}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 rounded-[34px] border border-black/[0.055] bg-white/72 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.06)] backdrop-blur-xl">
            <div className="mb-6 max-w-3xl">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Caminhos de contratação</p>
              <h2 className="text-[34px] font-light leading-tight sm:text-[46px]">A compra pode começar pequena, recorrente ou como sistema.</h2>
            </div>
            <div className="grid gap-3 lg:grid-cols-3">
              {productPaths.map(([title, offer, fit], index) => (
                <article key={title} className={`rounded-[26px] p-6 ${index === 1 ? 'bg-[#111113] text-white' : 'bg-white text-[#111113]'} border border-black/[0.045]`}>
                  <p className={`mb-7 text-[10px] font-bold uppercase tracking-[0.16em] ${index === 1 ? 'text-white/40' : 'text-[#86868b]'}`}>{title}</p>
                  <h3 className="text-[25px] font-light leading-tight">{offer}</h3>
                  <p className={`mt-4 text-[13px] leading-relaxed ${index === 1 ? 'text-white/58' : 'text-[#6e6e73]'}`}>{fit}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="relative mt-16 overflow-hidden rounded-[34px] bg-[#111113] px-7 py-12 text-white shadow-[0_32px_110px_rgba(0,0,0,0.22)] sm:px-10">
            <div className="relative z-10 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Próximo passo</p>
                <h2 className="max-w-4xl text-[36px] font-extralight leading-tight sm:text-[52px]">Escolha a frente certa e a Longecta estrutura o caminho de execução.</h2>
                <p className="mt-5 max-w-2xl text-[14px] leading-relaxed text-white/58">A conversa começa pelo contexto: você, sua clínica ou seu congresso. A partir disso, definimos o pacote mais inteligente de plataforma, serviço e curadoria.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <a href={solutionsMailto('Quero escolher minha solução Longecta')} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-[#111113] hover:bg-white/90">
                  Escolher solução
                  <Send size={15} />
                </a>
                <button onClick={onMethod} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-[13px] font-semibold text-white backdrop-blur hover:bg-white/16">
                  Método Longecta
                  <ArrowRight size={15} />
                </button>
                <button onClick={onCongress} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-[13px] font-semibold text-white backdrop-blur hover:bg-white/16">
                  Congressos
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

export default LongectaSolutionsPage;
