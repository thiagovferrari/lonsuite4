import React, { useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Brain,
  Crown,
  Layers3,
  Mail,
  Mic2,
  Network,
  Presentation,
  Send,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';

interface LongectaMindsPageProps {
  onBack: () => void;
  onCongress: () => void;
  onMethod: () => void;
  onPublicity: () => void;
}

const mindsMailto = (subject: string) =>
  `mailto:contato@lonsuite.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Olá, quero conversar com a Longecta sobre estratégia, inteligência artificial, produtos e posicionamento para meu congresso, curso ou projeto médico.')}`;

const markers = [
  ['Estratégia', 'Posicionamento, narrativa e arquitetura de valor para projetos médicos.'],
  ['Produto', 'Soluções digitais, IA aplicada e experiências desenhadas para uso real.'],
  ['Congresso', 'Comunicação científica estruturada para inscrição, palco, sponsor e legado.'],
  ['Autoridade', 'Transformação de conhecimento em percepção, confiança e oportunidade.'],
];

const operatingSystem = [
  {
    icon: Brain,
    title: 'Inteligência estratégica',
    body: 'Leitura do negócio médico, do público, do momento científico e da promessa que precisa ficar clara para o mercado.',
  },
  {
    icon: Layers3,
    title: 'Conhecimento de produto',
    body: 'Tradução de plataformas, serviços, IA e entregas em sistemas que parecem simples por fora e robustos por dentro.',
  },
  {
    icon: Presentation,
    title: 'Arquitetura de congresso',
    body: 'Programação, speakers, patrocinadores e experiência organizados como uma marca científica de alto valor.',
  },
  {
    icon: Network,
    title: 'Conexão entre frentes',
    body: 'Estratégia, design, tecnologia, comunicação e operação trabalhando como uma única tese de crescimento.',
  },
];

const congressAngles = [
  ['Antes do evento', 'Narrativa da edição, promessa, campanha, inscrição, programação e posicionamento dos speakers.'],
  ['Durante o evento', 'Percepção presencial, palco, materiais, cobertura, sponsor visibility e experiência de marca.'],
  ['Depois do evento', 'Relatórios, retrospectiva, memória estratégica, conteúdo reaproveitável e próxima edição.'],
];

const proofPoints = [
  ['IA aplicada', 'Soluções com inteligência para organizar acervo, acelerar curadoria e sustentar decisões.'],
  ['Design premium', 'Peças, páginas, decks e materiais que elevam a percepção sem parecer publicidade vazia.'],
  ['Copy estratégica', 'Mensagens que explicam valor científico, comercial e institucional com precisão.'],
  ['Sistema comercial', 'Estrutura para captar inscritos, patrocinadores, convites, leads e relacionamentos.'],
  ['Memória Longecta', 'Tudo que é produzido vira base para evolução, reuso e aprendizado do próximo ciclo.'],
  ['Direção executiva', 'Decisões com foco em posicionamento, clareza, elegância e resultado mensurável.'],
];

const LongectaMindsPage: React.FC<LongectaMindsPageProps> = ({ onBack, onCongress, onMethod, onPublicity }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <div className="longecta-method-page plans-premium-page lon-soft-bg min-h-screen overflow-hidden text-[#111113]">
      <section className="relative px-5 pb-20 pt-6 sm:px-8 lg:px-12">
        <div className="absolute inset-x-0 top-0 h-[760px] bg-white/34" />
        <div className="plans-orbit absolute right-[10%] top-24 h-52 w-52 rounded-full border border-black/[0.045]" />
        <div className="plans-orbit plans-orbit-slow absolute bottom-[34%] left-[7%] h-72 w-72 rounded-full border border-black/[0.035]" />

        <div className="relative mx-auto max-w-7xl">
          <nav className="lon-glass-panel sticky top-4 z-30 mb-12 flex items-center justify-between rounded-full px-3 py-2">
            <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold text-[#424245] hover:bg-[#1d1d1f] hover:text-white">
              <ArrowLeft size={14} />
              Voltar
            </button>
            <div className="hidden items-center gap-6 text-[11px] font-semibold text-[#6e6e73] md:flex">
              <a href="#mente" className="hover:text-[#1d1d1f]">Mente</a>
              <a href="#congressos" className="hover:text-[#1d1d1f]">Congressos</a>
              <a href="#sistema" className="hover:text-[#1d1d1f]">Sistema</a>
              <a href="#contato" className="hover:text-[#1d1d1f]">Contato</a>
            </div>
            <a href={mindsMailto('Quero conversar com a mente estratégica da Longecta')} className="button-nowrap rounded-full bg-[#1d1d1f] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#2d2d2f]">
              Conversar
            </a>
          </nav>

          <header className="relative grid min-h-[760px] items-center gap-8 lg:grid-cols-[0.86fr_1.14fr]">
            <div className="relative z-10 max-w-3xl pt-4">
              <p className="plans-eyebrow lon-glass-panel mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase text-[#6e6e73]">
                <Sparkles size={13} className="text-[#1d1d1f]" />
                Mentes por trás da Longecta
              </p>
              <h1 className="text-[46px] font-light leading-[0.98] tracking-[0] sm:text-[72px] lg:text-[88px]">
                Thiago Ferrari pensa a Longecta como estratégia, produto e inteligência aplicada.
              </h1>
              <p className="mt-8 max-w-2xl text-[18px] font-light leading-relaxed text-[#6e6e73] sm:text-[21px]">
                A mente por trás de soluções de IA, posicionamento e comunicação que transformam conhecimento médico em percepção de valor para congressos, cursos, sociedades, palestrantes e negócios científicos.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href={mindsMailto('Quero estruturar estratégia e IA com a Longecta')} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-6 py-3 text-[13px] font-semibold text-white shadow-[0_18px_44px_rgba(0,0,0,0.18)] hover:bg-[#2d2d2f]">
                  Solicitar direção estratégica
                  <Send size={15} />
                </a>
                <button onClick={onCongress} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.07] bg-white/72 px-6 py-3 text-[13px] font-semibold text-[#1d1d1f] shadow-sm backdrop-blur-xl hover:bg-white">
                  Ver Longecta Congressos
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            <div className="relative min-h-[620px] lg:min-h-[760px]">
              <div className="absolute right-[-8%] top-0 h-full w-[112%] overflow-hidden">
                <img
                  src="/assets/longecta-thiago-ferrari-portrait-bw.jpg"
                  alt="Retrato editorial em preto e branco de Thiago Ferrari"
                  className="h-full w-full object-cover object-[52%_28%] opacity-[0.92] mix-blend-multiply"
                  style={{
                    WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 19%, black 74%, transparent 100%)',
                    maskImage: 'linear-gradient(90deg, transparent 0%, black 19%, black 74%, transparent 100%)',
                  }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_30%,transparent_0%,transparent_38%,rgba(240,239,237,0.70)_72%,rgba(240,239,237,0.95)_100%)]" />
                <div className="absolute inset-y-0 left-0 w-[44%] bg-gradient-to-r from-[#f0efed] via-[#f0efed]/82 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-[#f0efed] to-transparent" />
              </div>
              <div className="absolute bottom-8 left-2 hidden w-[72%] grid-cols-4 gap-3 lg:grid">
                {markers.map(([title, body]) => (
                  <div key={title} className="lon-glass-panel-strong rounded-[22px] px-4 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">{title}</p>
                    <p className="mt-4 text-[13px] font-light leading-snug text-[#424245]">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </header>

          <section id="mente" className="mt-10 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">A função estratégica</p>
              <h2 className="text-[40px] font-semibold leading-tight sm:text-[60px]">Uma mente que conecta ciência, mercado, produto e percepção.</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {operatingSystem.map(({ icon: Icon, title, body }, index) => (
                <article key={title} className={`rounded-[30px] border p-6 shadow-[0_24px_80px_rgba(0,0,0,0.06)] ${index === 0 ? 'border-[#111113] bg-[#111113] text-white' : 'border-black/[0.055] bg-white/74 text-[#111113] backdrop-blur-xl'}`}>
                  <div className={`mb-12 flex h-12 w-12 items-center justify-center rounded-full ${index === 0 ? 'bg-white text-[#111113]' : 'bg-[#111113] text-white'}`}>
                    <Icon size={18} />
                  </div>
                  <h3 className="text-[28px] font-light leading-tight">{title}</h3>
                  <p className={`mt-5 text-[14px] font-light leading-relaxed ${index === 0 ? 'text-white/64' : 'text-[#6e6e73]'}`}>{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="congressos" className="mt-24 overflow-hidden rounded-[42px] bg-[#111113] text-white shadow-[0_42px_140px_rgba(0,0,0,0.28)]">
            <div className="grid min-h-[620px] lg:grid-cols-[1.04fr_0.96fr]">
              <div className="relative min-h-[440px] overflow-hidden">
                <img src="/assets/longecta-congress-stage.png" alt="Palco de congresso médico com estética premium" className="absolute inset-0 h-full w-full object-cover object-center grayscale opacity-72" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.22),rgba(0,0,0,0.90))]" />
                <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-10">
                  <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/38">Congress intelligence</p>
                  <h2 className="max-w-xl text-[38px] font-extralight leading-tight sm:text-[56px]">O congresso precisa parecer tão forte quanto a ciência que ele reúne.</h2>
                </div>
              </div>
              <div className="p-7 sm:p-10 lg:p-12">
                <div className="mb-12 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#111113]">
                  <Mic2 size={20} />
                </div>
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/38">Onde a mente aparece</p>
                <h3 className="text-[36px] font-light leading-tight sm:text-[50px]">Na escolha do argumento certo, da promessa certa e da estrutura que faz o valor ser percebido.</h3>
                <div className="mt-10 grid gap-3">
                  {congressAngles.map(([title, body]) => (
                    <div key={title} className="rounded-[24px] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl">
                      <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/48">{title}</p>
                      <p className="mt-3 text-[15px] font-light leading-relaxed text-white/68">{body}</p>
                    </div>
                  ))}
                </div>
                <button onClick={onCongress} className="button-nowrap mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-[#111113] hover:bg-white/90">
                  Conhecer a frente de congressos
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </section>

          <section id="sistema" className="mt-24 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[38px] border border-black/[0.055] bg-white/74 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.07)] backdrop-blur-xl sm:p-10">
              <div className="mb-14 flex h-12 w-12 items-center justify-center rounded-full bg-[#111113] text-white">
                <Crown size={18} />
              </div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Por trás das soluções</p>
              <h2 className="text-[38px] font-light leading-tight sm:text-[56px]">A Longecta não entrega apenas materiais. Ela constrói sistemas de autoridade.</h2>
              <p className="mt-6 text-[15px] font-light leading-relaxed text-[#6e6e73]">
                Thiago Ferrari atua na camada que define por que a solução existe, como ela deve ser percebida e quais ativos precisam nascer para gerar clareza, confiança e crescimento.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={onMethod} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-[#111113] px-6 py-3 text-[13px] font-semibold text-white hover:bg-[#2d2d2f]">
                  Ver método
                  <ArrowRight size={15} />
                </button>
                <button onClick={onPublicity} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.07] bg-white px-6 py-3 text-[13px] font-semibold text-[#111113] hover:bg-[#f5f5f7]">
                  Ver publicity
                </button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {proofPoints.map(([title, body], index) => (
                <article key={title} className={`rounded-[28px] border p-6 ${index === 0 || index === 5 ? 'border-[#111113] bg-[#111113] text-white' : 'border-black/[0.055] bg-white/72 text-[#111113] shadow-[0_22px_70px_rgba(0,0,0,0.055)] backdrop-blur-xl'}`}>
                  <div className={`mb-9 flex h-10 w-10 items-center justify-center rounded-full ${index === 0 || index === 5 ? 'bg-white text-[#111113]' : 'bg-[#111113] text-white'}`}>
                    {index % 2 === 0 ? <Zap size={16} /> : <BadgeCheck size={16} />}
                  </div>
                  <h3 className="text-[23px] font-light leading-tight">{title}</h3>
                  <p className={`mt-4 text-[13px] font-light leading-relaxed ${index === 0 || index === 5 ? 'text-white/62' : 'text-[#6e6e73]'}`}>{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="contato" className="mt-24 overflow-hidden rounded-[42px] border border-black/[0.055] bg-white/78 p-7 shadow-[0_30px_100px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-10 lg:p-12">
            <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Direção estratégica</p>
                <h2 className="max-w-4xl text-[42px] font-extralight leading-tight sm:text-[66px]">Quando a estratégia fica clara, o congresso, o produto e a IA começam a trabalhar juntos.</h2>
              </div>
              <div className="rounded-[32px] bg-[#111113] p-6 text-white sm:p-8">
                <div className="mb-12 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#111113]">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold">Thiago Ferrari</p>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/36">Estratégia Longecta</p>
                  </div>
                </div>
                <p className="text-[18px] font-light leading-relaxed text-white/68">
                  Para projetos que precisam sair do improviso e virar uma operação de percepção, produto e crescimento.
                </p>
                <a href={mindsMailto('Quero falar com a Longecta sobre estratégia')} className="button-nowrap mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-[#111113] hover:bg-white/90">
                  Iniciar conversa
                  <Mail size={15} />
                </a>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default LongectaMindsPage;
