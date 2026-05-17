import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ClipboardList,
  Crown,
  GraduationCap,
  Layers3,
  Mail,
  Map,
  Megaphone,
  Mic2,
  PlayCircle,
  Presentation,
  Rocket,
  Send,
  Sparkles,
  Target,
  Trophy,
  Users,
  Workflow,
} from 'lucide-react';

interface DoctorNextLevelPageProps {
  onBack: () => void;
  onCongress: () => void;
  onMethod: () => void;
  onPublicity: () => void;
}

const nextLevelMailto = (subject: string, body?: string) =>
  `mailto:contato@lonsuite.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body || 'Olá, tenho interesse no Doctor Next Level. Quero entender como o curso pode me ajudar a entrar ou crescer no mercado de congressos, cursos médicos, palestras e autoridade científica.')}`;

const opportunities = [
  {
    icon: Presentation,
    title: 'Congressos médicos',
    text: 'Entenda como eventos científicos funcionam, como palestrantes são escolhidos, onde está o valor e como se posicionar para participar melhor.',
  },
  {
    icon: GraduationCap,
    title: 'Cursos e mentorias',
    text: 'Aprenda a transformar repertório clínico e científico em experiências educacionais vendáveis, éticas, claras e desejadas.',
  },
  {
    icon: Mic2,
    title: 'Palestras e speaker profile',
    text: 'Construa uma tese pública, temas de fala, bio, perfil de speaker e materiais para ser lembrado por eventos, sociedades e marcas.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Marca e receita médica',
    text: 'Veja como autoridade, educação e relacionamento podem gerar novas fontes de renda sem abandonar a seriedade da medicina.',
  },
];

const modules = [
  {
    number: '01',
    title: 'O mercado invisível da educação médica',
    promise: 'O médico entende onde existe dinheiro, reputação e oportunidade fora da rotina assistencial tradicional.',
    lessons: ['Como congressos, cursos e sociedades se organizam', 'Quem paga, quem decide e quem influencia', 'Modelos de receita: inscrição, patrocínio, honorários e recorrência'],
  },
  {
    number: '02',
    title: 'Posicionamento de autoridade',
    promise: 'O aluno aprende a deixar de ser apenas bom tecnicamente e passa a ser percebido como referência em um território específico.',
    lessons: ['Território de autoridade', 'Teses proprietárias', 'Bio, currículo público e narrativa profissional'],
  },
  {
    number: '03',
    title: 'Como entrar em congressos',
    promise: 'Um mapa prático para participar, propor temas, se aproximar de comissões e transformar presença em relacionamento.',
    lessons: ['Tipos de participação', 'Como propor temas e aulas', 'Networking científico sem parecer oportunista'],
  },
  {
    number: '04',
    title: 'Criação de cursos médicos',
    promise: 'Do conhecimento acumulado ao produto educacional com promessa, público, módulos, preço e entrega.',
    lessons: ['Definição de público e transformação', 'Estrutura de módulos e aulas', 'Oferta, preço, turma e experiência'],
  },
  {
    number: '05',
    title: 'Venda ética e captação',
    promise: 'Como vender educação médica com sofisticação, clareza e confiança, sem banalizar a imagem profissional.',
    lessons: ['Página de inscrição', 'Webinar, aula aberta e lista de espera', 'Relacionamento, follow-up e objeções'],
  },
  {
    number: '06',
    title: 'Patrocínio, parcerias e indústria',
    promise: 'O médico entende como marcas e patrocinadores avaliam valor, audiência e associação científica.',
    lessons: ['O que patrocinadores compram de verdade', 'Proposta de parceria', 'Ativações, entrega e relatório'],
  },
  {
    number: '07',
    title: 'Conteúdo que vira ativo',
    promise: 'Aulas, casos, vídeos e experiências deixam de ficar perdidos e passam a alimentar presença, palestras e produtos.',
    lessons: ['Acervo intelectual', 'Calendário de autoridade', 'Reaproveitamento entre aula, post, artigo e palestra'],
  },
  {
    number: '08',
    title: 'Plano Doctor Next Level',
    promise: 'O aluno sai com um plano de 90 dias para escolher mercado, montar ativos e iniciar sua primeira movimentação estratégica.',
    lessons: ['Escolha da oportunidade', 'Checklist de ativos', 'Rota de execução em 30, 60 e 90 dias'],
  },
];

const platformItems = [
  ['Aulas premium', 'Conteúdo direto, estratégico e aplicável para médicos ocupados.'],
  ['Templates e scripts', 'Modelos de bio, proposta de palestra, estrutura de curso, página e abordagem.'],
  ['Mapas de mercado', 'Explicações sobre congressos, sociedades, patrocinadores, cursos e bastidores.'],
  ['Playbooks de ação', 'Sequências para sair da teoria e executar com segurança.'],
  ['Biblioteca de exemplos', 'Referências de páginas, ofertas, kits de speaker e materiais de autoridade.'],
  ['Atualizações Longecta', 'Novas aulas e frameworks conforme o mercado evoluir.'],
];

const outcomes = [
  ['Mais clareza', 'saber qual oportunidade perseguir'],
  ['Mais autoridade', 'ser lembrado por uma tese'],
  ['Mais receita', 'criar produtos e convites'],
  ['Mais método', 'executar sem improviso'],
];

const studentProfiles = [
  ['Médico especialista', 'Quer construir autoridade e novas oportunidades sem parecer influenciador genérico.'],
  ['Professor ou preceptor', 'Já ensina, mas ainda não transformou conhecimento em produto educacional claro.'],
  ['Palestrante em crescimento', 'Quer ser chamado para mais eventos e se apresentar com materiais profissionais.'],
  ['Dono de curso médico', 'Quer lançar, reposicionar ou escalar um curso com mais estratégia e percepção de valor.'],
];

const marketMap = [
  ['Reputação', 'Tema, tese, currículo, casos, aulas e prova de autoridade.'],
  ['Produto', 'Curso, mentoria, workshop, imersão, comunidade ou trilha educacional.'],
  ['Palco', 'Congressos, jornadas, mesas, simpósios, sociedades e eventos patrocinados.'],
  ['Captação', 'Página, lista, aula aberta, proposta, parceria, patrocínio e follow-up.'],
];

const DoctorNextLevelPage: React.FC<DoctorNextLevelPageProps> = ({ onBack, onCongress, onMethod, onPublicity }) => {
  return (
    <div className="doctor-next-level-page plans-premium-page min-h-screen overflow-hidden bg-[#f7f4ee] text-[#121214]">
      <section className="relative min-h-[94vh] px-5 pb-14 pt-6 text-white sm:px-8 lg:px-12">
        <img src="/assets/doctor-next-level-hero.png" alt="Médico apresentando em congresso científico premium" className="absolute inset-0 h-full w-full object-cover object-[68%_46%]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.78)_34%,rgba(0,0,0,0.30)_68%,rgba(0,0,0,0.44)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#f7f4ee] to-transparent" />

        <div className="relative mx-auto flex min-h-[calc(94vh-5rem)] max-w-7xl flex-col">
          <nav className="sticky top-4 z-30 flex items-center justify-between rounded-full border border-white/12 bg-black/26 px-3 py-2 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
            <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold text-white/72 hover:bg-white hover:text-[#111113]">
              <ArrowLeft size={14} />
              Voltar
            </button>
            <div className="hidden items-center gap-6 text-[11px] font-semibold text-white/52 md:flex">
              <a href="#mercado" className="hover:text-white">Mercado</a>
              <a href="#modulos" className="hover:text-white">Módulos</a>
              <a href="#plataforma" className="hover:text-white">Plataforma</a>
              <a href="#inscricao" className="hover:text-white">Inscrição</a>
            </div>
            <a href={nextLevelMailto('Quero entrar no Doctor Next Level')} className="button-nowrap rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-[#111113] hover:bg-white/90">
              Entrar na lista
            </a>
          </nav>

          <header className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="max-w-4xl">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/62 backdrop-blur-xl">
                <Sparkles size={13} />
                Longecta Doctor Next Level
              </p>
              <h1 className="max-w-3xl text-[39px] font-light leading-[1.04] tracking-[0] sm:text-[54px] lg:text-[62px]">
                O curso para médicos que querem dominar congressos, cursos e autoridade científica.
              </h1>
              <p className="mt-7 max-w-2xl text-[18px] font-light leading-relaxed text-white/74 sm:text-[21px]">
                Existe um mercado inteiro ao redor da medicina que muitos médicos ainda não aprenderam a enxergar: congressos, cursos, sociedades, patrocínios, palestras, comunidades e produtos educacionais. O Doctor Next Level ensina esse jogo com método, sofisticação e visão de negócio.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href={nextLevelMailto('Quero entrar na lista do Doctor Next Level')} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-[13px] font-semibold text-[#111113] shadow-[0_22px_70px_rgba(255,255,255,0.18)] hover:bg-white/90">
                  Quero acessar o curso
                  <Send size={15} />
                </a>
                <a href="#modulos" className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/[0.07] px-7 py-3 text-[13px] font-semibold text-white backdrop-blur-xl hover:bg-white hover:text-[#111113]">
                  Ver módulos
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>

            <div className="hidden lg:block" />
          </header>

          <div className="grid gap-px overflow-hidden rounded-[8px] border border-white/10 bg-white/10 backdrop-blur-xl sm:grid-cols-4">
            {outcomes.map(([title, body]) => (
              <div key={title} className="bg-black/24 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">{title}</p>
                <p className="mt-5 text-[17px] font-light leading-tight text-white">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="mercado" className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a7563]">O mercado que poucos ensinam</p>
            <h2 className="text-[42px] font-light leading-tight sm:text-[64px]">
              O médico não precisa escolher entre ser sério e ser estratégico.
            </h2>
          </div>
          <div className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
            {[
              ['Excelência clínica não basta para ser lembrado.', 'O mercado de educação médica premia quem sabe transformar repertório em tese, presença, relacionamento e produto.'],
              ['Congressos são ecossistemas, não apenas agendas.', 'Há comissões, patrocinadores, palestrantes, cursos pré-congresso, trilhas, networking e uma lógica comercial por trás da experiência científica.'],
              ['Cursos médicos não nascem de slides.', 'Eles nascem de uma transformação clara, um público certo, uma promessa ética, uma oferta bem estruturada e uma experiência que entrega valor.'],
            ].map(([title, body]) => (
              <article key={title} className="grid gap-4 py-8 sm:grid-cols-[0.72fr_1.28fr]">
                <h3 className="text-[23px] font-light leading-tight">{title}</h3>
                <p className="text-[15px] font-light leading-relaxed text-[#6e6258]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#111113] px-5 py-24 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-4xl">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/36">Oportunidades</p>
            <h2 className="text-[42px] font-light leading-tight sm:text-[64px]">O Doctor Next Level abre o mapa.</h2>
            <p className="mt-6 max-w-2xl text-[16px] font-light leading-relaxed text-white/58">
              O curso mostra possibilidades que muitos médicos só descobrem tarde: como ganhar dinheiro ensinando, como fazer nome em congressos, como criar ativos de autoridade e como participar de mercados científicos com mais inteligência.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-[8px] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {opportunities.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className={`${index === 0 ? 'bg-white text-[#111113]' : 'bg-[#151517] text-white'} p-7`}>
                <div className={`mb-12 flex h-11 w-11 items-center justify-center rounded-full ${index === 0 ? 'bg-[#111113] text-white' : 'bg-white text-[#111113]'}`}>
                  <Icon size={17} />
                </div>
                <h3 className="text-[27px] font-light leading-tight">{title}</h3>
                <p className={`mt-5 text-[14px] font-light leading-relaxed ${index === 0 ? 'text-[#55555a]' : 'text-white/58'}`}>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="modulos" className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a7563]">Currículo</p>
              <h2 className="text-[42px] font-light leading-tight sm:text-[64px]">Uma formação para pensar como médico, educador e estrategista.</h2>
            </div>
            <p className="max-w-2xl text-[17px] font-light leading-relaxed text-[#6e6258] lg:pt-4">
              O curso não promete atalho vazio. Ele organiza o que o médico precisa entender para criar cursos, circular em congressos, construir autoridade e identificar oportunidades de receita com maturidade profissional.
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            {modules.map(module => (
              <article key={module.number} className="rounded-[8px] border border-black/[0.08] bg-white p-6 shadow-[0_18px_60px_rgba(45,36,27,0.055)]">
                <div className="mb-9 flex items-center justify-between gap-4">
                  <span className="rounded-full bg-[#111113] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white">Módulo {module.number}</span>
                  <BookOpenCheck size={18} className="text-[#8a7563]" />
                </div>
                <h3 className="text-[29px] font-light leading-tight">{module.title}</h3>
                <p className="mt-4 text-[14px] font-light leading-relaxed text-[#6e6258]">{module.promise}</p>
                <div className="mt-6 space-y-2">
                  {module.lessons.map(lesson => (
                    <p key={lesson} className="flex gap-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8a7563]">
                      <Check size={13} className="mt-0.5 shrink-0" />
                      {lesson}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="plataforma" className="grid bg-[#111113] text-white lg:grid-cols-2">
        <div className="relative min-h-[620px]">
          <img src="/assets/doctor-next-level-platform.png" alt="Plataforma premium de curso médico Doctor Next Level" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.55))]" />
        </div>
        <div className="flex min-h-[620px] items-center px-5 py-20 sm:px-8 lg:px-16">
          <div className="max-w-2xl">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/36">Plataforma de acesso</p>
            <h2 className="text-[42px] font-light leading-tight sm:text-[64px]">Conteúdo, templates e playbooks para executar com clareza.</h2>
            <p className="mt-6 text-[16px] font-light leading-relaxed text-white/60">
              O Doctor Next Level será uma plataforma Longecta: o médico acessa aulas, frameworks, modelos e materiais de apoio para entender o mercado e construir seus próprios ativos de autoridade.
            </p>
            <div className="mt-9 grid gap-px overflow-hidden rounded-[8px] border border-white/10 bg-white/10 sm:grid-cols-2">
              {platformItems.map(([title, body]) => (
                <div key={title} className="bg-[#151517] p-5">
                  <p className="text-[15px] font-semibold leading-tight">{title}</p>
                  <p className="mt-3 text-[13px] font-light leading-relaxed text-white/52">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a7563]">Mapa de valor</p>
              <h2 className="text-[42px] font-light leading-tight sm:text-[64px]">O aluno aprende a montar um sistema, não uma peça solta.</h2>
              <p className="mt-6 max-w-xl text-[16px] font-light leading-relaxed text-[#6e6258]">
                A lógica Longecta é simples: autoridade vira ativo; ativo vira oportunidade; oportunidade vira produto, palco, parceria ou receita.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={onMethod} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-[#111113] px-6 py-3 text-[13px] font-semibold text-white hover:bg-[#2d2d2f]">
                  Ver método Longecta
                  <ArrowRight size={15} />
                </button>
                <button onClick={onCongress} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.08] bg-white px-6 py-3 text-[13px] font-semibold text-[#111113] hover:bg-[#f2f0eb]">
                  Ver Congressos
                </button>
              </div>
            </div>
            <div className="grid gap-px overflow-hidden rounded-[8px] border border-black/[0.08] bg-black/[0.08] sm:grid-cols-2">
              {marketMap.map(([title, body]) => (
                <article key={title} className="bg-white p-7">
                  <div className="mb-12 flex h-11 w-11 items-center justify-center rounded-full bg-[#111113] text-white">
                    <Map size={17} />
                  </div>
                  <h3 className="text-[27px] font-light leading-tight">{title}</h3>
                  <p className="mt-5 text-[14px] font-light leading-relaxed text-[#6e6258]">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#efe5d8] px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-4xl">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a7563]">Para quem é</p>
            <h2 className="text-[42px] font-light leading-tight sm:text-[64px]">Para médicos que suspeitam que existe um próximo nível, mas ainda não sabem o mapa.</h2>
          </div>
          <div className="grid gap-3 lg:grid-cols-4">
            {studentProfiles.map(([title, body], index) => (
              <article key={title} className={`rounded-[8px] p-7 ${index === 0 ? 'bg-[#111113] text-white' : 'bg-white text-[#111113]'}`}>
                <div className={`mb-12 flex h-11 w-11 items-center justify-center rounded-full ${index === 0 ? 'bg-white text-[#111113]' : 'bg-[#111113] text-white'}`}>
                  <Target size={17} />
                </div>
                <h3 className="text-[26px] font-light leading-tight">{title}</h3>
                <p className={`mt-5 text-[14px] font-light leading-relaxed ${index === 0 ? 'text-white/58' : 'text-[#6e6258]'}`}>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.88fr_1.12fr]">
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a7563]">Diferenciais</p>
            <h2 className="text-[42px] font-light leading-tight sm:text-[64px]">Não é um curso de marketing médico comum.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              [Crown, 'Visão de negócio', 'Explica como o mercado funciona por dentro: eventos, patrocínio, educação, autoridade e relacionamento.'],
              [ShieldIcon, 'Sofisticação médica', 'Protege a imagem profissional com linguagem séria, ética e compatível com autoridade científica.'],
              [Workflow, 'Método prático', 'Transforma desejo de crescer em plano, ativos, abordagem e sequência de execução.'],
              [Trophy, 'Orientação premium', 'Nasce da experiência Longecta em congressos, palestrantes, cursos, publicidade e plataformas médicas.'],
            ].map(([Icon, title, body]) => {
              const IconComponent = Icon as React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
              return (
                <article key={title as string} className="rounded-[8px] border border-black/[0.08] bg-white p-7">
                  <div className="mb-12 flex h-11 w-11 items-center justify-center rounded-full bg-[#111113] text-white">
                    <IconComponent size={17} />
                  </div>
                  <h3 className="text-[26px] font-light leading-tight">{title as string}</h3>
                  <p className="mt-5 text-[14px] font-light leading-relaxed text-[#6e6258]">{body as string}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="inscricao" className="bg-[#111113] px-5 py-24 text-white sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/36">Próxima turma</p>
            <h2 className="max-w-4xl text-[44px] font-light leading-tight sm:text-[76px]">
              O próximo nível da carreira médica pode estar no que você ainda não aprendeu sobre o mercado.
            </h2>
            <p className="mt-7 max-w-2xl text-[17px] font-light leading-relaxed text-white/58">
              Entre na lista de interesse para receber prioridade quando a Longecta abrir a primeira turma do Doctor Next Level.
            </p>
          </div>
          <div className="rounded-[8px] bg-white p-7 text-[#111113] sm:p-8">
            <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#111113] text-white">
              <Rocket size={18} />
            </div>
            <h3 className="text-[32px] font-light leading-tight">Doctor Next Level</h3>
            <p className="mt-4 text-[15px] font-light leading-relaxed text-[#6e6258]">
              Curso e plataforma para médicos que querem entender congressos, criar cursos, fazer nome, construir autoridade e gerar oportunidades com educação médica.
            </p>
            <div className="mt-7 space-y-3">
              {['Acesso a aulas e frameworks', 'Templates de aplicação prática', 'Mapa de oportunidades médicas', 'Plano de execução em 90 dias'].map(item => (
                <p key={item} className="flex gap-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8a7563]">
                  <BadgeCheck size={14} className="mt-0.5 shrink-0" />
                  {item}
                </p>
              ))}
            </div>
            <a href={nextLevelMailto('Quero prioridade no Doctor Next Level')} className="button-nowrap mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#111113] px-6 py-3 text-[13px] font-semibold text-white hover:bg-[#2d2d2f]">
              Quero prioridade
              <Mail size={15} />
            </a>
            <button onClick={onPublicity} className="button-nowrap mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-black/[0.08] bg-[#f7f4ee] px-6 py-3 text-[13px] font-semibold text-[#111113] hover:bg-[#efe5d8]">
              Ver Longecta Publicity
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const ShieldIcon = ClipboardList;

export default DoctorNextLevelPage;
