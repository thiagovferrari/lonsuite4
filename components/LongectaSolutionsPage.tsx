import React, { useMemo, useState } from 'react';
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
  ShieldCheck,
  Sparkles,
  Store,
  Stethoscope,
  Users,
} from 'lucide-react';

type SolutionAudience = 'you' | 'clinic' | 'congress';

interface LongectaSolutionsPageProps {
  onBack: () => void;
  onMethod: () => void;
  onCongress: () => void;
  onSpeakerKit: () => void;
  onPlans: () => void;
}

const solutionsMailto = (subject: string) =>
  `mailto:contato@lonsuite.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Olá, quero entender qual solução Longecta faz mais sentido para meu contexto. Pode me orientar nos próximos passos?')}`;

const audiences = [
  {
    id: 'you' as const,
    tab: 'Para você',
    eyebrow: 'Médicos, especialistas e palestrantes',
    title: 'Transforme seu repertório em autoridade médica visível.',
    body: 'Para quem já tem experiência, casos, aulas, imagens e ideias, mas precisa de uma estrutura para transformar tudo isso em presença, conteúdo, aulas, materiais e crescimento.',
    image: '/assets/longecta-solutions-you.png',
    cta: 'Quero estruturar minha autoridade',
    metric: 'Autoridade',
    icon: Stethoscope,
  },
  {
    id: 'clinic' as const,
    tab: 'Para sua clínica',
    eyebrow: 'Clínicas, serviços e equipes médicas',
    title: 'Transforme a clínica em uma marca médica mais clara, organizada e desejada.',
    body: 'Para clínicas que precisam comunicar serviços, diferenciais, campanhas, equipe, estrutura, educação do paciente e autoridade institucional com consistência premium.',
    image: '/assets/longecta-solutions-clinic.png',
    cta: 'Quero posicionar minha clínica',
    metric: 'Operação',
    icon: Building2,
  },
  {
    id: 'congress' as const,
    tab: 'Para seu congresso',
    eyebrow: 'Congressos, jornadas, simpósios e eventos científicos',
    title: 'Transforme seu congresso em uma marca científica que vende valor.',
    body: 'Para eventos que precisam comunicar programação, palestrantes, patrocinadores, inscrições, experiência e legado com método, estética e inteligência.',
    image: '/assets/longecta-solutions-congress.png',
    cta: 'Quero estruturar meu congresso',
    metric: 'Legado',
    icon: Mic2,
  },
];

const solutionsByAudience = {
  you: [
    {
      icon: Stethoscope,
      title: 'Lon Authority Médico',
      promise: 'Autoridade recorrente a partir do seu repertório real.',
      body: 'Estruturamos sua presença científica e institucional com posts, carrosséis, LinkedIn, roteiros, temas, calendário e narrativa alinhada à sua especialidade.',
      outputs: ['Calendário editorial', 'Posts e carrosséis', 'LinkedIn médico', 'Roteiros de vídeo'],
    },
    {
      icon: Mic2,
      title: 'Speaker Visibility Kit',
      promise: 'Sua participação em eventos vira ativo de prestígio.',
      body: 'Criamos kit de palestrante com cards, mini bio, legendas e textos para divulgar aulas, mesas, cursos, moderações e presença científica.',
      outputs: ['Speaker card', 'Mini bio', 'Legenda pronta', 'LinkedIn'],
      action: 'speakerKit' as const,
    },
    {
      icon: BookOpen,
      title: 'Lon Casebook',
      promise: 'Casos e acervo clínico organizados como patrimônio intelectual.',
      body: 'Transformamos imagens, casos, temas e registros em uma biblioteca estruturada para aula, reunião, discussão científica, publicação e memória profissional.',
      outputs: ['Casos organizados', 'Biblioteca visual', 'Narrativas clínicas', 'Material reutilizável'],
    },
    {
      icon: Presentation,
      title: 'Aulas e Materiais Científicos',
      promise: 'Seu conhecimento ganha forma de apresentação premium.',
      body: 'Apoiamos a estruturação de aulas, apresentações, roteiros e materiais de apoio a partir do seu acervo, com curadoria editorial e design sofisticado.',
      outputs: ['Aulas', 'Slides', 'Roteiros', 'Storyline científica'],
    },
  ],
  clinic: [
    {
      icon: Building2,
      title: 'Lon Clinic Authority',
      promise: 'Clínica com posicionamento, comunicação e autoridade consistentes.',
      body: 'Organizamos serviços, corpo clínico, diferenciais, campanhas e conteúdos para que a clínica comunique valor com clareza, estética e recorrência.',
      outputs: ['Posicionamento', 'Campanhas mensais', 'Posts e materiais', 'Pilares de marca'],
    },
    {
      icon: Megaphone,
      title: 'Campanhas Médicas',
      promise: 'Campanhas mais estratégicas, menos genéricas.',
      body: 'Criamos campanhas por serviço, data, procedimento, especialidade, prevenção, educação ou agenda comercial, sempre com linguagem médica premium.',
      outputs: ['Campanhas por tema', 'Landing copy', 'Posts', 'E-mails'],
    },
    {
      icon: Users,
      title: 'Materiais para Equipe e Paciente',
      promise: 'A comunicação da clínica também acontece fora do Instagram.',
      body: 'Desenvolvemos materiais para recepção, equipe, jornada do paciente, apresentações institucionais, orientação pré e pós-atendimento e educação.',
      outputs: ['Recepção', 'Orientações', 'Apresentações', 'Materiais internos'],
    },
    {
      icon: Database,
      title: 'Acervo Institucional Inteligente',
      promise: 'Fotos, casos, campanhas e materiais deixam de ficar espalhados.',
      body: 'A plataforma organiza a memória da clínica para reutilizar imagens, campanhas, cases, equipe, procedimentos e materiais com mais velocidade.',
      outputs: ['Acervo da clínica', 'Busca por contexto', 'Histórico de campanhas', 'Memória visual'],
    },
  ],
  congress: [
    {
      icon: Layers3,
      title: 'Congress Brand System',
      promise: 'A edição ganha conceito, narrativa e sistema visual.',
      body: 'Criamos posicionamento, key visual, mensagens-chave, identidade e aplicações para que o congresso seja percebido como uma marca científica.',
      outputs: ['Conceito', 'Key visual', 'Templates', 'Sistema de campanha'],
    },
    {
      icon: CalendarDays,
      title: 'Congress Launch',
      promise: 'O lançamento já nasce com percepção premium.',
      body: 'Estruturamos teaser, save the date, abertura de inscrições, e-mails, posts iniciais, landing page e narrativa comercial da edição.',
      outputs: ['Teaser', 'Save the date', 'Landing page', 'Abertura de inscrições'],
    },
    {
      icon: Network,
      title: 'Congress Communication 360',
      promise: 'Campanha completa antes, durante e depois.',
      body: 'Planejamos e executamos social, e-mails, lotes, programação, palestrantes, patrocinadores, comunicação presencial e pós-evento.',
      outputs: ['Social media', 'E-mails', 'Lotes', 'Cobertura'],
    },
    {
      icon: ClipboardList,
      title: 'Scientific Program Marketing',
      promise: 'A programação deixa de ser PDF e vira desejo de inscrição.',
      body: 'Transformamos trilhas, mesas, cursos e temas em chamadas, carrosséis, e-mails segmentados e argumentos de valor para públicos específicos.',
      outputs: ['Trilhas comunicadas', 'Cards de programação', 'E-mails segmentados', 'Argumentos de inscrição'],
    },
    {
      icon: Mic2,
      title: 'Speaker Visibility Kit',
      promise: 'Palestrantes viram ativos de alcance.',
      body: 'Cada speaker recebe kit de divulgação com cards, mini bios, legendas, LinkedIn e materiais compartilháveis para ativar sua própria rede.',
      outputs: ['Cards por speaker', 'Mini bios', 'Legendas', 'Hub de materiais'],
      action: 'speakerKit' as const,
    },
    {
      icon: Store,
      title: 'Sponsor Sales Kit',
      promise: 'Patrocínio vendido com argumento, estética e prova de valor.',
      body: 'Criamos book comercial, cotas, ativações, perfil de público, apresentação e materiais para captar patrocinadores com mais clareza.',
      outputs: ['Book comercial', 'Cotas', 'Pitch deck', 'Ativações'],
    },
    {
      icon: BadgeCheck,
      title: 'Lon Sponsor Report',
      promise: 'O patrocinador enxerga o que recebeu.',
      body: 'Relatório visual premium com entregas, presença de marca, ativações, números, fotos, percepção e oportunidades para renovação.',
      outputs: ['Relatório premium', 'Clipping', 'Provas de entrega', 'Renovação'],
    },
    {
      icon: Brain,
      title: 'Lon Event Brain',
      promise: 'A memória do congresso vira vantagem para a próxima edição.',
      body: 'Organizamos programação, palestrantes, campanhas, materiais, patrocinadores, fotos, relatórios e aprendizados dentro de uma inteligência reutilizável.',
      outputs: ['Memória estratégica', 'Histórico da edição', 'Banco de materiais', 'Base para próxima campanha'],
    },
  ],
};

const hybridLayers = [
  ['Plataforma', 'Organiza acervo, materiais, histórico, aprovações, contexto e memória estratégica.'],
  ['Serviço', 'Executa estratégia, copy, design, campanha, materiais e acompanhamento.'],
  ['Curadoria', 'Eleva linguagem, seleciona ângulos, evita conteúdo genérico e protege sofisticação médica.'],
  ['Inteligência', 'Acelera análise, reaproveitamento, busca, planejamento e continuidade entre entregas.'],
];

const LongectaSolutionsPage: React.FC<LongectaSolutionsPageProps> = ({ onBack, onMethod, onCongress, onSpeakerKit, onPlans }) => {
  const [activeAudience, setActiveAudience] = useState<SolutionAudience>('you');
  const active = audiences.find(item => item.id === activeAudience) || audiences[0];
  const ActiveIcon = active.icon;
  const solutions = solutionsByAudience[activeAudience];

  const summary = useMemo(() => {
    if (activeAudience === 'you') return ['Autoridade pessoal', 'Conteúdo médico', 'Aulas e cases', 'Speaker visibility'];
    if (activeAudience === 'clinic') return ['Marca clínica', 'Campanhas', 'Equipe e paciente', 'Acervo institucional'];
    return ['Marca do evento', 'Inscrições', 'Patrocínio', 'Legado'];
  }, [activeAudience]);

  const handleSolutionAction = (action?: 'speakerKit') => {
    if (action === 'speakerKit') onSpeakerKit();
  };

  return (
    <div className="longecta-method-page plans-premium-page lon-soft-bg min-h-screen overflow-hidden text-[#111113]">
      <section className="relative px-5 pb-24 pt-6 sm:px-8 lg:px-12">
        <div className="absolute inset-x-0 top-0 h-[760px] bg-white/18" />
        <div className="plans-orbit absolute right-[8%] top-28 h-56 w-56 rounded-full border border-black/[0.05]" />
        <div className="plans-orbit plans-orbit-slow absolute bottom-52 left-[7%] h-72 w-72 rounded-full border border-black/[0.04]" />

        <div className="relative mx-auto max-w-7xl">
          <nav className="lon-glass-panel sticky top-4 z-30 mb-14 flex items-center justify-between rounded-full px-3 py-2">
            <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold text-[#424245] hover:bg-[#1d1d1f] hover:text-white">
              <ArrowLeft size={14} />
              Voltar
            </button>
            <div className="hidden items-center gap-6 text-[11px] font-semibold text-[#6e6e73] md:flex">
              <a href="#divisoria" className="hover:text-[#1d1d1f]">Divisória</a>
              <a href="#solucoes" className="hover:text-[#1d1d1f]">Soluções</a>
              <a href="#hibrido" className="hover:text-[#1d1d1f]">Híbrido</a>
              <a href="#decisao" className="hover:text-[#1d1d1f]">Decisão</a>
            </div>
            <button onClick={onPlans} className="button-nowrap rounded-full bg-[#1d1d1f] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#2d2d2f]">
              Ver planos
            </button>
          </nav>

          <div className="grid min-h-[700px] items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="plans-story-enter">
              <p className="plans-eyebrow lon-glass-panel mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase text-[#6e6e73]">
                <Sparkles size={13} className="text-[#1d1d1f]" />
                Nossas Soluções
              </p>
              <h1 className="max-w-5xl text-[43px] leading-[0.98] sm:text-[66px] lg:text-[76px]">
                Soluções Longecta para transformar conhecimento médico em valor percebido.
              </h1>
              <p className="mt-8 max-w-2xl text-[18px] font-light leading-relaxed text-[#6e6e73] sm:text-[21px]">
                Um ecossistema híbrido de plataforma, serviço, curadoria e inteligência para médicos, clínicas e congressos que precisam comunicar autoridade com clareza, estética e continuidade.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href="#divisoria" className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-6 py-3 text-[13px] font-semibold text-white shadow-[0_18px_44px_rgba(0,0,0,0.18)] hover:bg-[#2d2d2f]">
                  Escolher meu contexto
                  <ArrowRight size={15} />
                </a>
                <button onClick={onMethod} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.07] bg-white/72 px-6 py-3 text-[13px] font-semibold text-[#1d1d1f] shadow-sm backdrop-blur-xl hover:bg-white">
                  Ver método Longecta
                </button>
              </div>
            </div>

            <div className="relative min-h-[560px] sm:min-h-[680px]">
              <img src={active.image} alt="" className="absolute right-0 top-0 h-[430px] w-[94%] rounded-[30px] object-cover object-center grayscale shadow-[0_38px_120px_rgba(0,0,0,0.16)] sm:h-[540px] sm:w-[88%] sm:rounded-[38px]" />
              <div className="absolute bottom-0 left-0 w-[90%] rounded-[28px] bg-[#111113] p-5 text-white shadow-[0_40px_130px_rgba(0,0,0,0.32)] sm:w-[76%] sm:rounded-[34px] sm:p-7">
                <p className="mb-7 text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">Sistema Longecta</p>
                <h2 className="text-[32px] font-extralight leading-tight sm:text-[38px]">A solução muda conforme o contexto. O método permanece: organizar, transformar, publicar e reaproveitar.</h2>
                <div className="mt-7 grid grid-cols-4 gap-2">
                  {['Plataforma', 'Serviço', 'Curadoria', 'IA'].map(item => (
                    <span key={item} className="rounded-full bg-white/10 px-2 py-2 text-center text-[9px] font-bold uppercase tracking-[0.11em] text-white/70">{item}</span>
                  ))}
                </div>
              </div>
              <div className="plans-floating-metric lon-glass-panel-strong absolute bottom-[164px] right-0 hidden max-w-[158px] rounded-[20px] px-4 py-3 sm:block sm:right-6">
                <p className="text-[34px] font-extralight leading-none">3</p>
                <p className="mt-2 text-[10px] font-semibold leading-relaxed text-[#86868b]">frentes para transformar autoridade em operação</p>
              </div>
            </div>
          </div>

          <section id="divisoria" className="mt-12 scroll-mt-24 rounded-[38px] border border-black/[0.055] bg-white/64 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.07)] backdrop-blur-xl sm:p-5">
            <div className="grid gap-3 lg:grid-cols-3">
              {audiences.map(item => {
                const Icon = item.icon;
                const isActive = activeAudience === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveAudience(item.id)}
                    className={`group rounded-[30px] border p-5 text-left transition-all ${isActive ? 'border-[#111113] bg-[#111113] text-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]' : 'border-black/[0.045] bg-white/72 text-[#111113] hover:bg-white'}`}
                  >
                    <div className="mb-9 flex items-center justify-between">
                      <span className={`flex h-11 w-11 items-center justify-center rounded-full ${isActive ? 'bg-white text-[#111113]' : 'bg-[#111113] text-white'}`}>
                        <Icon size={18} />
                      </span>
                      <ArrowRight size={15} className={`transition-transform group-hover:translate-x-0.5 ${isActive ? 'text-white/60' : 'text-[#86868b]'}`} />
                    </div>
                    <p className={`mb-3 text-[10px] font-bold uppercase tracking-[0.18em] ${isActive ? 'text-white/42' : 'text-[#86868b]'}`}>{item.eyebrow}</p>
                    <h2 className="text-[30px] font-light leading-tight">{item.tab}</h2>
                    <p className={`mt-4 text-[13px] leading-relaxed ${isActive ? 'text-white/58' : 'text-[#6e6e73]'}`}>{item.body}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-14 grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="rounded-[38px] bg-[#111113] p-7 text-white shadow-[0_30px_100px_rgba(0,0,0,0.20)] sm:p-9">
              <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#111113]">
                <ActiveIcon size={22} />
              </div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/38">{active.eyebrow}</p>
              <h2 className="text-[42px] font-extralight leading-tight sm:text-[58px]">{active.title}</h2>
              <p className="mt-6 max-w-xl text-[15px] font-light leading-relaxed text-white/62">{active.body}</p>
              <a href={solutionsMailto(active.cta)} className="button-nowrap mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-[#111113] hover:bg-white/90">
                {active.cta}
                <Send size={15} />
              </a>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {summary.map((item, index) => (
                <div key={item} className={`rounded-[28px] p-6 ${index === 0 ? 'bg-[#111113] text-white' : 'bg-white/70 text-[#111113] backdrop-blur-xl'}`}>
                  <p className={`mb-12 text-[10px] font-bold uppercase tracking-[0.16em] ${index === 0 ? 'text-white/42' : 'text-[#86868b]'}`}>{active.metric}</p>
                  <p className="text-[26px] font-light leading-tight">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="solucoes" className="mt-24 scroll-mt-24">
            <div className="mb-8 max-w-4xl">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Soluções por contexto</p>
              <h2 className="text-[40px] font-semibold leading-tight sm:text-[60px]">{active.tab}: o que a Longecta pode estruturar.</h2>
              <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[#6e6e73]">
                Cada solução pode ser contratada como entrega pontual, recorrência ou parte de um projeto mais amplo. A diferença está na profundidade de plataforma, serviço e curadoria envolvidos.
              </p>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {solutions.map((solution, index) => {
                const Icon = solution.icon;
                const isPrimary = index === 0;
                return (
                  <article key={solution.title} className={`plans-card rounded-[34px] border p-7 shadow-[0_24px_80px_rgba(0,0,0,0.07)] ${isPrimary ? 'border-[#111113] bg-[#111113] text-white' : 'border-black/[0.055] bg-white/72 text-[#111113] backdrop-blur-xl'}`}>
                    <Icon size={20} className={`mb-10 ${isPrimary ? 'text-white/70' : 'text-[#1d1d1f]/70'}`} />
                    <p className={`mb-3 text-[10px] font-bold uppercase tracking-[0.18em] ${isPrimary ? 'text-white/42' : 'text-[#86868b]'}`}>{solution.promise}</p>
                    <h3 className="text-[32px] font-light leading-tight">{solution.title}</h3>
                    <p className={`mt-4 text-[14px] leading-relaxed ${isPrimary ? 'text-white/62' : 'text-[#6e6e73]'}`}>{solution.body}</p>
                    <div className="mt-7 grid gap-2 sm:grid-cols-2">
                      {solution.outputs.map(output => (
                        <span key={output} className={`rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] ${isPrimary ? 'bg-white/10 text-white/70' : 'bg-[#f5f5f7] text-[#6e6e73]'}`}>
                          {output}
                        </span>
                      ))}
                    </div>
                    {solution.action ? (
                      <button onClick={() => handleSolutionAction(solution.action)} className={`button-nowrap mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[12px] font-semibold ${isPrimary ? 'bg-white text-[#111113] hover:bg-white/90' : 'bg-[#111113] text-white hover:bg-[#2d2d2f]'}`}>
                        Conhecer página
                        <ArrowRight size={14} />
                      </button>
                    ) : (
                      <a href={solutionsMailto(`Quero conhecer ${solution.title}`)} className={`button-nowrap mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[12px] font-semibold ${isPrimary ? 'bg-white text-[#111113] hover:bg-white/90' : 'bg-[#111113] text-white hover:bg-[#2d2d2f]'}`}>
                        Solicitar solução
                        <ArrowRight size={14} />
                      </a>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          <section id="hibrido" className="mt-24 scroll-mt-24 overflow-hidden rounded-[42px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.10)]">
            <div className="grid lg:grid-cols-[0.98fr_1.02fr]">
              <div className="relative min-h-[520px] overflow-hidden bg-[#050506]">
                <img src={active.image} alt="" className="h-full w-full object-cover object-center grayscale opacity-90" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,19,0.72),rgba(17,17,19,0.08))]" />
                <div className="absolute bottom-8 left-8 right-8 rounded-[28px] border border-white/12 bg-black/35 p-6 text-white backdrop-blur-xl">
                  <ShieldCheck size={18} className="mb-8 text-white/58" />
                  <p className="text-[28px] font-extralight leading-tight">Não é agência tradicional. Não é só software. É uma operação híbrida para autoridade médica.</p>
                </div>
              </div>
              <div className="p-8 sm:p-12 lg:p-16">
                <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#86868b]">Modelo híbrido Longecta</p>
                <h2 className="max-w-3xl text-[40px] font-semibold leading-tight sm:text-[62px]">A combinação que torna a entrega mais forte que uma ferramenta isolada.</h2>
                <div className="mt-9 grid gap-3">
                  {hybridLayers.map(([title, body], index) => (
                    <div key={title} className={`rounded-[24px] border p-5 ${index === 1 ? 'border-[#111113] bg-[#111113] text-white' : 'border-black/[0.055] bg-[#f7f7f8] text-[#111113]'}`}>
                      <p className={`mb-3 text-[10px] font-bold uppercase tracking-[0.16em] ${index === 1 ? 'text-white/42' : 'text-[#86868b]'}`}>{title}</p>
                      <p className={`text-[14px] leading-relaxed ${index === 1 ? 'text-white/64' : 'text-[#6e6e73]'}`}>{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="decisao" className="mt-24 grid gap-5 lg:grid-cols-3">
            {[
              ['Se você é médico', 'A pergunta é: seu repertório está virando autoridade ou está parado em arquivos, aulas antigas e ideias soltas?', 'Selecionar Para você', 'you' as const],
              ['Se você tem clínica', 'A pergunta é: sua clínica comunica o próprio valor ou parece depender de posts soltos e campanhas genéricas?', 'Selecionar Clínica', 'clinic' as const],
              ['Se você organiza congresso', 'A pergunta é: sua edição está sendo percebida como marca científica ou apenas como uma programação com data?', 'Selecionar Congresso', 'congress' as const],
            ].map(([title, body, cta, target], index) => (
              <button
                key={title}
                type="button"
                onClick={() => {
                  setActiveAudience(target);
                  window.setTimeout(() => document.getElementById('solucoes')?.scrollIntoView({ behavior: 'smooth' }), 50);
                }}
                className={`rounded-[34px] p-7 text-left shadow-[0_24px_80px_rgba(0,0,0,0.07)] transition-all hover:-translate-y-1 ${index === 2 ? 'bg-[#111113] text-white' : 'bg-white/72 text-[#111113] backdrop-blur-xl'}`}
              >
                <FileText size={19} className={`mb-12 ${index === 2 ? 'text-white/70' : 'text-[#1d1d1f]/70'}`} />
                <h3 className="text-[30px] font-light leading-tight">{title}</h3>
                <p className={`mt-5 text-[14px] leading-relaxed ${index === 2 ? 'text-white/58' : 'text-[#6e6e73]'}`}>{body}</p>
                <span className={`mt-8 inline-flex items-center gap-2 rounded-full px-5 py-3 text-[12px] font-semibold ${index === 2 ? 'bg-white text-[#111113]' : 'bg-[#111113] text-white'}`}>
                  {cta}
                  <ArrowRight size={14} />
                </span>
              </button>
            ))}
          </section>

          <section className="relative mt-24 overflow-hidden rounded-[42px] bg-[#111113] px-7 py-16 text-center text-white shadow-[0_38px_130px_rgba(0,0,0,0.26)] sm:px-12 sm:py-20">
            <img src="/assets/longecta-solutions-congress.png" alt="" className="absolute inset-0 h-full w-full object-cover object-center grayscale opacity-38" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,19,0.95),rgba(17,17,19,0.62),rgba(17,17,19,0.95))]" />
            <div className="relative z-10">
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/44">Próximo passo</p>
              <h2 className="mx-auto max-w-4xl text-[42px] font-extralight leading-tight sm:text-[66px]">A melhor solução é a que transforma o que você já tem em valor que o mercado consegue perceber.</h2>
              <p className="mx-auto mt-7 max-w-2xl text-[16px] font-light leading-relaxed text-white/62">
                A Longecta entra para organizar a matéria-prima, definir a narrativa, executar com qualidade premium e criar memória para a próxima entrega.
              </p>
              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <a href={solutionsMailto('Quero escolher minha solução Longecta')} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-[13px] font-semibold text-[#111113] hover:bg-white/90">
                  Escolher minha solução
                  <Send size={15} />
                </a>
                <button onClick={onCongress} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3 text-[13px] font-semibold text-white backdrop-blur hover:bg-white/16">
                  Ver Congressos
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
