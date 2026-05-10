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
  `mailto:contato@lonsuite.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Olá, quero entender como a Longecta pode estruturar plataforma, serviço e inteligência para transformar meu acervo médico em autoridade. Pode me orientar nos próximos passos?')}`;

const pillars = [
  {
    icon: Database,
    title: 'Plataforma',
    body: 'O acervo deixa de ser uma pasta passiva e vira um ambiente organizado por tema, status, potencial de uso, histórico e aprovação.',
  },
  {
    icon: Users,
    title: 'Serviço',
    body: 'A Longecta entra como operação estratégica: seleciona, lapida, desenha, escreve, revisa e transforma o material em entrega publicável.',
  },
  {
    icon: Brain,
    title: 'Inteligência',
    body: 'Cada cliente ganha contexto: especialidade, linguagem, público, objetivos, histórico, eventos, serviços e estilo editorial.',
  },
];

const methodSteps = [
  {
    icon: UploadCloud,
    label: 'Entrada',
    title: 'Você envia o bruto',
    body: 'Fotos, vídeos, PDFs, aulas, áudios, artigos, ideias, programação científica, bastidores, materiais antigos e referências entram em um fluxo único.',
  },
  {
    icon: Search,
    label: 'Organização',
    title: 'A plataforma cria contexto',
    body: 'Os materiais são classificados por tipo, tema, evento, status, sensibilidade, potencial de uso e destino provável: post, aula, case, campanha ou relatório.',
  },
  {
    icon: Wand2,
    label: 'Primeira versão',
    title: 'A IA estrutura a saída',
    body: 'A inteligência artificial ajuda a gerar títulos, caminhos de narrativa, legendas, roteiros, tópicos, resumos e possibilidades de reaproveitamento.',
  },
  {
    icon: PenLine,
    label: 'Curadoria',
    title: 'A Longecta transforma',
    body: 'Estrategista, curador, copywriter e designer refinam o material para ficar alinhado à autoridade médica, ao público e ao momento comercial.',
  },
  {
    icon: ClipboardCheck,
    label: 'Aprovação',
    title: 'O cliente decide rápido',
    body: 'O médico, a clínica ou o evento aprova, comenta ou pede ajuste sem depender de conversas perdidas e arquivos reenviados no WhatsApp.',
  },
  {
    icon: Network,
    label: 'Memória',
    title: 'Tudo volta para o acervo',
    body: 'Cada entrega vira histórico reutilizável. A próxima campanha, aula ou edição começa mais inteligente do que a anterior.',
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
    body: 'Para médicos especialistas, professores, cirurgiões e palestrantes que querem transformar repertório clínico em autoridade publicada.',
    items: ['Calendário mensal', 'Posts, carrosséis e LinkedIn', 'Conteúdo a partir de casos e aulas'],
  },
  {
    icon: Building2,
    title: 'Lon Clinic Authority',
    body: 'Para clínicas que precisam organizar serviços, campanhas, materiais institucionais, comunicação educativa e aprovações internas.',
    items: ['Acervo da clínica', 'Campanhas mensais', 'Materiais para recepção e equipe'],
  },
  {
    icon: Rocket,
    title: 'Lon Event Brain',
    body: 'Para congressos que querem transformar programação, palestrantes, fotos, vídeos e patrocinadores em memória estratégica do evento.',
    items: ['Central do congresso', 'Histórico de campanhas', 'Inteligência para próxima edição'],
  },
  {
    icon: FileText,
    title: 'Lon Sponsor Report',
    body: 'Para eventos que precisam provar valor a patrocinadores com clareza, estética, números, entregas e oportunidades comerciais.',
    items: ['Book pós-evento', 'Presença de marca', 'Argumento para renovação'],
  },
];

const clientModes = [
  ['Mínimo esforço', 'Envia material e aprova. Ideal para o médico ocupado que quer resultado sem aprender uma operação nova.'],
  ['Colaborativo', 'Seleciona arquivos, comenta, pede materiais e participa da construção editorial com a equipe Longecta.'],
  ['Power user', 'Usa o acervo para organizar ideias, acompanhar histórico, gerar possibilidades e alimentar uma máquina contínua.'],
];

const objections = [
  ['“Eu já uso ChatGPT.”', 'O ChatGPT responde. A Longecta cria uma operação: acervo, contexto, histórico, fluxo, aprovação, curadoria e acabamento profissional.'],
  ['“Eu já tenho Drive.”', 'O Drive guarda arquivos. A Longecta transforma arquivos em materiais úteis, com destino, narrativa, revisão e reutilização.'],
  ['“Eu não tenho tempo.”', 'O método foi desenhado para pouco esforço: você envia o bruto, a plataforma organiza e a Longecta transforma.'],
  ['“Eu já tenho agência.”', 'O método potencializa a operação, reduz perda de informação e cria um fluxo mais profissional entre cliente, conteúdo e entrega.'],
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
              <a href="#metodo" className="hover:text-[#1d1d1f]">Método</a>
              <a href="#entregas" className="hover:text-[#1d1d1f]">Entregas</a>
              <a href="#produtos" className="hover:text-[#1d1d1f]">Produtos</a>
              <a href="#operacao" className="hover:text-[#1d1d1f]">Operação</a>
            </div>
            <button onClick={onPlans} className="button-nowrap rounded-full bg-[#1d1d1f] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#2d2d2f]">
              Ver planos
            </button>
          </nav>

          <div className="grid min-h-[700px] items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="plans-story-enter">
              <p className="plans-eyebrow lon-glass-panel mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase text-[#6e6e73]">
                <Sparkles size={13} className="text-[#1d1d1f]" />
                Método Longecta
              </p>
              <h1 className="max-w-5xl text-[44px] leading-[0.98] sm:text-[66px] lg:text-[76px]">
                Você envia o bruto. A tecnologia organiza. A Longecta transforma.
              </h1>
              <p className="mt-8 max-w-2xl text-[18px] font-light leading-relaxed text-[#6e6e73] sm:text-[21px]">
                A Longecta une plataforma, serviço e inteligência para transformar conhecimento médico disperso em conteúdo, autoridade, campanhas, aulas, relatórios e memória estratégica.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href={methodMailto('Quero conhecer o Método Longecta')} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-6 py-3 text-[13px] font-semibold text-white shadow-[0_18px_44px_rgba(0,0,0,0.18)] hover:bg-[#2d2d2f]">
                  Quero conhecer o método
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
                <p className="mb-7 text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">Virada estratégica</p>
                <h2 className="text-[32px] font-extralight leading-tight sm:text-[38px]">Menos demanda caótica. Mais processo, autoridade e escala.</h2>
                <div className="mt-7 grid grid-cols-3 gap-2">
                  {['Plataforma', 'Serviço', 'Inteligência'].map(item => (
                    <span key={item} className="rounded-full bg-white/10 px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-white/70">{item}</span>
                  ))}
                </div>
              </div>
              <div className="plans-floating-metric lon-glass-panel-strong absolute bottom-[164px] right-0 hidden max-w-[158px] rounded-[20px] px-4 py-3 sm:block sm:right-6">
                <p className="text-[34px] font-extralight leading-none">3</p>
                <p className="mt-2 text-[10px] font-semibold leading-relaxed text-[#86868b]">camadas para criar uma estrutura difícil de copiar</p>
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
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Método operacional</p>
              <h2 className="text-[40px] font-semibold leading-tight sm:text-[62px]">Da informação médica dispersa ao ativo de autoridade.</h2>
              <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[#6e6e73]">
                O método Longecta foi desenhado para tirar o cliente da dependência de briefings soltos, mensagens perdidas e criação recomeçada do zero. Cada arquivo entra, ganha contexto, vira entrega e volta para uma memória reutilizável.
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
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">O que muda para o cliente</p>
                <h2 className="text-[40px] font-semibold leading-tight sm:text-[58px]">Ele não sente que comprou uma ferramenta. Ele sente que ganhou uma estrutura.</h2>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[
                    ['Organização', 'O conhecimento não fica mais perdido entre Drive, celular, e-mail e WhatsApp.'],
                    ['Autoridade', 'O conteúdo passa a refletir o tamanho real da experiência médica.'],
                    ['Continuidade', 'Cada material produzido alimenta a próxima campanha, aula ou evento.'],
                    ['Tranquilidade', 'A Longecta opera junto, revisa, lapida e entrega com método.'],
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
                  <p className="text-[28px] font-extralight leading-tight">A operação deixa de ser “pedido por pedido” e vira uma máquina editorial inteligente.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="entregas" className="mt-24 scroll-mt-24">
            <div className="mb-8 max-w-4xl">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Saídas concretas</p>
              <h2 className="text-[40px] font-semibold leading-tight sm:text-[60px]">O acervo vira materiais que o cliente realmente usa.</h2>
              <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[#6e6e73]">
                A Longecta não parte de conteúdo genérico. Ela parte da experiência real do médico, da clínica ou do evento, e transforma esse repertório em peças úteis para reputação, ensino, relacionamento e venda.
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
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Produtos Longecta</p>
              <h2 className="text-[40px] font-semibold leading-tight sm:text-[60px]">Um método, várias ofertas vendáveis.</h2>
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
                  <p className="text-[28px] font-extralight leading-tight">Menos WhatsApp, menos retrabalho, mais organização, velocidade e memória estratégica.</p>
                </div>
              </div>
              <div className="p-8 sm:p-12 lg:p-16">
                <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/38">Operação Longecta</p>
                <h2 className="max-w-3xl text-[40px] font-extralight leading-tight sm:text-[62px]">Um fluxo claro para uma rotina médica que não tem tempo sobrando.</h2>
                <p className="mt-7 max-w-2xl text-[15px] font-light leading-relaxed text-white/62">
                  O método precisa funcionar para diferentes níveis de envolvimento. O cliente não é obrigado a virar operador de sistema. Ele pode simplesmente enviar material e aprovar, enquanto a Longecta mantém o processo andando.
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
              <h2 className="text-[38px] font-semibold leading-tight sm:text-[52px]">Cada cliente ganha um cérebro operacional.</h2>
              <p className="mt-6 text-[15px] leading-relaxed text-[#6e6e73]">
                Especialidade, tom de voz, público, temas proibidos, termos preferidos, histórico, objetivos, serviços, eventos e estilo visual passam a morar no método.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                ['Retenção', 'Quanto mais usa, mais valioso o ambiente fica para o cliente.'],
                ['Velocidade', 'A próxima entrega começa com histórico, não com uma página em branco.'],
                ['Consistência', 'O tom, a estética e a lógica médica deixam de depender de memória informal.'],
                ['Escala', 'A equipe Longecta consegue atender mais clientes com menos caos operacional.'],
              ].map(([title, body], index) => (
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
              <h2 className="text-[40px] font-semibold leading-tight sm:text-[60px]">Por que isso não é só IA, Drive ou agência.</h2>
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
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/44">Recomendação final</p>
              <h2 className="mx-auto max-w-4xl text-[42px] font-extralight leading-tight sm:text-[66px]">A Longecta não compete com IA. Ela usa IA para virar uma estrutura de inteligência médica.</h2>
              <p className="mx-auto mt-7 max-w-2xl text-[16px] font-light leading-relaxed text-white/62">
                Menos execução solta. Mais sistema. Menos demanda caótica. Mais processo. Menos post vendido. Mais autoridade construída.
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
