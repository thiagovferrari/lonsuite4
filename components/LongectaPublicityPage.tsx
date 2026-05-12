import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Check,
  Crown,
  Download,
  Landmark,
  Mail,
  Mic2,
  Network,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';

interface LongectaPublicityPageProps {
  onBack: () => void;
  onProgress: () => void;
  onMethod: () => void;
  onCongress: () => void;
}

const publicityMailto = (subject: string, body?: string) =>
  `mailto:contato@lonsuite.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body || 'Olá, quero estruturar a comunicação e a captação do meu projeto médico, curso, congresso ou atuação como palestrante. Quero um diagnóstico estratégico da Longecta Publicity.')}`;

const executiveBriefHref = '/assets/longecta-publicity-dossie-executivo.pdf';

const segments = [
  {
    icon: Mic2,
    title: 'Médicos palestrantes',
    line: 'Para especialistas que precisam transformar reputação científica em convites, relacionamento e oportunidades qualificadas.',
    bullets: ['Narrativa de autoridade', 'Speaker assets', 'Agenda de relacionamento'],
  },
  {
    icon: BookOpenCheck,
    title: 'Donos de cursos médicos',
    line: 'Para quem ensina medicina e precisa posicionar uma turma, uma metodologia ou uma experiência educacional com alto valor percebido.',
    bullets: ['Oferta educacional', 'Página de inscrição', 'Campanha de turma'],
  },
  {
    icon: Crown,
    title: 'Donos de congressos',
    line: 'Para organizadores que precisam atrair inscritos, speakers, patrocinadores e percepção institucional de primeira linha.',
    bullets: ['Marca da edição', 'Captação comercial', 'Patrocínio e inscrição'],
  },
  {
    icon: Landmark,
    title: 'Sociedades médicas',
    line: 'Para presidentes, sócios e lideranças regionais ou nacionais que precisam comunicar com solidez, clareza e autoridade.',
    bullets: ['Comunicação institucional', 'Campanhas oficiais', 'Materiais executivos'],
  },
];

const system = [
  ['Estratégia', 'Definimos público, proposta, narrativa, ativos prioritários e rota de captação.'],
  ['Plataforma', 'Organizamos páginas, acervo, materiais, formulários, listas e memória comercial.'],
  ['Design', 'Criamos identidade, copy, apresentações, propostas e peças com acabamento premium.'],
  ['Execução', 'Acompanhamos campanha, abordagem, follow-up e próximos ciclos com método.'],
];

const deliverables = [
  'Posicionamento executivo',
  'Speaker profile premium',
  'Página de inscrição',
  'Campanha de congresso',
  'Proposta para patrocinador',
  'Deck institucional',
  'Copy de lançamento',
  'Criativos de alto valor',
  'Formulário e qualificação',
  'Follow-up comercial',
  'Base de relacionamento',
  'Relatório da edição',
];

const authorityMap = [
  ['Produto', 'Páginas, formulários, materiais e acervo estruturado.'],
  ['Serviço', 'Copy, design, campanha, apresentação e execução assistida.'],
  ['Consultoria', 'Decisão estratégica para oferta, público, preço e posicionamento.'],
  ['Plataforma', 'Organização e memória para repetir, medir e evoluir cada ciclo.'],
];

const visualProofs = [
  {
    image: '/assets/longecta-publicity-doctor-phone.png',
    title: 'Relacionamentos médicos organizados com intenção comercial.',
    label: 'Networking e liderança',
  },
  {
    image: '/assets/longecta-publicity-congress-stage.png',
    title: 'Autoridade científica apresentada com percepção de alto valor.',
    label: 'Aulas, cursos e congressos',
  },
  {
    image: '/assets/longecta-publicity-strategy-room.png',
    title: 'Decisão estratégica para inscritos, patrocinadores e recorrência.',
    label: 'Organizadores e patrocinadores',
  },
];

const LongectaPublicityPage: React.FC<LongectaPublicityPageProps> = ({ onBack, onMethod }) => {
  return (
    <div className="longecta-black-orbit min-h-screen overflow-hidden bg-[#050505] text-white">
      <section className="relative px-5 pb-20 pt-6 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_10%,rgba(255,255,255,0.10),transparent_31%),radial-gradient(circle_at_18%_24%,rgba(232,207,168,0.08),transparent_28%),linear-gradient(180deg,#090909,#050505_46%,#000)]" />
        <div className="longecta-noise absolute inset-0 opacity-60" />
        <div className="longecta-luxury-sweep absolute inset-0" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/20" />

        <div className="relative mx-auto max-w-7xl">
          <nav className="sticky top-4 z-30 mb-12 flex items-center justify-between rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
            <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold text-white/62 transition hover:bg-white hover:text-[#050505]">
              <ArrowLeft size={14} />
              Voltar
            </button>
            <div className="hidden items-center gap-6 text-[11px] font-semibold text-white/48 md:flex">
              <a href="#publico" className="hover:text-white">Público</a>
              <a href="#sistema" className="hover:text-white">Sistema</a>
              <a href="#captura" className="hover:text-white">Diagnóstico</a>
            </div>
            <a href={publicityMailto('Quero um diagnóstico Longecta Publicity')} className="button-nowrap rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-[#050505] hover:bg-white/90">
              Diagnóstico
            </a>
          </nav>

          <header className="grid min-h-[720px] items-center gap-10 lg:grid-cols-[0.88fr_1.12fr]">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/58 backdrop-blur-xl">
                <Sparkles size={13} className="text-white" />
                Longecta Publicity
              </p>
              <h1 className="max-w-5xl text-[44px] font-light leading-[1] tracking-[0] sm:text-[70px] lg:text-[82px]">
                A estrutura premium para líderes médicos captarem com autoridade.
              </h1>
              <p className="mt-7 max-w-2xl text-[18px] font-light leading-relaxed text-white/70 sm:text-[20px]">
                Unimos plataforma, consultoria, design, estratégia e execução para médicos palestrantes, donos de cursos, sociedades médicas e congressos que precisam crescer com método.
              </p>

              <div className="longecta-premium-card mt-6 max-w-2xl rounded-[26px] border border-white/12 bg-black/32 p-4 shadow-[0_24px_80px_rgba(255,255,255,0.05)] backdrop-blur-xl sm:p-5">
                <p className="relative text-[18px] font-extralight leading-snug text-white sm:text-[22px]">
                  Não vendemos “posts”. Construímos sistemas de percepção e captação para transformar autoridade científica em inscrições, patrocínios, convites e relacionamentos qualificados.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={publicityMailto('Quero um diagnóstico estratégico Longecta Publicity')} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-[13px] font-semibold text-[#050505] shadow-[0_22px_70px_rgba(255,255,255,0.18)] transition hover:-translate-y-0.5 hover:bg-white/90">
                  Solicitar diagnóstico estratégico
                  <Send size={15} />
                </a>
                <a href={executiveBriefHref} download className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/[0.07] px-7 py-3 text-[13px] font-semibold text-white backdrop-blur-xl transition hover:bg-white hover:text-[#050505]">
                  Baixar dossiê executivo
                  <Download size={15} />
                </a>
              </div>

              <div className="mt-8 grid max-w-2xl gap-2 sm:grid-cols-3">
                {[
                  ['Educação', 'cursos com proposta clara'],
                  ['Congresso', 'inscrição e patrocínio'],
                  ['Autoridade', 'presença institucional sólida'],
                ].map(([title, body]) => (
                  <div key={title} className="longecta-premium-card longecta-hover-lift rounded-[22px] border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl">
                    <p className="relative text-[10px] font-bold uppercase tracking-[0.18em] text-white/38">{title}</p>
                    <p className="relative mt-5 text-[16px] font-light leading-tight text-white">{body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="group relative">
              <div className="longecta-glass-beam absolute -left-12 top-10 h-[78%] w-[30%] rotate-[10deg] rounded-full" />
              <div className="longecta-glass-beam longecta-glass-beam-delayed absolute right-0 top-0 h-[56%] w-[22%] -rotate-[18deg] rounded-full" />
              <div className="absolute -inset-4 rounded-[46px] bg-white/[0.08] blur-2xl transition duration-700 group-hover:bg-white/[0.15]" />
              <div className="relative overflow-hidden rounded-[42px] border border-white/12 bg-white/[0.06] p-3 shadow-[0_44px_150px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                <div className="relative min-h-[590px] overflow-hidden rounded-[34px] bg-black">
                  <img src="/assets/longecta-publicity-product-black.png" alt="Dashboard premium de captação para palestrantes e congressos médicos" className="absolute inset-0 h-full w-full object-cover object-center opacity-95 transition duration-700 group-hover:scale-[1.035]" />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.74),rgba(0,0,0,0.02),rgba(0,0,0,0.48))]" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/42">Publicity engine</p>
                    <h2 className="max-w-sm text-[28px] font-extralight leading-tight sm:text-[34px]">Da autoridade científica ao relacionamento qualificado.</h2>
                  </div>
                  <div className="absolute right-5 top-5 hidden rounded-[24px] border border-white/12 bg-black/40 p-5 backdrop-blur-xl sm:block">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">Sistema Longecta</p>
                    <p className="mt-6 max-w-[220px] text-[15px] font-light leading-relaxed text-white/72">Produto, serviço, plataforma e consultoria para negócios médicos de alto valor.</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <section id="publico" className="mt-8 scroll-mt-24">
            <div className="mb-7 max-w-4xl">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/36">Público-alvo</p>
              <h2 className="text-[38px] font-light leading-tight sm:text-[58px]">Para quem precisa comunicar liderança, não apenas presença.</h2>
            </div>
            <div className="grid gap-3 lg:grid-cols-4">
              {segments.map(({ icon: Icon, title, line, bullets }, index) => (
                <article key={title} className={`longecta-premium-card longecta-hover-lift group rounded-[30px] border p-6 shadow-[0_24px_90px_rgba(0,0,0,0.25)] ${index === 0 ? 'border-white bg-white text-[#050505]' : 'border-white/10 bg-white/[0.055] text-white backdrop-blur-xl hover:bg-white/[0.09]'}`}>
                  <div className={`relative mb-10 flex h-12 w-12 items-center justify-center rounded-full ${index === 0 ? 'bg-[#050505] text-white' : 'bg-white text-[#050505]'}`}>
                    <Icon size={18} />
                  </div>
                  <h3 className="relative text-[25px] font-light leading-tight">{title}</h3>
                  <p className={`relative mt-4 text-[13px] leading-relaxed ${index === 0 ? 'text-[#424245]' : 'text-white/58'}`}>{line}</p>
                  <div className="relative mt-7 space-y-2">
                    {bullets.map(item => (
                      <p key={item} className={`flex gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] ${index === 0 ? 'text-[#6e6e73]' : 'text-white/46'}`}>
                        <Check size={13} className="mt-0.5 shrink-0" />
                        {item}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-20 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="longecta-premium-card rounded-[38px] border border-white/10 bg-white/[0.055] p-6 shadow-[0_34px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8">
              <div className="relative mb-14 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#050505]">
                <ShieldCheck size={18} />
              </div>
              <p className="relative mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/36">O que somos</p>
              <h2 className="relative text-[38px] font-light leading-tight sm:text-[54px]">Uma solução híbrida para negócios médicos com reputação a proteger.</h2>
              <p className="relative mt-6 max-w-2xl text-[15px] leading-relaxed text-white/58">
                A Longecta entra onde uma agência comum fica rasa: entendemos produto, público médico, contexto científico, design, jornada comercial e execução. O resultado é uma operação mais clara, mais elegante e mais confiável.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {authorityMap.map(([title, body]) => (
                <article key={title} className="longecta-premium-card longecta-hover-lift rounded-[30px] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl">
                  <p className="relative mb-8 text-[10px] font-bold uppercase tracking-[0.18em] text-white/36">{title}</p>
                  <p className="relative text-[15px] font-light leading-relaxed text-white/70">{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-20 grid gap-3 lg:grid-cols-[1.2fr_0.8fr_1fr]">
            {visualProofs.map((item, index) => (
              <article key={item.title} className={`longecta-hover-lift group overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.055] shadow-[0_28px_100px_rgba(0,0,0,0.30)] backdrop-blur-xl ${index === 0 ? 'lg:min-h-[600px]' : 'lg:min-h-[520px]'}`}>
                <div className="relative h-[420px] overflow-hidden lg:h-full">
                  <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover object-center opacity-92 transition duration-700 group-hover:scale-[1.035]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.82))]" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/42">{item.label}</p>
                    <h3 className="text-[28px] font-extralight leading-tight text-white sm:text-[36px]">{item.title}</h3>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section id="sistema" className="mt-20 grid gap-4 rounded-[42px] border border-white/10 bg-white/[0.055] p-5 shadow-[0_34px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl lg:grid-cols-[0.72fr_1.28fr]">
            <div className="rounded-[34px] bg-white p-7 text-[#050505]">
              <Crown size={22} className="mb-12" />
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">O conceito</p>
              <h2 className="text-[38px] font-light leading-tight sm:text-[52px]">Estratégia, produto e execução trabalhando na mesma direção.</h2>
              <button onClick={onMethod} className="button-nowrap mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#050505] px-6 py-3 text-[13px] font-semibold text-white hover:bg-[#1d1d1f]">
                Ver método
                <ArrowRight size={15} />
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              {system.map(([title, body], index) => (
                <article key={title} className={`rounded-[26px] p-5 ${index === 1 ? 'bg-white text-[#050505]' : 'bg-black/35 text-white'} border border-white/10`}>
                  <p className={`mb-8 text-[10px] font-bold uppercase tracking-[0.16em] ${index === 1 ? 'text-[#86868b]' : 'text-white/36'}`}>{title}</p>
                  <p className={`text-[13px] leading-relaxed ${index === 1 ? 'text-[#424245]' : 'text-white/58'}`}>{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-20 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/36">O que entregamos</p>
              <h2 className="text-[38px] font-light leading-tight sm:text-[56px]">Ativos de alto valor para captar, explicar e converter.</h2>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/56">A Publicity organiza a jornada inteira: promessa, página, proposta, criativo, abordagem, lista e follow-up. Cada peça existe para reduzir ruído e aumentar confiança.</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {deliverables.map((item, index) => (
                <div key={item} className={`flex items-center gap-3 rounded-[22px] border p-4 text-[13px] font-semibold ${index === 0 ? 'border-white bg-white text-[#050505]' : 'border-white/10 bg-white/[0.055] text-white/68'}`}>
                  <BadgeCheck size={15} className="shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section id="captura" className="mt-20 grid gap-4 rounded-[42px] bg-white p-5 text-[#050505] shadow-[0_38px_130px_rgba(255,255,255,0.10)] lg:grid-cols-[0.82fr_1.18fr]">
            <div className="rounded-[34px] bg-[#050505] p-7 text-white">
              <Zap size={22} className="mb-12 text-white/72" />
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Diagnóstico estratégico</p>
              <h2 className="text-[38px] font-extralight leading-tight sm:text-[52px]">Em poucos minutos, entendemos onde sua comunicação precisa ficar mais forte.</h2>
              <p className="mt-6 text-[14px] leading-relaxed text-white/62">Você manda o contexto. A Longecta devolve direção: qual público priorizar, qual ativo construir primeiro e qual mensagem aumenta confiança.</p>
            </div>
            <div className="grid gap-3 p-1 sm:p-3">
              {[
                ['1', 'Qual é o projeto?', 'Curso, congresso, sociedade, palestra, programa científico ou frente institucional.'],
                ['2', 'Quem precisa confiar?', 'Médicos, patrocinadores, inscritos, sociedades, parceiros ou lideranças científicas.'],
                ['3', 'O que precisa acontecer?', 'Inscrição, patrocínio, convite, reunião, recorrência, reputação ou lançamento.'],
              ].map(([number, title, body]) => (
                <div key={title} className="grid gap-4 rounded-[26px] border border-black/[0.06] bg-[#f5f5f7] p-5 sm:grid-cols-[46px_1fr]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#050505] text-[12px] font-bold text-white">{number}</span>
                  <div>
                    <h3 className="text-[24px] font-light leading-tight">{title}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-[#6e6e73]">{body}</p>
                  </div>
                </div>
              ))}
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <a href={publicityMailto('Quero um diagnóstico estratégico Longecta Publicity')} className="button-nowrap inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#050505] px-7 py-4 text-[13px] font-semibold text-white hover:bg-[#1d1d1f]">
                  Solicitar diagnóstico
                  <Mail size={15} />
                </a>
                <a href={executiveBriefHref} download className="button-nowrap inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-black/[0.08] bg-white px-7 py-4 text-[13px] font-semibold text-[#050505] hover:bg-[#050505] hover:text-white">
                  Baixar dossiê
                  <Download size={15} />
                </a>
              </div>
            </div>
          </section>

          <section className="longecta-premium-card mt-20 overflow-hidden rounded-[42px] border border-white/10 bg-white/[0.055] p-5 shadow-[0_40px_140px_rgba(0,0,0,0.38)] backdrop-blur-2xl lg:grid lg:grid-cols-[1fr_0.76fr] lg:gap-4">
            <div className="relative rounded-[34px] bg-white p-7 text-[#050505] sm:p-9">
              <Network size={22} className="mb-14" />
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Dossiê executivo</p>
              <h2 className="max-w-3xl text-[40px] font-light leading-tight sm:text-[62px]">Veja a Longecta em formato institucional.</h2>
              <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[#6e6e73]">
                Um material visual e direto para entender quem somos, como trabalhamos e como estruturamos autoridade, captação e comunicação para projetos médicos de alto valor.
              </p>
              <a href={executiveBriefHref} download className="button-nowrap mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#050505] px-7 py-4 text-[13px] font-semibold text-white hover:bg-[#1d1d1f]">
                Baixar Dossiê Executivo
                <Download size={15} />
              </a>
            </div>
            <div className="relative mt-4 min-h-[360px] overflow-hidden rounded-[34px] bg-black lg:mt-0">
              <img src="/assets/longecta-publicity-strategy-room.png" alt="Reunião estratégica de liderança médica e congresso" className="absolute inset-0 h-full w-full object-cover opacity-82 transition duration-700 hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.88))]" />
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">Longecta Publicity</p>
                <p className="mt-5 max-w-md text-[28px] font-extralight leading-tight text-white">Produto, consultoria, design e execução para líderes médicos.</p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default LongectaPublicityPage;
