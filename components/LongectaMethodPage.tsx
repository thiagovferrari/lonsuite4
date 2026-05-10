import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Brain,
  Building2,
  Check,
  ChevronRight,
  ClipboardCheck,
  Database,
  FileText,
  Fingerprint,
  Layers3,
  Lightbulb,
  MessageSquare,
  Network,
  PenLine,
  Presentation,
  Rocket,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Users,
  Wand2,
} from 'lucide-react';

interface LongectaMethodPageProps {
  onBack: () => void;
  onCongress: () => void;
  onPlans: () => void;
}

const methodMailto = (subject: string) =>
  `mailto:contato@lonsuite.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Olá, quero entender como a Longecta pode transformar meu conhecimento médico em uma estrutura de autoridade, conteúdo e crescimento. Pode me orientar nos próximos passos?')}`;

const pillars = [
  {
    icon: Database,
    title: 'Plataforma proprietária',
    body: 'Seu acervo, suas ideias, seus casos e seus materiais passam a viver em um ambiente organizado, pesquisável e preparado para produção recorrente.',
  },
  {
    icon: Users,
    title: 'Serviço especializado',
    body: 'Você não fica sozinho diante de uma ferramenta. Uma equipe com olhar médico, editorial e estratégico conduz a transformação até a entrega final.',
  },
  {
    icon: Brain,
    title: 'Inteligência contextual',
    body: 'A Longecta entende sua especialidade, linguagem, posicionamento, público e objetivos para que cada material reflita a autoridade que você já construiu.',
  },
];

const methodSteps = [
  {
    icon: UploadCloud,
    label: '1. Envio',
    title: 'Você envia o que já tem',
    body: 'Fotos, vídeos, aulas, PDFs, artigos, áudios, ideias, casos e materiais antigos entram em um ambiente único, sem depender de conversas soltas ou pastas esquecidas.',
  },
  {
    icon: Search,
    label: '2. Contexto',
    title: 'A plataforma organiza o valor',
    body: 'Cada material ganha tema, finalidade, potencial de uso e relação com seus objetivos: autoridade médica, educação, relacionamento, aula, campanha ou presença institucional.',
  },
  {
    icon: Wand2,
    label: '3. Inteligência',
    title: 'A IA acelera a estrutura',
    body: 'A tecnologia ajuda a mapear caminhos, organizar ideias, sugerir narrativas e reduzir o tempo entre o material bruto e uma direção clara de comunicação.',
  },
  {
    icon: PenLine,
    label: '4. Curadoria',
    title: 'A Longecta dá forma premium',
    body: 'Copy, design, estratégia e curadoria humana elevam o material para uma comunicação mais precisa, sofisticada e alinhada ao seu posicionamento.',
  },
  {
    icon: ClipboardCheck,
    label: '5. Aprovação',
    title: 'Você aprova com clareza',
    body: 'As entregas ficam organizadas para revisão, comentários e aprovação, reduzindo ruído, retrabalho e a sensação de que tudo depende de mensagens urgentes.',
  },
  {
    icon: Network,
    label: '6. Continuidade',
    title: 'Cada entrega alimenta a próxima',
    body: 'O que é produzido volta para sua memória estratégica. A próxima aula, campanha, publicação ou evento começa com mais repertório e menos improviso.',
  },
];

const deliverables = [
  'Posts e legendas',
  'Carrosséis científicos',
  'Roteiros de vídeo',
  'Aulas e apresentações',
  'Cases clínicos',
  'E-mails e releases',
  'Relatórios para diretoria',
  'Materiais para patrocinador',
  'Campanhas de clínica',
  'Planejamento de conteúdo',
  'Speaker kits',
  'Memória estratégica de eventos',
];

const products = [
  {
    icon: Award,
    title: 'Lon Authority Médico',
    body: 'Para médicos especialistas, professores, cirurgiões e palestrantes que querem transformar repertório em presença digital, científica e institucional.',
    items: ['Calendário mensal', 'Posts, carrosséis e LinkedIn', 'Conteúdo a partir de casos e aulas'],
  },
  {
    icon: Building2,
    title: 'Lon Clinic Authority',
    body: 'Para clínicas que precisam comunicar serviços, diferenciais, campanhas e educação médica com mais consistência, estética e organização.',
    items: ['Acervo da clínica', 'Campanhas mensais', 'Materiais para recepção e equipe'],
  },
  {
    icon: Rocket,
    title: 'Lon Event Brain',
    body: 'Para eventos científicos que querem transformar programação, palestrantes, bastidores e patrocinadores em memória, campanha e legado.',
    items: ['Central do congresso', 'Histórico de campanhas', 'Inteligência para próxima edição'],
  },
  {
    icon: FileText,
    title: 'Lon Sponsor Report',
    body: 'Para eventos e instituições que precisam demonstrar valor com clareza, estética, entregas, números e argumentos de renovação.',
    items: ['Book pós-evento', 'Presença de marca', 'Argumento para renovação'],
  },
];

const clientModes = [
  ['Mínimo esforço', 'Você envia materiais e aprova entregas. A estrutura trabalha por trás para transformar repertório em comunicação pronta.'],
  ['Colaborativo', 'Você participa das escolhas, comenta, seleciona temas e acompanha a evolução das campanhas com mais transparência.'],
  ['Estratégico', 'Você usa o ambiente como memória de autoridade: ideias, histórico, materiais, próximos temas e oportunidades ficam vivos.'],
];

const objections = [
  ['“Eu já uso IA.”', 'IA gera caminhos. A Longecta entrega estrutura, direção, curadoria, design, revisão e continuidade. O valor não está só em gerar texto: está em transformar repertório em presença de alto nível.'],
  ['“Eu já tenho Drive.”', 'Drive guarda arquivos. A Longecta dá destino aos arquivos: conteúdo, aula, campanha, case, relatório, comunicação institucional e memória estratégica.'],
  ['“Eu não tenho tempo.”', 'Esse é o ponto. A experiência foi pensada para reduzir sua carga: você envia o que tem, aprova com clareza e recebe uma operação que avança com método.'],
  ['“Eu já tenho equipe ou agência.”', 'A Longecta organiza a matéria-prima, o histórico e o processo, elevando a qualidade da comunicação e reduzindo perda de informação, ruído e retrabalho.'],
];

const outcomes = [
  ['Autoridade publicada', 'Sua experiência passa a aparecer com mais consistência, sofisticação e frequência.'],
  ['Menos carga na rotina', 'A comunicação deixa de depender de caçar arquivo, reenviar referência e explicar tudo de novo.'],
  ['Conteúdo com origem real', 'As campanhas nascem do seu repertório, não de ideias genéricas que poderiam servir para qualquer médico.'],
  ['Memória estratégica', 'Cada entrega fortalece um acervo que pode ser reutilizado em aulas, congressos, campanhas e materiais institucionais.'],
];

const LongectaMethodPage: React.FC<LongectaMethodPageProps> = ({ onBack, onCongress, onPlans }) => {
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
              Login
            </button>
            <div className="hidden items-center gap-6 text-[11px] font-semibold text-[#6e6e73] md:flex">
              <a href="#metodo" className="hover:text-[#1d1d1f]">Como funciona</a>
              <a href="#entregas" className="hover:text-[#1d1d1f]">Entregas</a>
              <a href="#produtos" className="hover:text-[#1d1d1f]">Soluções</a>
              <a href="#operacao" className="hover:text-[#1d1d1f]">Experiência</a>
            </div>
            <button onClick={onPlans} className="button-nowrap rounded-full bg-[#1d1d1f] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#2d2d2f]">
              Ver planos
            </button>
          </nav>

          <div className="grid min-h-[700px] items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="plans-story-enter">
              <p className="plans-eyebrow lon-glass-panel mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase text-[#6e6e73]">
                <Sparkles size={13} className="text-[#1d1d1f]" />
                Plataforma + serviço + curadoria
              </p>
              <h1 className="max-w-5xl text-[44px] leading-[0.98] sm:text-[66px] lg:text-[76px]">
                Transforme seu conhecimento médico em uma máquina de autoridade.
              </h1>
              <p className="mt-8 max-w-2xl text-[18px] font-light leading-relaxed text-[#6e6e73] sm:text-[21px]">
                A Longecta combina tecnologia proprietária, curadoria humana e serviço especializado para transformar casos, aulas, ideias, arquivos e experiências em conteúdo, campanhas, apresentações e presença médica de alto valor.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href={methodMailto('Quero conhecer o Método Longecta')} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-6 py-3 text-[13px] font-semibold text-white shadow-[0_18px_44px_rgba(0,0,0,0.18)] hover:bg-[#2d2d2f]">
                  Quero transformar meu acervo
                  <ArrowRight size={15} />
                </a>
                <a href="#metodo" className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.07] bg-white/72 px-6 py-3 text-[13px] font-semibold text-[#1d1d1f] shadow-sm backdrop-blur-xl hover:bg-white">
                  Ver como funciona
                </a>
              </div>
            </div>

            <div className="relative min-h-[560px] sm:min-h-[680px]">
              <img
                src="/assets/longecta-doctor-macbook.png"
                alt="Médica em consultório premium trabalhando em um laptop"
                className="absolute right-0 top-0 h-[430px] w-[94%] rounded-[30px] object-cover object-center shadow-[0_38px_120px_rgba(0,0,0,0.16)] sm:h-[540px] sm:w-[88%] sm:rounded-[38px]"
              />
              <div className="absolute bottom-0 left-0 w-[90%] rounded-[28px] bg-[#111113] p-5 text-white shadow-[0_40px_130px_rgba(0,0,0,0.32)] sm:w-[76%] sm:rounded-[34px] sm:p-7">
                <p className="mb-7 text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">Sistema híbrido</p>
                <h2 className="text-[32px] font-extralight leading-tight sm:text-[38px]">Software para organizar. Inteligência para direcionar. Longecta para transformar.</h2>
                <div className="mt-7 grid grid-cols-3 gap-2">
                  {['Plataforma', 'Serviço', 'Inteligência'].map(item => (
                    <span key={item} className="rounded-full bg-white/10 px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-white/70">{item}</span>
                  ))}
                </div>
              </div>
              <div className="plans-floating-metric lon-glass-panel-strong absolute bottom-[164px] right-0 hidden max-w-[158px] rounded-[20px] px-4 py-3 sm:block sm:right-6">
                <p className="text-[34px] font-extralight leading-none">3</p>
                <p className="mt-2 text-[10px] font-semibold leading-relaxed text-[#86868b]">camadas trabalhando para sua autoridade</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3 rounded-[30px] border border-white/78 bg-white/56 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.06)] backdrop-blur-xl md:grid-cols-3">
            {pillars.map(({ icon: Icon, title, body }) => (
              <article key={title} className="rounded-[22px] bg-white/70 p-5">
                <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-full bg-[#111113] text-white">
                  <Icon size={18} />
                </div>
                <h2 className="text-[25px] font-light leading-tight">{title}</h2>
                <p className="mt-4 text-[13px] leading-relaxed text-[#6e6e73]">{body}</p>
              </article>
            ))}
          </div>

          <section id="metodo" className="mt-24 scroll-mt-24">
            <div className="mb-8 max-w-4xl">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Como funciona para você</p>
              <h2 className="text-[40px] font-semibold leading-tight sm:text-[62px]">Do material parado à autoridade publicada.</h2>
              <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[#6e6e73]">
                A Longecta foi criada para médicos, clínicas e eventos que têm conhecimento, mas não têm uma estrutura contínua para transformar esse conhecimento em presença, reputação e relacionamento.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {methodSteps.map(({ icon: Icon, label, title, body }, index) => (
                <article key={title} className={`plans-card rounded-[30px] border p-6 shadow-[0_22px_70px_rgba(0,0,0,0.06)] ${index === 3 ? 'border-[#111113] bg-[#111113] text-white' : 'border-black/[0.055] bg-white/70 backdrop-blur-xl'}`}>
                  <div className="mb-10 flex items-center justify-between gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${index === 3 ? 'bg-white text-[#111113]' : 'bg-[#111113] text-white'}`}>
                      <Icon size={18} />
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${index === 3 ? 'bg-white/10 text-white/50' : 'bg-[#f5f5f7] text-[#86868b]'}`}>{label}</span>
                  </div>
                  <h3 className="text-[28px] font-light leading-tight">{title}</h3>
                  <p className={`mt-5 text-[13px] leading-relaxed ${index === 3 ? 'text-white/60' : 'text-[#6e6e73]'}`}>{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-24 overflow-hidden rounded-[42px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.10)]">
            <div className="grid lg:grid-cols-[1.04fr_0.96fr]">
              <div className="p-8 sm:p-12 lg:p-16">
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Por que é diferente</p>
                <h2 className="text-[40px] font-semibold leading-tight sm:text-[58px]">Não é só software. Não é só agência. É uma estrutura híbrida.</h2>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[
                    ['Plataforma', 'Centraliza acervo, histórico, arquivos, aprovações e materiais para reduzir dispersão.'],
                    ['Curadoria', 'Transforma repertório técnico em comunicação compreensível, elegante e estratégica.'],
                    ['Serviço', 'A equipe Longecta conduz a produção, lapida a linguagem e dá acabamento premium.'],
                    ['Inteligência', 'O contexto acumulado melhora próximos conteúdos, campanhas, aulas e materiais.'],
                  ].map(([title, body]) => (
                    <div key={title} className="rounded-[24px] border border-black/[0.055] bg-[#f7f7f8] p-5">
                      <Check size={18} className="mb-7 text-[#111113]" />
                      <p className="text-[15px] font-semibold">{title}</p>
                      <p className="mt-3 text-[12px] leading-relaxed text-[#6e6e73]">{body}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative min-h-[520px] overflow-hidden bg-[#050506]">
                <img src="/assets/longecta-doctor-window.png" alt="Médico em consultório olhando pela janela e pensando em possibilidades estratégicas" className="h-full w-full object-cover object-center grayscale opacity-95" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,19,0.05),rgba(17,17,19,0.74))]" />
                <div className="absolute bottom-8 left-8 right-8 rounded-[28px] border border-white/12 bg-black/35 p-6 text-white backdrop-blur-xl">
                  <Lightbulb size={18} className="mb-8 text-white/58" />
                  <p className="text-[28px] font-extralight leading-tight">Sua experiência deixa de ficar escondida e passa a trabalhar pela sua reputação.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="entregas" className="mt-24 scroll-mt-24">
            <div className="mb-8 max-w-4xl">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Saídas concretas</p>
              <h2 className="text-[40px] font-semibold leading-tight sm:text-[60px]">Seu repertório vira materiais que fortalecem presença e valor.</h2>
              <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[#6e6e73]">
                Em vez de criar conteúdo genérico, a Longecta transforma o que já existe na sua prática em peças com origem, narrativa, estética e intenção.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {deliverables.map((item, index) => (
                <div key={item} className={`rounded-[24px] border p-5 ${index === 0 ? 'border-[#111113] bg-[#111113] text-white' : 'border-black/[0.055] bg-white/68 text-[#111113] backdrop-blur-xl'}`}>
                  <Presentation size={18} className={`mb-8 ${index === 0 ? 'text-white/70' : 'text-[#1d1d1f]/70'}`} />
                  <p className="text-[18px] font-light leading-tight">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="produtos" className="mt-24 scroll-mt-24">
            <div className="mb-8 max-w-4xl">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Soluções Longecta</p>
              <h2 className="text-[40px] font-semibold leading-tight sm:text-[60px]">Uma estrutura adaptada ao seu momento de crescimento.</h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {products.map(({ icon: Icon, title, body, items }) => (
                <article key={title} className="plans-card rounded-[34px] border border-black/[0.055] bg-white/72 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.07)] backdrop-blur-xl">
                  <div className="mb-8 flex items-center justify-between gap-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111113] text-white">
                      <Icon size={18} />
                    </div>
                    <ChevronRight size={18} className="text-[#a1a1a6]" />
                  </div>
                  <h3 className="text-[30px] font-light leading-tight">{title}</h3>
                  <p className="mt-4 text-[14px] leading-relaxed text-[#6e6e73]">{body}</p>
                  <div className="mt-7 grid gap-2 sm:grid-cols-3">
                    {items.map(item => (
                      <span key={item} className="rounded-full bg-[#f5f5f7] px-3 py-2 text-[11px] font-semibold text-[#6e6e73]">{item}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="operacao" className="mt-24 overflow-hidden rounded-[42px] bg-[#111113] text-white shadow-[0_38px_120px_rgba(0,0,0,0.25)]">
            <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
              <div className="relative min-h-[520px] overflow-hidden bg-[#050506]">
                <img src="/assets/longecta-doctor-video.png" alt="Médico gravando vídeo profissional no consultório com smartphone" className="h-full w-full object-cover object-center grayscale opacity-85" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,19,0.75),rgba(17,17,19,0.10))]" />
                <div className="absolute bottom-8 left-8 right-8 rounded-[28px] border border-white/12 bg-black/35 p-6 backdrop-blur-xl">
                  <MessageSquare size={18} className="mb-8 text-white/58" />
                  <p className="text-[28px] font-extralight leading-tight">Você aparece com mais consistência sem transformar comunicação em mais uma carga da rotina.</p>
                </div>
              </div>
              <div className="p-8 sm:p-12 lg:p-16">
                <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/38">Experiência do cliente</p>
                <h2 className="max-w-3xl text-[40px] font-extralight leading-tight sm:text-[62px]">Funciona mesmo para quem tem pouco tempo.</h2>
                <p className="mt-7 max-w-2xl text-[15px] font-light leading-relaxed text-white/62">
                  Você não precisa se tornar operador de ferramenta, social media ou diretor de criação. A plataforma organiza o caminho; a equipe Longecta conduz a transformação; você participa no nível que fizer sentido para sua rotina.
                </p>
                <div className="mt-9 grid gap-3">
                  {clientModes.map(([title, body], index) => (
                    <div key={title} className={`rounded-[24px] border p-5 ${index === 0 ? 'border-white/24 bg-white text-[#111113]' : 'border-white/10 bg-white/[0.06] text-white'}`}>
                      <div className="mb-5 flex items-center gap-3">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold ${index === 0 ? 'bg-[#111113] text-white' : 'bg-white/10 text-white/70'}`}>{index + 1}</span>
                        <p className="text-[16px] font-semibold">{title}</p>
                      </div>
                      <p className={`text-[13px] leading-relaxed ${index === 0 ? 'text-[#6e6e73]' : 'text-white/56'}`}>{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-24 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="lon-glass-panel rounded-[38px] p-7 sm:p-10">
              <Fingerprint size={22} className="mb-10 text-[#1d1d1f]" />
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Perfil de inteligência</p>
              <h2 className="text-[38px] font-semibold leading-tight sm:text-[52px]">Seu contexto vira inteligência proprietária.</h2>
              <p className="mt-6 text-[15px] leading-relaxed text-[#6e6e73]">
                Especialidade, tom de voz, público, serviços, diferenciais, histórico, temas sensíveis, eventos e estilo visual deixam de depender de memória informal.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {outcomes.map(([title, body], index) => (
                <article key={title} className={`rounded-[30px] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.06)] ${index === 3 ? 'bg-[#111113] text-white' : 'bg-white/70 text-[#111113] backdrop-blur-xl'}`}>
                  <Layers3 size={18} className={`mb-10 ${index === 3 ? 'text-white/60' : 'text-[#1d1d1f]/70'}`} />
                  <h3 className="text-[26px] font-light leading-tight">{title}</h3>
                  <p className={`mt-4 text-[13px] leading-relaxed ${index === 3 ? 'text-white/58' : 'text-[#6e6e73]'}`}>{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-24">
            <div className="mb-8 max-w-4xl">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Objeções comuns</p>
              <h2 className="text-[40px] font-semibold leading-tight sm:text-[60px]">Por que isso supera ferramenta isolada, pasta de arquivos e produção genérica.</h2>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              {objections.map(([question, answer]) => (
                <article key={question} className="rounded-[28px] border border-black/[0.055] bg-white/72 p-6 shadow-sm backdrop-blur-xl">
                  <h3 className="text-[22px] font-light leading-tight">{question}</h3>
                  <p className="mt-4 text-[13px] leading-relaxed text-[#6e6e73]">{answer}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="relative mt-24 overflow-hidden rounded-[42px] bg-[#111113] px-7 py-16 text-center text-white shadow-[0_38px_130px_rgba(0,0,0,0.26)] sm:px-12 sm:py-20">
            <img src="/assets/longecta-doctor-camera.png" alt="" className="absolute inset-0 h-full w-full object-cover object-center grayscale opacity-42" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,19,0.95),rgba(17,17,19,0.62),rgba(17,17,19,0.95))]" />
            <div className="relative z-10">
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/44">Próximo passo</p>
              <h2 className="mx-auto max-w-4xl text-[42px] font-extralight leading-tight sm:text-[66px]">Sua experiência médica já tem valor. Agora ela precisa de estrutura para aparecer.</h2>
              <p className="mx-auto mt-7 max-w-2xl text-[16px] font-light leading-relaxed text-white/62">
                A Longecta une plataforma, serviço, curadoria e inteligência para transformar conhecimento disperso em autoridade contínua, com estética, consistência e clareza.
              </p>
              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <a href={methodMailto('Quero estruturar o Método Longecta')} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-[13px] font-semibold text-[#111113] hover:bg-white/90">
                  Quero estruturar meu acervo
                  <Send size={15} />
                </a>
                <button onClick={onPlans} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3 text-[13px] font-semibold text-white backdrop-blur hover:bg-white/16">
                  Ver planos
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-[32px] border border-black/[0.055] bg-white/72 p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,0.07)] backdrop-blur-xl sm:p-8">
            <p className="mx-auto max-w-2xl text-[15px] font-light leading-relaxed text-[#6e6e73]">
              Para congressos médicos, a Longecta aplica o mesmo método em uma frente especializada para transformar eventos científicos em marcas de valor.
            </p>
            <button onClick={onCongress} className="button-nowrap mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#111113] px-6 py-3 text-[13px] font-semibold text-white hover:bg-[#2d2d2f]">
              Longecta Congressos
              <ArrowRight size={15} />
            </button>
          </section>
        </div>
      </section>
    </div>
  );
};

export default LongectaMethodPage;
