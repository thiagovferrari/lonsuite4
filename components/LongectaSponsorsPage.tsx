import React, { useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  FileText,
  Handshake,
  Mail,
  Megaphone,
  MonitorSmartphone,
  Presentation,
  Send,
  Sparkles,
  Users,
} from 'lucide-react';

interface LongectaSponsorsPageProps {
  onBack: () => void;
  onCongress: () => void;
  onMaterials: () => void;
  onSponsorVisibility: () => void;
}

const sponsorsMailto = (subject: string) =>
  `mailto:contato@lonsuite.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Olá, quero estruturar melhor a visibilidade dos patrocinadores no site, materiais e redes do meu congresso médico. Pode me orientar nos próximos passos?')}`;

const sponsorTruths = [
  ['Patrocinador não compra só espaço.', 'Ele compra associação com reputação científica, clareza de presença e prova de entrega.'],
  ['Palestrantes sustentam a atenção.', 'Os grandes nomes criam desejo, audiência e credibilidade. O patrocinador precisa aparecer dentro desse ecossistema, sem parecer intruso.'],
  ['O site é a primeira vitrine comercial.', 'Quando palestrantes, programação e patrocinadores aparecem com hierarquia, o congresso parece mais sólido e mais patrocinável.'],
];

const visibilitySystem = [
  {
    icon: MonitorSmartphone,
    title: 'Site do congresso',
    body: 'Blocos de patrocinadores com hierarquia visual, categorias, presença em páginas estratégicas e integração com programação e palestrantes.',
  },
  {
    icon: Presentation,
    title: 'Materiais do evento',
    body: 'Aplicações em programa, credenciais, telas, sinalização, painéis, decks e materiais comerciais com acabamento consistente.',
  },
  {
    icon: Megaphone,
    title: 'Redes sociais',
    body: 'Posts, carrosséis, stories e peças de agradecimento que valorizam a presença do patrocinador sem quebrar o tom científico.',
  },
  {
    icon: BarChart3,
    title: 'Prova de entrega',
    body: 'Organização visual do que foi entregue para facilitar relatório, renovação e percepção de parceria profissional.',
  },
];

const sponsorPlacements = [
  ['Home', 'presença sem poluir a promessa central do congresso'],
  ['Programação', 'associação por trilhas, sessões, temas e momentos de maior atenção'],
  ['Palestrantes', 'contexto ao redor dos nomes que movem desejo e autoridade'],
  ['Materiais físicos', 'logo e mensagem com hierarquia, não como rodapé esquecido'],
  ['Social', 'visibilidade com linguagem editorial, não apenas agradecimento genérico'],
  ['Pós-evento', 'relatório, clipping, retrospectiva e material de renovação'],
];

const LongectaSponsorsPage: React.FC<LongectaSponsorsPageProps> = ({ onBack, onCongress, onMaterials, onSponsorVisibility }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <div className="plans-premium-page min-h-screen overflow-hidden bg-[#f5f4f1] text-[#111113]">
      <section className="relative min-h-[92vh] px-5 pb-14 pt-6 text-white sm:px-8 lg:px-12">
        <img src="/assets/longecta-sponsors-hero.jpg" alt="Patrocinadores e médicos em área premium de congresso" className="absolute inset-0 h-full w-full object-cover object-[60%_42%]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.70)_38%,rgba(0,0,0,0.20)_72%,rgba(0,0,0,0.30)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f5f4f1] to-transparent" />

        <div className="relative mx-auto flex min-h-[calc(92vh-5rem)] max-w-7xl flex-col">
          <nav className="sticky top-4 z-30 flex items-center justify-between rounded-full border border-white/12 bg-black/24 px-3 py-2 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
            <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold text-white/72 hover:bg-white hover:text-[#111113]">
              <ArrowLeft size={14} />
              Voltar
            </button>
            <div className="hidden items-center gap-6 text-[11px] font-semibold text-white/52 md:flex">
              <a href="#tese" className="hover:text-white">Tese</a>
              <a href="#sistema" className="hover:text-white">Sistema</a>
              <a href="#mapa" className="hover:text-white">Mapa</a>
              <a href="#contato" className="hover:text-white">Contato</a>
            </div>
            <a href={sponsorsMailto('Quero melhorar a visibilidade dos patrocinadores')} className="button-nowrap rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-[#111113] hover:bg-white/90">
              Diagnóstico
            </a>
          </nav>

          <div className="flex flex-1 items-center py-20">
            <div className="max-w-3xl">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/62 backdrop-blur-xl">
                <Sparkles size={13} />
                Longecta para patrocinadores
              </p>
              <h1 className="text-[48px] font-light leading-[0.98] tracking-[0] sm:text-[76px] lg:text-[96px]">
                Patrocinador precisa ser percebido como parte do valor científico.
              </h1>
              <p className="mt-7 max-w-2xl text-[18px] font-light leading-relaxed text-white/74 sm:text-[21px]">
                A Longecta não vende cotas. Ela transforma a presença dos patrocinadores no site, nos materiais e nas redes do congresso em percepção profissional, elegante e mensurável.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button onClick={onSponsorVisibility} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-[13px] font-semibold text-[#111113] shadow-[0_22px_70px_rgba(255,255,255,0.16)] hover:bg-white/90">
                  Ver entregas de visibilidade
                  <ArrowRight size={15} />
                </button>
                <button onClick={onCongress} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/[0.07] px-7 py-3 text-[13px] font-semibold text-white backdrop-blur-xl hover:bg-white hover:text-[#111113]">
                  Aplicar no congresso
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[8px] border border-white/10 bg-white/10 backdrop-blur-xl sm:grid-cols-4">
            {[
              ['Site', 'patrocinador em posição clara'],
              ['Palestrante', 'autoridade que atrai atenção'],
              ['Material', 'presença consistente'],
              ['Relatório', 'prova para renovar'],
            ].map(([title, body]) => (
              <div key={title} className="bg-black/22 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">{title}</p>
                <p className="mt-5 text-[17px] font-light leading-tight text-white">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tese" className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#86868b]">A tese</p>
            <h2 className="text-[42px] font-light leading-tight sm:text-[64px]">O patrocinador sustenta o congresso. O palestrante sustenta a atenção.</h2>
          </div>
          <div className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
            {sponsorTruths.map(([title, body]) => (
              <article key={title} className="grid gap-4 py-8 sm:grid-cols-[0.72fr_1.28fr]">
                <h3 className="text-[23px] font-light leading-tight">{title}</h3>
                <p className="text-[15px] font-light leading-relaxed text-[#6e6e73]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="sistema" className="bg-[#111113] px-5 py-24 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/36">Sistema de percepção</p>
              <h2 className="text-[42px] font-light leading-tight sm:text-[64px]">Visibilidade sem poluir a experiência científica.</h2>
              <p className="mt-6 max-w-xl text-[16px] font-light leading-relaxed text-white/58">
                Em 2026, patrocínio bom não é só exposição. É contexto. A marca aparece melhor quando está conectada à programação, aos palestrantes, aos momentos de audiência e ao legado do evento.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button onClick={onMaterials} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-[#111113] hover:bg-white/90">
                  Ver materiais
                  <ArrowRight size={15} />
                </button>
                <button onClick={onSponsorVisibility} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/[0.06] px-6 py-3 text-[13px] font-semibold text-white hover:bg-white hover:text-[#111113]">
                  Ver kit de visibilidade
                </button>
              </div>
            </div>
            <div className="grid gap-px overflow-hidden rounded-[8px] border border-white/10 bg-white/10 sm:grid-cols-2">
              {visibilitySystem.map(({ icon: Icon, title, body }) => (
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

      <section id="mapa" className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-4xl">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#86868b]">Mapa de presença</p>
            <h2 className="text-[42px] font-light leading-tight sm:text-[64px]">Cada ponto de contato deve reforçar valor, não apenas preencher espaço.</h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-[8px] border border-black/[0.08] bg-black/[0.08] sm:grid-cols-2 lg:grid-cols-3">
            {sponsorPlacements.map(([title, body]) => (
              <article key={title} className="bg-white p-7">
                <div className="mb-12 flex h-11 w-11 items-center justify-center rounded-full bg-[#111113] text-white">
                  <Handshake size={17} />
                </div>
                <h3 className="text-[26px] font-light leading-tight">{title}</h3>
                <p className="mt-4 text-[14px] font-light leading-relaxed text-[#6e6e73]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="bg-[#111113] px-5 py-24 text-white sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/36">Próximo passo</p>
            <h2 className="max-w-4xl text-[44px] font-light leading-tight sm:text-[70px]">Patrocinador bem apresentado parece parceria. Patrocinador mal aplicado parece obrigação.</h2>
          </div>
          <div className="rounded-[8px] bg-white p-7 text-[#111113] sm:p-8">
            <div className="mb-12 flex h-12 w-12 items-center justify-center rounded-full bg-[#111113] text-white">
              <BadgeCheck size={18} />
            </div>
            <p className="text-[17px] font-light leading-relaxed text-[#6e6e73]">
              A Longecta organiza como os patrocinadores aparecem no ecossistema do congresso, sem assumir a captação comercial das cotas.
            </p>
            <a href={sponsorsMailto('Quero estruturar patrocinadores no congresso')} className="button-nowrap mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#111113] px-6 py-3 text-[13px] font-semibold text-white hover:bg-[#2d2d2f]">
              Solicitar diagnóstico
              <Mail size={15} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LongectaSponsorsPage;
