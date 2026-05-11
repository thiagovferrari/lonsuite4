import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarClock,
  Check,
  ClipboardList,
  Crown,
  FileText,
  Mail,
  Megaphone,
  Mic2,
  Send,
  Sparkles,
  Stethoscope,
  Target,
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
  `mailto:contato@lonsuite.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body || 'Olá, quero organizar minha publicidade, design e marketing médico com a Longecta. Quero entender o melhor caminho para meu contexto.')}`;

const segments = [
  {
    icon: Stethoscope,
    title: 'Médico especialista',
    line: 'Sua autoridade existe. Sua comunicação precisa parar de parecer improvisada.',
    bullets: ['Posicionamento pessoal', 'Conteúdo com origem real', 'Aulas, cases e presença'],
  },
  {
    icon: Building2,
    title: 'Clínica médica',
    line: 'A clínica precisa parecer tão forte quanto a entrega que faz todos os dias.',
    bullets: ['Campanhas por serviço', 'Design institucional', 'Materiais para equipe e paciente'],
  },
  {
    icon: Mic2,
    title: 'Palestrante',
    line: 'Convite, aula e congresso não são agenda. São ativos de reputação.',
    bullets: ['Speaker kit', 'LinkedIn e Instagram', 'Narrativa de prestígio'],
  },
  {
    icon: Users,
    title: 'Congresso médico',
    line: 'Evento científico forte não pode ser vendido como arte solta e post genérico.',
    bullets: ['Marca da edição', 'Inscrições e patrocinadores', 'Legado pós-evento'],
  },
];

const system = [
  ['Diagnóstico', 'Entendemos onde sua comunicação perde valor.'],
  ['Estratégia', 'Definimos promessa, público, mensagem e prioridade.'],
  ['Produção', 'Executamos copy, design, campanha, materiais e narrativa.'],
  ['Memória', 'Tudo volta para uma base que acelera o próximo ciclo.'],
];

const deliverables = [
  'Posicionamento médico',
  'Campanhas para clínica',
  'Social premium',
  'LinkedIn médico',
  'Apresentações e aulas',
  'Speaker Visibility Kit',
  'Landing pages',
  'Materiais para congressos',
  'Sponsor report',
  'Acervo estratégico',
];

const LongectaPublicityPage: React.FC<LongectaPublicityPageProps> = ({ onBack, onProgress, onMethod, onCongress }) => {
  return (
    <div className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <section className="relative px-5 pb-20 pt-6 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_10%,rgba(255,255,255,0.12),transparent_31%),linear-gradient(180deg,#090909,#050505_46%,#000)]" />
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

          <header className="grid min-h-[760px] items-center gap-10 lg:grid-cols-[0.88fr_1.12fr]">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/58 backdrop-blur-xl">
                <Sparkles size={13} className="text-white" />
                Longecta Publicity
              </p>
              <h1 className="max-w-5xl text-[44px] font-light leading-[0.96] tracking-[-0.01em] sm:text-[72px] lg:text-[86px]">
                Marketing médico não pode parecer amador.
              </h1>
              <p className="mt-8 max-w-2xl text-[18px] font-light leading-relaxed text-white/62 sm:text-[21px]">
                A Longecta organiza publicidade, design, conteúdo e estratégia para médicos, clínicas, palestrantes e congressos que precisam parecer tão fortes quanto realmente são.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href={publicityMailto('Quero organizar meu marketing médico com a Longecta')} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-[13px] font-semibold text-[#050505] shadow-[0_22px_70px_rgba(255,255,255,0.18)] transition hover:-translate-y-0.5 hover:bg-white/90">
                  Quero meu diagnóstico
                  <Send size={15} />
                </a>
                <button onClick={onProgress} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/[0.07] px-7 py-3 text-[13px] font-semibold text-white backdrop-blur-xl transition hover:bg-white hover:text-[#050505]">
                  Ver processo
                  <ArrowRight size={15} />
                </button>
              </div>

              <div className="mt-10 grid max-w-2xl gap-2 sm:grid-cols-3">
                {[
                  ['Menos ruído', 'operação clara'],
                  ['Mais valor', 'percepção premium'],
                  ['Mais venda', 'lead qualificado'],
                ].map(([title, body]) => (
                  <div key={title} className="rounded-[22px] border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/38">{title}</p>
                    <p className="mt-5 text-[16px] font-light leading-tight text-white">{body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-4 rounded-[46px] bg-white/[0.08] blur-2xl transition duration-700 group-hover:bg-white/[0.13]" />
              <div className="relative overflow-hidden rounded-[42px] border border-white/12 bg-white/[0.06] p-3 shadow-[0_44px_150px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                <div className="relative min-h-[620px] overflow-hidden rounded-[34px] bg-black">
                  <img src="/assets/longecta-publicity-hero-black.png" alt="Médico em ambiente premium analisando estratégia de publicidade médica" className="absolute inset-0 h-full w-full object-cover object-center opacity-88 transition duration-700 group-hover:scale-[1.025]" />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.85),rgba(0,0,0,0.14),rgba(0,0,0,0.72))]" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/42">A promessa</p>
                    <h2 className="max-w-xl text-[36px] font-extralight leading-tight sm:text-[48px]">Tirar sua comunicação do improviso e colocá-la em uma operação de autoridade.</h2>
                  </div>
                  <div className="absolute right-5 top-5 hidden rounded-[24px] border border-white/12 bg-black/40 p-5 backdrop-blur-xl sm:block">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">Publicity Engine</p>
                    <p className="mt-6 max-w-[210px] text-[15px] font-light leading-relaxed text-white/72">Estratégia, design, campanha e memória em um único sistema.</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <section id="publico" className="mt-8 scroll-mt-24">
            <div className="mb-7 max-w-4xl">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/36">Para quem vendemos</p>
              <h2 className="text-[38px] font-light leading-tight sm:text-[58px]">Se sua reputação é alta, sua publicidade não pode parecer baixa.</h2>
            </div>
            <div className="grid gap-3 lg:grid-cols-4">
              {segments.map(({ icon: Icon, title, line, bullets }, index) => (
                <article key={title} className={`group rounded-[30px] border p-6 shadow-[0_24px_90px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 ${index === 0 ? 'border-white bg-white text-[#050505]' : 'border-white/10 bg-white/[0.055] text-white backdrop-blur-xl hover:bg-white/[0.09]'}`}>
                  <div className={`mb-10 flex h-12 w-12 items-center justify-center rounded-full ${index === 0 ? 'bg-[#050505] text-white' : 'bg-white text-[#050505]'}`}>
                    <Icon size={18} />
                  </div>
                  <h3 className="text-[27px] font-light leading-tight">{title}</h3>
                  <p className={`mt-4 text-[13px] leading-relaxed ${index === 0 ? 'text-[#424245]' : 'text-white/58'}`}>{line}</p>
                  <div className="mt-7 space-y-2">
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

          <section id="sistema" className="mt-20 grid gap-4 rounded-[42px] border border-white/10 bg-white/[0.055] p-5 shadow-[0_34px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl lg:grid-cols-[0.72fr_1.28fr]">
            <div className="rounded-[34px] bg-white p-7 text-[#050505]">
              <Crown size={22} className="mb-12" />
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">O conceito</p>
              <h2 className="text-[38px] font-light leading-tight sm:text-[52px]">Uma agência híbrida para médicos que não podem comunicar como todo mundo.</h2>
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
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/36">O que organizamos</p>
              <h2 className="text-[38px] font-light leading-tight sm:text-[56px]">Da autoridade individual ao congresso inteiro.</h2>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/52">A Publicity não é “post”. É a infraestrutura de comunicação para transformar reputação médica em presença, desejo, confiança e lead qualificado.</p>
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
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Lead de alta intenção</p>
              <h2 className="text-[38px] font-extralight leading-tight sm:text-[52px]">Vamos dizer com clareza o que sua comunicação precisa virar.</h2>
              <p className="mt-6 text-[14px] leading-relaxed text-white/58">Você manda o contexto. A Longecta devolve direção: onde está o problema, qual frente começar e como transformar reputação em operação.</p>
            </div>
            <div className="grid gap-3 p-1 sm:p-3">
              {[
                ['1', 'Quem é você?', 'Médico, clínica, palestrante ou congresso.'],
                ['2', 'O que está travando?', 'Design, conteúdo, posicionamento, campanha, patrocinador ou rotina.'],
                ['3', 'O que precisa acontecer?', 'Mais autoridade, mais leads, mais inscrições, mais percepção ou mais organização.'],
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
                <a href={publicityMailto('Quero meu diagnóstico Longecta Publicity')} className="button-nowrap inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#050505] px-7 py-4 text-[13px] font-semibold text-white hover:bg-[#1d1d1f]">
                  Solicitar diagnóstico
                  <Mail size={15} />
                </a>
                <button onClick={onCongress} className="button-nowrap inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-black/[0.08] bg-white px-7 py-4 text-[13px] font-semibold text-[#050505] hover:bg-[#050505] hover:text-white">
                  Sou congresso
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

export default LongectaPublicityPage;
