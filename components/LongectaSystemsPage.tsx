import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  CalendarClock,
  DatabaseZap,
  Download,
  Layers3,
  Mail,
  Route,
  Send,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';

interface LongectaSystemsPageProps {
  onBack: () => void;
  onPublicity: () => void;
  onMethod: () => void;
}

const systemsMailto = (subject: string, body?: string) =>
  `mailto:contato@lonsuite.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body || 'Olá, quero avaliar um sistema ou plataforma personalizada para meu congresso, curso médico, sociedade médica ou operação de educação científica. Gostaria de um diagnóstico da Longecta Systems.')}`;

const executiveBriefHref = '/assets/longecta-publicity-dossie-executivo.pdf';

const audiences = [
  {
    icon: CalendarClock,
    title: 'Congressos médicos',
    text: 'Inscrição, agenda, speakers, patrocinadores, certificados, landing pages, comunicação e dados da edição em uma operação mais inteligente.',
  },
  {
    icon: BrainCircuit,
    title: 'Cursos e comunidades',
    text: 'Plataformas para turmas, trilhas, materiais, aulas, membros, pagamentos, relacionamento e acompanhamento da jornada educacional.',
  },
  {
    icon: ShieldCheck,
    title: 'Sociedades médicas',
    text: 'Portais institucionais, área de membros, acervo científico, comunicação oficial, eventos e fluxos internos com governança.',
  },
  {
    icon: Layers3,
    title: 'Operações premium',
    text: 'Sistemas sob medida quando planilhas, formulários e ferramentas soltas começam a limitar a percepção e o crescimento.',
  },
];

const solutionModes = [
  ['Produto pronto', 'Adaptamos soluções e módulos já estruturados pela Longecta para colocar sua operação em movimento mais rápido.'],
  ['Sistema sob medida', 'Quando a necessidade é específica, desenhamos arquitetura, escopo, orçamento, desenvolvimento e evolução por fases.'],
  ['Integrações', 'Conectamos formulários, pagamentos, CRM, e-mail, WhatsApp, dashboards, automações e dados de relacionamento.'],
  ['IA aplicada', 'Usamos IA para busca, organização, atendimento, recomendação, análise, conteúdo e produtividade com revisão humana.'],
];

const process = [
  ['01', 'Diagnóstico', 'Entendemos operação, público, restrições, dados, equipe, ferramentas atuais e objetivo de negócio.'],
  ['02', 'Arquitetura', 'Definimos módulos, integrações, nível de personalização, riscos, prioridade e caminho de implantação.'],
  ['03', 'Protótipo', 'Transformamos a ideia em fluxo visual para validar experiência, telas, linguagem e lógica antes de desenvolver.'],
  ['04', 'Desenvolvimento', 'Construímos a plataforma com interface premium, segurança, escalabilidade e integração com a rotina real.'],
  ['05', 'Implantação', 'Apoiamos testes, ajustes, treinamento, operação inicial e evolução do sistema a partir do uso.'],
];

const deliverables = [
  'Portal de congresso',
  'Área de membros',
  'Plataforma de cursos',
  'CRM médico',
  'Dashboard executivo',
  'Inscrição e check-in',
  'Gestão de patrocinadores',
  'Certificados e materiais',
  'IA de atendimento',
  'Integrações e automações',
  'Acervo científico',
  'Relatórios da edição',
];

const LongectaSystemsPage: React.FC<LongectaSystemsPageProps> = ({ onBack, onPublicity, onMethod }) => {
  return (
    <div className="longecta-black-orbit min-h-screen overflow-hidden bg-[#050505] text-white">
      <section className="relative px-5 pb-20 pt-6 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(255,255,255,0.11),transparent_31%),radial-gradient(circle_at_16%_18%,rgba(232,207,168,0.09),transparent_30%),linear-gradient(180deg,#090909,#050505_48%,#000)]" />
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
              <a href="#solucoes" className="hover:text-white">Soluções</a>
              <a href="#processo" className="hover:text-white">Processo</a>
              <a href="#diagnostico" className="hover:text-white">Diagnóstico</a>
            </div>
            <a href={systemsMailto('Quero um diagnóstico Longecta Systems')} className="button-nowrap rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-[#050505] hover:bg-white/90">
              Diagnóstico
            </a>
          </nav>

          <header className="grid min-h-[720px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/58 backdrop-blur-xl">
                <Sparkles size={13} />
                Longecta Systems
              </p>
              <h1 className="max-w-5xl text-[44px] font-light leading-[1] tracking-[0] sm:text-[70px] lg:text-[82px]">
                Sistemas sob medida para negócios médicos de alto valor.
              </h1>
              <p className="mt-7 max-w-2xl text-[18px] font-light leading-relaxed text-white/70 sm:text-[20px]">
                Criamos plataformas, integrações e produtos digitais para congressos, cursos, sociedades médicas e lideranças que precisam operar com mais inteligência, dados e percepção premium.
              </p>

              <div className="longecta-premium-card mt-6 max-w-2xl rounded-[26px] border border-white/12 bg-black/32 p-4 shadow-[0_24px_80px_rgba(255,255,255,0.05)] backdrop-blur-xl sm:p-5">
                <p className="text-[18px] font-extralight leading-snug text-white sm:text-[22px]">
                  Não começamos pelo código. Começamos pelo negócio: entendemos a operação, escolhemos o que já existe, desenhamos o que falta e desenvolvemos quando a solução precisa ser exclusiva.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={systemsMailto('Quero avaliar um sistema personalizado com a Longecta Systems')} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-[13px] font-semibold text-[#050505] shadow-[0_22px_70px_rgba(255,255,255,0.18)] transition hover:-translate-y-0.5 hover:bg-white/90">
                  Avaliar meu sistema
                  <Send size={15} />
                </a>
                <button onClick={onPublicity} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/[0.07] px-7 py-3 text-[13px] font-semibold text-white backdrop-blur-xl transition hover:bg-white hover:text-[#050505]">
                  Ver Publicity
                  <ArrowRight size={15} />
                </button>
              </div>

              <div className="mt-8 grid max-w-2xl gap-2 sm:grid-cols-3">
                {[
                  ['IA aplicada', 'produtividade real'],
                  ['Integração', 'menos fricção operacional'],
                  ['Dados', 'decisão mais clara'],
                ].map(([title, body]) => (
                  <div key={title} className="longecta-premium-card longecta-hover-lift rounded-[22px] border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/38">{title}</p>
                    <p className="mt-5 text-[16px] font-light leading-tight text-white">{body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="group relative">
              <div className="longecta-glass-beam absolute -left-12 top-10 h-[76%] w-[30%] rotate-[10deg] rounded-full" />
              <div className="longecta-glass-beam longecta-glass-beam-delayed absolute right-0 top-0 h-[56%] w-[22%] -rotate-[18deg] rounded-full" />
              <div className="absolute -inset-4 rounded-[46px] bg-white/[0.08] blur-2xl transition duration-700 group-hover:bg-white/[0.15]" />
              <div className="relative overflow-hidden rounded-[42px] border border-white/12 bg-white/[0.06] p-3 shadow-[0_44px_150px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                <div className="relative min-h-[590px] overflow-hidden rounded-[34px] bg-black">
                  <img src="/assets/longecta-systems-hero.png" alt="Reunião real de estratégia para sistemas e plataformas médicas" className="absolute inset-0 h-full w-full object-cover object-center opacity-94 transition duration-700 group-hover:scale-[1.035]" />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.74),rgba(0,0,0,0.02),rgba(0,0,0,0.48))]" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/42">Estratégia aplicada</p>
                    <h2 className="max-w-sm text-[28px] font-extralight leading-tight sm:text-[34px]">Tecnologia que nasce da rotina real.</h2>
                  </div>
                  <div className="absolute right-5 top-5 hidden rounded-[24px] border border-white/12 bg-black/40 p-5 backdrop-blur-xl sm:block">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">Longecta stack</p>
                    <p className="mt-6 max-w-[220px] text-[15px] font-light leading-relaxed text-white/72">Produto pronto, consultoria técnica e desenvolvimento personalizado.</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <section id="solucoes" className="mt-8 scroll-mt-24">
            <div className="mb-7 max-w-4xl">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/36">O que o público precisa</p>
              <h2 className="text-[38px] font-light leading-tight sm:text-[58px]">Sistemas para quem não pode depender de improviso operacional.</h2>
            </div>
            <div className="grid gap-3 lg:grid-cols-4">
              {audiences.map(({ icon: Icon, title, text }, index) => (
                <article key={title} className={`longecta-premium-card longecta-hover-lift rounded-[30px] border p-6 shadow-[0_24px_90px_rgba(0,0,0,0.25)] ${index === 0 ? 'border-white bg-white text-[#050505]' : 'border-white/10 bg-white/[0.055] text-white backdrop-blur-xl hover:bg-white/[0.09]'}`}>
                  <div className={`mb-10 flex h-12 w-12 items-center justify-center rounded-full ${index === 0 ? 'bg-[#050505] text-white' : 'bg-white text-[#050505]'}`}>
                    <Icon size={18} />
                  </div>
                  <h3 className="text-[24px] font-light leading-tight">{title}</h3>
                  <p className={`mt-4 text-[13px] leading-relaxed ${index === 0 ? 'text-[#424245]' : 'text-white/58'}`}>{text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-20 grid gap-4 lg:grid-cols-[0.96fr_1.04fr]">
            <div className="longecta-premium-card rounded-[38px] border border-white/10 bg-white/[0.055] p-6 shadow-[0_34px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8">
              <div className="mb-14 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#050505]">
                <Workflow size={18} />
              </div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/36">Como pensamos</p>
              <h2 className="text-[38px] font-light leading-tight sm:text-[54px]">Nem tudo precisa ser construído do zero. Mas o que é estratégico precisa ser seu.</h2>
              <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/58">
                O mercado caminha para IA, personalização, interoperabilidade e dados próprios. A Longecta traduz isso para a realidade médica: usamos o que já funciona, integramos o que precisa conversar e desenvolvemos o que diferencia sua operação.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {solutionModes.map(([title, body]) => (
                <article key={title} className="longecta-premium-card longecta-hover-lift rounded-[30px] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl">
                  <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.18em] text-white/36">{title}</p>
                  <p className="text-[15px] font-light leading-relaxed text-white/70">{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-20 grid gap-3 lg:grid-cols-[1.08fr_0.92fr]">
            {[
              {
                image: '/assets/longecta-systems-workshop.png',
                label: 'Consultoria e escopo',
                title: 'Escopo definido com pessoas reais, rotina real e prioridade real.',
              },
              {
                image: '/assets/longecta-systems-command.png',
                label: 'Operação e adoção',
                title: 'O sistema precisa ser entendido, usado e sustentado pela equipe.',
              },
            ].map(item => (
              <article key={item.title} className="longecta-hover-lift group overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.055] shadow-[0_28px_100px_rgba(0,0,0,0.30)] backdrop-blur-xl lg:min-h-[560px]">
                <div className="relative h-[430px] overflow-hidden lg:h-full">
                  <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover object-center opacity-92 transition duration-700 group-hover:scale-[1.035]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.84))]" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/42">{item.label}</p>
                    <h3 className="text-[28px] font-extralight leading-tight text-white sm:text-[38px]">{item.title}</h3>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section id="processo" className="mt-20 grid gap-4 rounded-[42px] border border-white/10 bg-white/[0.055] p-5 shadow-[0_34px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl lg:grid-cols-[0.68fr_1.32fr]">
            <div className="rounded-[34px] bg-white p-7 text-[#050505]">
              <Route size={22} className="mb-12" />
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Etapas</p>
              <h2 className="text-[38px] font-light leading-tight sm:text-[52px]">Da consultoria ao produto funcionando.</h2>
              <button onClick={onMethod} className="button-nowrap mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#050505] px-6 py-3 text-[13px] font-semibold text-white hover:bg-[#1d1d1f]">
                Ver método
                <ArrowRight size={15} />
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-5">
              {process.map(([number, title, body], index) => (
                <article key={title} className={`rounded-[26px] border border-white/10 p-5 ${index === 2 ? 'bg-white text-[#050505]' : 'bg-black/35 text-white'}`}>
                  <p className={`mb-8 text-[10px] font-bold uppercase tracking-[0.16em] ${index === 2 ? 'text-[#86868b]' : 'text-white/36'}`}>{number}</p>
                  <h3 className="text-[18px] font-light leading-tight">{title}</h3>
                  <p className={`mt-4 text-[12px] leading-relaxed ${index === 2 ? 'text-[#424245]' : 'text-white/58'}`}>{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-20 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/36">O que desenvolvemos</p>
              <h2 className="text-[38px] font-light leading-tight sm:text-[56px]">Produtos digitais que funcionam como plataforma, não como remendo operacional.</h2>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/56">
                Cada sistema nasce com uma pergunta: qual operação precisa ficar mais simples, mais confiável e mais valiosa? A resposta define se usamos produto pronto, integração ou desenvolvimento exclusivo.
              </p>
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

          <section id="diagnostico" className="mt-20 grid gap-4 rounded-[42px] bg-white p-5 text-[#050505] shadow-[0_38px_130px_rgba(255,255,255,0.10)] lg:grid-cols-[0.82fr_1.18fr]">
            <div className="rounded-[34px] bg-[#050505] p-7 text-white">
              <DatabaseZap size={22} className="mb-12 text-white/72" />
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Diagnóstico técnico</p>
              <h2 className="text-[38px] font-extralight leading-tight sm:text-[52px]">Antes de orçar, entendemos se você precisa de produto, integração ou desenvolvimento.</h2>
              <p className="mt-6 text-[14px] leading-relaxed text-white/62">
                A proposta nasce depois da clareza. Primeiro entendemos operação, usuários, dados, risco, prazo e impacto de negócio.
              </p>
            </div>
            <div className="grid gap-3 p-1 sm:p-3">
              {[
                ['1', 'Qual operação está travando?', 'Inscrição, curso, membros, evento, patrocinador, conteúdo, atendimento ou dados.'],
                ['2', 'Quais sistemas já existem?', 'Planilhas, site, CRM, pagamento, formulário, e-mail, WhatsApp, banco de dados ou nada organizado.'],
                ['3', 'Qual resultado precisa aparecer?', 'Menos retrabalho, mais inscrições, mais controle, melhor experiência ou nova fonte de receita.'],
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
                <a href={systemsMailto('Quero um diagnóstico Longecta Systems')} className="button-nowrap inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#050505] px-7 py-4 text-[13px] font-semibold text-white hover:bg-[#1d1d1f]">
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
        </div>
      </section>
    </div>
  );
};

export default LongectaSystemsPage;
