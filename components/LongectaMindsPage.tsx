import React, { useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  Mail,
  Mic2,
  Presentation,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

interface LongectaMindsPageProps {
  onBack: () => void;
  onCongress: () => void;
  onMethod: () => void;
  onPublicity: () => void;
}

const speakersMailto = (subject: string) =>
  `mailto:contato@lonsuite.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Olá, quero estruturar uma solução Longecta para palestrantes médicos, com posicionamento, materiais e estratégia para congressos. Pode me orientar nos próximos passos?')}`;

const problems = [
  ['O nome é forte, mas a apresentação pública é fraca.', 'O speaker tem reputação científica, porém os ativos que chegam ao congresso não traduzem essa autoridade.'],
  ['O congresso divulga o palestrante sem direção.', 'Bio, foto, tema, legenda, chamada e roteiro aparecem como peças soltas, sem argumento de valor.'],
  ['O pós-palestra morre rápido.', 'O conteúdo gera atenção por algumas horas, mas não vira relacionamento, convite, lead, patrocínio ou próxima oportunidade.'],
];

const system = [
  {
    icon: Mic2,
    title: 'Speaker positioning',
    body: 'Definição da tese pública do palestrante: especialidade, território de autoridade, temas proprietários, tom e promessa científica.',
  },
  {
    icon: FileText,
    title: 'Perfil executivo',
    body: 'Bio curta, bio longa, headline, mini currículo, foto selecionada, temas de palestra e argumento para convites e programas científicos.',
  },
  {
    icon: Presentation,
    title: 'Kit de congresso',
    body: 'Cards, legendas, posts, story, LinkedIn, release, introdução de palco e materiais para o congresso divulgar sem improviso.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Ativos comerciais',
    body: 'Deck de speaker, proposta institucional, página pública e narrativa para cursos, patrocinadores, sociedades e novas agendas.',
  },
];

const flow = [
  ['01', 'Diagnóstico', 'Entendemos momento, especialidade, agenda, congressos, reputação atual e oportunidades reais.'],
  ['02', 'Território', 'Organizamos a tese do palestrante para que o mercado entenda por que ele deve estar no palco.'],
  ['03', 'Ativos', 'Criamos o sistema visual e editorial: perfil, kit, posts, deck, página e materiais de circulação.'],
  ['04', 'Distribuição', 'Preparamos o uso antes, durante e depois do congresso para transformar palco em relacionamento.'],
];

const deliverables = [
  'Speaker profile premium',
  'Bio curta e bio institucional',
  'Teses e temas de palestra',
  'Deck de apresentação do palestrante',
  'Kit de posts para congresso',
  'Legendas e textos de divulgação',
  'Página pública do speaker',
  'Roteiro de introdução no palco',
  'Materiais para sociedades médicas',
  'Follow-up pós-congresso',
  'Relatório de presença e alcance',
  'Base para novos convites',
];

const metrics = [
  ['Convite', 'clareza para ser lembrado'],
  ['Palco', 'percepção de autoridade'],
  ['Rede', 'conteúdo pronto para circular'],
  ['Depois', 'relacionamento que continua'],
];

const LongectaMindsPage: React.FC<LongectaMindsPageProps> = ({ onBack, onCongress, onMethod, onPublicity }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <div className="plans-premium-page min-h-screen overflow-hidden bg-[#f5f4f1] text-[#111113]">
      <section className="relative min-h-[92vh] px-5 pb-14 pt-6 text-white sm:px-8 lg:px-12">
        <img src="/assets/longecta-speakers-hero.jpg" alt="Palestrante médico em congresso científico" className="absolute inset-0 h-full w-full object-cover object-[58%_38%]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.86)_0%,rgba(0,0,0,0.68)_34%,rgba(0,0,0,0.22)_68%,rgba(0,0,0,0.38)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f5f4f1] to-transparent" />

        <div className="relative mx-auto flex min-h-[calc(92vh-5rem)] max-w-7xl flex-col">
          <nav className="sticky top-4 z-30 flex items-center justify-between rounded-full border border-white/12 bg-black/24 px-3 py-2 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
            <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold text-white/72 hover:bg-white hover:text-[#111113]">
              <ArrowLeft size={14} />
              Voltar
            </button>
            <div className="hidden items-center gap-6 text-[11px] font-semibold text-white/52 md:flex">
              <a href="#problema" className="hover:text-white">Problema</a>
              <a href="#solucao" className="hover:text-white">Solução</a>
              <a href="#entregas" className="hover:text-white">Entregas</a>
              <a href="#contato" className="hover:text-white">Contato</a>
            </div>
            <a href={speakersMailto('Quero estruturar meus palestrantes com a Longecta')} className="button-nowrap rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-[#111113] hover:bg-white/90">
              Diagnóstico
            </a>
          </nav>

          <div className="flex flex-1 items-center py-20">
            <div className="max-w-3xl">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/62 backdrop-blur-xl">
                <Sparkles size={13} />
                Longecta para palestrantes
              </p>
              <h1 className="text-[48px] font-light leading-[0.98] tracking-[0] sm:text-[76px] lg:text-[96px]">
                Transforme palestrantes médicos em marcas científicas de alto valor.
              </h1>
              <p className="mt-7 max-w-2xl text-[18px] font-light leading-relaxed text-white/74 sm:text-[21px]">
                A solução Longecta para posicionar, apresentar e ativar speakers antes, durante e depois do congresso. Menos improviso. Mais autoridade, circulação e oportunidade.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href={speakersMailto('Quero uma solução para palestrantes médicos')} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-[13px] font-semibold text-[#111113] shadow-[0_22px_70px_rgba(255,255,255,0.16)] hover:bg-white/90">
                  Estruturar palestrantes
                  <Send size={15} />
                </a>
                <button onClick={onCongress} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/[0.07] px-7 py-3 text-[13px] font-semibold text-white backdrop-blur-xl hover:bg-white hover:text-[#111113]">
                  Aplicar em congressos
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[8px] border border-white/10 bg-white/10 backdrop-blur-xl sm:grid-cols-4">
            {metrics.map(([title, body]) => (
              <div key={title} className="bg-black/22 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">{title}</p>
                <p className="mt-5 text-[17px] font-light leading-tight text-white">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="problema" className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#86868b]">O problema</p>
            <h2 className="text-[42px] font-light leading-tight sm:text-[64px]">Um grande speaker pode parecer menor quando sua presença é mal embalada.</h2>
          </div>
          <div className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
            {problems.map(([title, body]) => (
              <article key={title} className="grid gap-4 py-8 sm:grid-cols-[0.72fr_1.28fr]">
                <h3 className="text-[23px] font-light leading-tight">{title}</h3>
                <p className="text-[15px] font-light leading-relaxed text-[#6e6e73]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="solucao" className="bg-[#111113] px-5 py-24 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/36">A solução</p>
              <h2 className="text-[42px] font-light leading-tight sm:text-[64px]">Speaker Visibility System.</h2>
              <p className="mt-6 max-w-xl text-[16px] font-light leading-relaxed text-white/58">
                Um sistema estratégico para transformar cada palestrante em ativo de reputação, divulgação e relacionamento. O congresso ganha força. O speaker ganha clareza. A audiência entende valor antes da primeira fala.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button onClick={onMethod} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-[#111113] hover:bg-white/90">
                  Ver método Longecta
                  <ArrowRight size={15} />
                </button>
                <button onClick={onPublicity} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/[0.06] px-6 py-3 text-[13px] font-semibold text-white hover:bg-white hover:text-[#111113]">
                  Ver Publicity
                </button>
              </div>
            </div>
            <div className="grid gap-px overflow-hidden rounded-[8px] border border-white/10 bg-white/10 sm:grid-cols-2">
              {system.map(({ icon: Icon, title, body }) => (
                <article key={title} className="bg-[#151517] p-7">
                  <div className="mb-12 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#111113]">
                    <Icon size={17} />
                  </div>
                  <h3 className="text-[27px] font-light leading-tight">{title}</h3>
                  <p className="mt-5 text-[14px] font-light leading-relaxed text-white/58">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-2">
        <div className="relative min-h-[560px]">
          <img src="/assets/longecta-speakers-backstage.jpg" alt="Palestrante médico se preparando antes de entrar no palco" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.48))]" />
        </div>
        <div className="flex min-h-[560px] items-center bg-[#f5f4f1] px-5 py-20 sm:px-8 lg:px-16">
          <div className="max-w-xl">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#86868b]">Antes de subir ao palco</p>
            <h2 className="text-[40px] font-light leading-tight sm:text-[58px]">A autoridade começa antes da palestra.</h2>
            <p className="mt-6 text-[16px] font-light leading-relaxed text-[#6e6e73]">
              O público precisa saber quem fala, por que aquela pessoa importa e qual promessa científica será entregue. A Longecta organiza essa percepção em ativos prontos para circular.
            </p>
          </div>
        </div>
      </section>

      <section id="entregas" className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-4xl">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#86868b]">Entregas</p>
            <h2 className="text-[42px] font-light leading-tight sm:text-[64px]">Um pacote que o congresso consegue usar e o palestrante consegue sustentar.</h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-[8px] border border-black/[0.08] bg-black/[0.08] sm:grid-cols-2 lg:grid-cols-4">
            {deliverables.map(item => (
              <div key={item} className="flex min-h-[112px] items-end bg-white p-5">
                <p className="text-[15px] font-light leading-tight text-[#111113]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#111113] text-white">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex items-center px-5 py-24 sm:px-8 lg:px-12">
            <div className="max-w-2xl">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/36">Operação</p>
              <h2 className="text-[42px] font-light leading-tight sm:text-[64px]">Do diagnóstico ao follow-up, sem peça solta.</h2>
              <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
                {flow.map(([number, title, body]) => (
                  <article key={number} className="grid gap-4 py-7 sm:grid-cols-[72px_0.6fr_1fr]">
                    <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-white/32">{number}</p>
                    <h3 className="text-[22px] font-light leading-tight">{title}</h3>
                    <p className="text-[14px] font-light leading-relaxed text-white/58">{body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <div className="relative min-h-[620px]">
            <img src="/assets/longecta-speakers-audience.jpg" alt="Palestrante médico diante de audiência em congresso" className="absolute inset-0 h-full w-full object-cover object-center grayscale opacity-86" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#111113_0%,rgba(17,17,19,0.18)_46%,rgba(17,17,19,0.34)_100%)]" />
          </div>
        </div>
      </section>

      <section id="contato" className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl items-end gap-10 border-t border-black/[0.08] pt-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#86868b]">Próximo passo</p>
            <h2 className="max-w-4xl text-[44px] font-light leading-tight sm:text-[70px]">Se o congresso tem grandes nomes, esses nomes precisam trabalhar pela percepção da edição.</h2>
          </div>
          <div className="rounded-[8px] bg-[#111113] p-7 text-white sm:p-8">
            <div className="mb-12 grid grid-cols-3 gap-3">
              {[Users, CalendarDays, ShieldCheck].map((Icon, index) => (
                <div key={index} className="flex h-12 items-center justify-center rounded-full bg-white/[0.08] text-white">
                  <Icon size={17} />
                </div>
              ))}
            </div>
            <p className="text-[17px] font-light leading-relaxed text-white/68">
              A conversa começa pelo evento, pelo speaker ou pela sociedade médica. A partir disso, desenhamos a estrutura certa para posicionar, divulgar e reaproveitar autoridade.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <a href={speakersMailto('Quero estruturar uma solução para palestrantes')} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-[#111113] hover:bg-white/90">
                Solicitar diagnóstico
                <Mail size={15} />
              </a>
              <button onClick={onCongress} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/[0.06] px-6 py-3 text-[13px] font-semibold text-white hover:bg-white hover:text-[#111113]">
                Conectar com Congressos
                <BadgeCheck size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LongectaMindsPage;
