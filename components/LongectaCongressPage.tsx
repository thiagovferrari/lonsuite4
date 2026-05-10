import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  ClipboardList,
  FileText,
  Flag,
  Landmark,
  Layers3,
  Mail,
  Megaphone,
  Mic2,
  Network,
  Presentation,
  Send,
  Sparkles,
  Store,
  Users,
} from 'lucide-react';

interface LongectaCongressPageProps {
  onBack: () => void;
  onMethod: () => void;
  onPlans: () => void;
  onSpeakerKit: () => void;
}

const congressMailto = (subject: string) =>
  `mailto:contato@lonsuite.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Olá, quero estruturar a comunicação do meu congresso médico com a Longecta. Pode me orientar nos próximos passos?')}`;

const pillars = [
  ['Posicionamento', 'Narrativa, conceito central, argumentos de inscrição, tom de voz e mensagens-chave para a edição.'],
  ['Sistema visual', 'Key visual, identidade, posts, e-mails, banners, templates, sinalização, crachás, certificados e palco.'],
  ['Campanha de inscrições', 'Lançamento, lotes, programação, palestrantes, cursos, local, networking, últimos dias e e-mails estratégicos.'],
  ['Valor científico', 'Programação transformada em trilhas, destaques, chamadas por público e conteúdos que mostram o valor real do congresso.'],
  ['Patrocinadores', 'Books, cotas, propostas, posts, visibilidade, ativações e relatórios que ajudam a vender e renovar patrocínio.'],
  ['Legado', 'Retrospectiva, clipping, banco de imagens, sponsor report, memória estratégica e base para a próxima edição.'],
];

const method = [
  ['Diagnóstico do evento', 'Entendemos público, especialidade, objetivos, diferenciais, cidade, formato, programação, histórico e metas comerciais.'],
  ['Posicionamento e narrativa', 'Definimos a mensagem central da edição, os pilares de comunicação e os argumentos que sustentam a participação.'],
  ['Identidade e sistema visual', 'Criamos um universo visual consistente para campanha digital, site, e-mails, materiais comerciais e peças presenciais.'],
  ['Campanha de divulgação', 'Desenvolvemos conteúdos para inscrições, lotes, programação, palestrantes, cursos, local e diferenciais.'],
  ['Valorização comercial', 'Criamos materiais para patrocinadores, books, propostas, posts, relatórios e entregas visuais de alto valor.'],
  ['Pós-evento e legado', 'Organizamos o que foi produzido para gerar retrospectiva, relatórios, clipping, memória e próxima edição.'],
];

const products = [
  ['Congress Brand System', 'Identidade estratégica e visual do congresso: conceito, narrativa, key visual, sistema de aplicações e peças-base.'],
  ['Congress Launch', 'Estratégia de lançamento, teaser, save the date, landing page, e-mail, posts iniciais e abertura de inscrições.'],
  ['Congress Communication 360', 'Planejamento e execução completa da campanha, social, e-mails, lotes, programação, palestrantes e patrocinadores.'],
  ['Scientific Program Marketing', 'Transformação da programação em trilhas, temas, chamadas, carrosséis, e-mails segmentados e argumentos de inscrição.'],
  ['Speaker Visibility Kit', 'Posts, mini bios, cards, legendas, LinkedIn e kit compartilhável para transformar palestrantes em ativos de divulgação.'],
  ['Sponsor Sales Kit', 'Book comercial, cotas, argumentos de valor, perfil de público, ativações, apresentação e materiais para venda.'],
  ['Lon Sponsor Report', 'Relatório visual premium para demonstrar entregas, presença de marca, ativações, números e oportunidades futuras.'],
  ['Lon Event Brain', 'Memória estratégica com programação, palestrantes, campanhas, materiais, patrocinadores, relatórios e histórico de edições.'],
];

const phases = [
  {
    icon: CalendarDays,
    title: 'Antes',
    body: 'Posicionamento, identidade, lançamento, site, posts, e-mails, campanhas de lote, programação e materiais comerciais.',
  },
  {
    icon: Presentation,
    title: 'Durante',
    body: 'Comunicação visual, telas, avisos, cobertura, posts, patrocinadores, sinalização e experiência do participante.',
  },
  {
    icon: FileText,
    title: 'Depois',
    body: 'Fotos, números, conteúdos e entregas viram relatórios, retrospectivas, materiais comerciais e base para a próxima edição.',
  },
];

const congressTimeline = [
  {
    moment: 'T-180 a T-120',
    title: 'Fundação da marca',
    body: 'Diagnóstico, posicionamento, promessa da edição, narrativa, identidade, key visual e arquitetura de mensagens.',
    output: 'Congresso com conceito claro',
  },
  {
    moment: 'T-120 a T-90',
    title: 'Lançamento',
    body: 'Teaser, save the date, landing page, campanha de abertura, e-mails, primeiros posts e argumento de inscrição.',
    output: 'Primeira percepção premium',
  },
  {
    moment: 'T-90 a T-45',
    title: 'Programação em valor',
    body: 'Trilhas científicas, mesas, cursos, palestrantes e temas são transformados em conteúdos que aumentam desejo de participação.',
    output: 'Ciência comunicada com clareza',
  },
  {
    moment: 'T-45 a T-7',
    title: 'Conversão e patrocinadores',
    body: 'Campanhas de lote, urgência, networking, materiais comerciais, visibilidade de patrocinadores e reforço de diferenciais.',
    output: 'Mais inscrição e valor comercial',
  },
  {
    moment: 'Evento',
    title: 'Experiência presencial',
    body: 'Telas, sinalização, avisos, posts em tempo real, bastidores, comunicação de auditório, estandes e ativações.',
    output: 'Evento percebido como marca',
  },
  {
    moment: 'D+1 a D+45',
    title: 'Legado e próxima edição',
    body: 'Retrospectiva, sponsor report, relatório para diretoria, banco de imagens, highlights e memória estratégica.',
    output: 'Fim que vira próxima campanha',
  },
];

const situations = [
  ['Programação excelente, pouco desejo', 'Transformamos temas, mesas e trilhas em conteúdos de valor.'],
  ['Inscrições abaixo do potencial', 'Criamos campanhas com narrativa, urgência, argumentos e constância.'],
  ['Patrocinador pouco valorizado', 'Criamos materiais, visibilidade e relatórios para aumentar percepção de entrega.'],
  ['Conteúdo perdido depois do evento', 'Organizamos pós-evento e criamos memória estratégica.'],
  ['Identidade fraca para uma edição forte', 'Criamos um sistema visual mais consistente, premium e aplicável.'],
  ['Palestrantes subutilizados', 'Criamos kits compartilháveis e estratégias de visibilidade.'],
];

const faqs = [
  ['Vocês fazem apenas artes?', 'Não. A Longecta estrutura estratégia, identidade, campanha, social media, e-mails, sites, materiais comerciais, peças presenciais, relatórios e pós-evento.'],
  ['Vocês ajudam com patrocinadores?', 'Sim. Criamos books comerciais, materiais de cotas, propostas visuais, posts, peças de visibilidade e relatórios de entrega.'],
  ['O que é Lon Event Brain?', 'É uma solução para organizar a memória estratégica do congresso: programação, palestrantes, campanhas, patrocinadores, materiais e histórico de edições.'],
  ['Como começamos?', 'Começamos com um diagnóstico do congresso para entender momento atual, público, programação, patrocinadores, histórico e necessidades de comunicação.'],
];

const LongectaCongressPage: React.FC<LongectaCongressPageProps> = ({ onBack, onMethod, onPlans, onSpeakerKit }) => {
  const [activeTimeline, setActiveTimeline] = useState(0);
  const activeMilestone = congressTimeline[activeTimeline];
  const progress = ((activeTimeline + 1) / congressTimeline.length) * 100;

  return (
    <div className="longecta-method-page plans-premium-page lon-soft-bg min-h-screen overflow-hidden text-[#111113]">
      <section className="relative px-5 pb-24 pt-6 sm:px-8 lg:px-12">
        <div className="absolute inset-x-0 top-0 h-[760px] bg-white/18" />
        <div className="plans-orbit absolute right-[8%] top-28 h-56 w-56 rounded-full border border-black/[0.05]" />

        <div className="relative mx-auto max-w-7xl">
          <nav className="lon-glass-panel sticky top-4 z-30 mb-14 flex items-center justify-between rounded-full px-3 py-2">
            <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold text-[#424245] hover:bg-[#1d1d1f] hover:text-white">
              <ArrowLeft size={14} />
              Método
            </button>
            <div className="hidden items-center gap-6 text-[11px] font-semibold text-[#6e6e73] md:flex">
              <a href="#pilares" className="hover:text-[#1d1d1f]">Pilares</a>
              <a href="#solucoes" className="hover:text-[#1d1d1f]">Soluções</a>
              <a href="#legado" className="hover:text-[#1d1d1f]">Legado</a>
              <a href="#faq" className="hover:text-[#1d1d1f]">FAQ</a>
            </div>
            <button onClick={onPlans} className="button-nowrap rounded-full bg-[#1d1d1f] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#2d2d2f]">
              Ver planos
            </button>
          </nav>

          <div className="grid min-h-[700px] items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="plans-story-enter">
              <p className="plans-eyebrow lon-glass-panel mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase text-[#6e6e73]">
                <Sparkles size={13} className="text-[#1d1d1f]" />
                Longecta Congress Intelligence
              </p>
              <h1 className="max-w-5xl text-[43px] leading-[0.98] sm:text-[66px] lg:text-[76px]">
                Transformamos congressos médicos em marcas científicas que vendem valor.
              </h1>
              <p className="mt-8 max-w-2xl text-[18px] font-light leading-relaxed text-[#6e6e73] sm:text-[21px]">
                Da identidade ao pós-evento, a Longecta cria a estrutura de comunicação para aumentar percepção de valor, fortalecer inscrições, valorizar patrocinadores e transformar a edição em legado para o próximo ano.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href={congressMailto('Quero estruturar meu congresso médico')} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-6 py-3 text-[13px] font-semibold text-white shadow-[0_18px_44px_rgba(0,0,0,0.18)] hover:bg-[#2d2d2f]">
                  Quero estruturar meu congresso
                  <ArrowRight size={15} />
                </a>
                <a href="#solucoes" className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.07] bg-white/72 px-6 py-3 text-[13px] font-semibold text-[#1d1d1f] shadow-sm backdrop-blur-xl hover:bg-white">
                  Conhecer soluções
                </a>
              </div>
            </div>

            <div className="relative min-h-[560px] sm:min-h-[680px]">
              <img src="/assets/longecta-congress-stage.png" alt="Palestrante médico em congresso científico premium" className="absolute right-0 top-0 h-[430px] w-[94%] rounded-[30px] object-cover object-center shadow-[0_38px_120px_rgba(0,0,0,0.16)] sm:h-[540px] sm:w-[88%] sm:rounded-[38px]" />
              <div className="absolute bottom-0 left-0 w-[90%] rounded-[28px] bg-[#111113] p-5 text-white shadow-[0_40px_130px_rgba(0,0,0,0.32)] sm:w-[76%] sm:rounded-[34px] sm:p-7">
                <p className="mb-7 text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">O que fazemos</p>
                <h2 className="text-[32px] font-extralight leading-tight sm:text-[38px]">Posicionamos, lançamos, vendemos, valorizamos patrocinadores e criamos memória para a próxima edição.</h2>
                <div className="mt-7 grid grid-cols-3 gap-2">
                  {['Inscrição', 'Patrocínio', 'Legado'].map(item => (
                    <span key={item} className="rounded-full bg-white/10 px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-white/70">{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <section className="mt-20 grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Dor do mercado</p>
              <h2 className="text-[40px] font-semibold leading-tight sm:text-[60px]">Muitos congressos têm relevância científica, mas comunicam abaixo do próprio valor.</h2>
            </div>
            <div className="rounded-[38px] border border-black/[0.055] bg-white/72 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.07)] backdrop-blur-xl sm:p-10">
              <p className="text-[24px] font-light leading-tight text-[#111113]">
                O problema não é a falta de conteúdo. O problema é a falta de estrutura para transformar programação, palestrantes, patrocinadores e experiência em percepção de valor.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {['Posts soltos', 'Programação presa em PDF', 'Palestrantes sem estratégia', 'Patrocinadores pouco valorizados', 'E-mails genéricos', 'Pós-evento mal aproveitado'].map(item => (
                  <div key={item} className="flex gap-3 rounded-[18px] bg-[#f5f5f7] p-4 text-[13px] font-semibold text-[#424245]">
                    <Check size={15} className="mt-0.5 shrink-0 text-[#111113]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-24 overflow-hidden rounded-[42px] border border-black/[0.055] bg-white/72 shadow-[0_30px_100px_rgba(0,0,0,0.08)] backdrop-blur-xl">
            <div className="mb-9 max-w-4xl">
              <div className="p-6 sm:p-8 lg:p-10">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Régua estratégica do congresso</p>
                <h2 className="text-[40px] font-semibold leading-tight sm:text-[58px]">Uma linha do tempo clara para transformar ciência em percepção, inscrição, patrocínio e legado.</h2>
                <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[#6e6e73]">
                  Clique nas etapas e veja como a comunicação evolui da fundação da marca ao pós-evento. Cada fase tem uma função comercial, científica e institucional.
                </p>
              </div>
            </div>

            <div className="grid border-t border-black/[0.055] lg:grid-cols-[0.92fr_1.08fr]">
              <div className="bg-[#111113] p-6 text-white sm:p-8 lg:p-10">
                <div className="mb-12 flex items-center justify-between gap-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/38">Etapa ativa</p>
                    <p className="mt-2 text-[13px] font-semibold text-white/62">{activeMilestone.moment}</p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/18 bg-white/10 text-[20px] font-extralight">
                    {activeTimeline + 1}
                  </div>
                </div>
                <h3 className="text-[42px] font-extralight leading-tight sm:text-[58px]">{activeMilestone.title}</h3>
                <p className="mt-6 max-w-xl text-[15px] font-light leading-relaxed text-white/62">{activeMilestone.body}</p>
                <div className="mt-10 rounded-[28px] border border-white/12 bg-white/[0.06] p-5">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/36">Resultado da fase</p>
                  <p className="text-[24px] font-extralight leading-tight">{activeMilestone.output}</p>
                </div>
              </div>

              <div className="p-6 sm:p-8 lg:p-10">
                <div className="mb-8">
                  <div className="h-2 overflow-hidden rounded-full bg-black/[0.06]">
                    <div className="h-full rounded-full bg-[#111113] transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="mt-3 flex justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-[#a1a1a6]">
                    <span>Marca</span>
                    <span>Campanha</span>
                    <span>Legado</span>
                  </div>
                </div>

                <div className="grid gap-3">
                  {congressTimeline.map((item, index) => {
                    const isActive = activeTimeline === index;
                    return (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => setActiveTimeline(index)}
                        className={`group grid w-full gap-4 rounded-[24px] border p-4 text-left transition-all sm:grid-cols-[56px_1fr_auto] ${isActive ? 'border-[#111113] bg-[#111113] text-white shadow-[0_22px_70px_rgba(0,0,0,0.16)]' : 'border-black/[0.055] bg-white/72 text-[#111113] hover:bg-white'}`}
                      >
                        <span className={`flex h-12 w-12 items-center justify-center rounded-full text-[12px] font-bold ${isActive ? 'bg-white text-[#111113]' : 'bg-[#f5f5f7] text-[#424245]'}`}>
                          {index + 1}
                        </span>
                        <span>
                          <span className={`block text-[10px] font-bold uppercase tracking-[0.16em] ${isActive ? 'text-white/42' : 'text-[#86868b]'}`}>{item.moment}</span>
                          <span className="mt-1 block text-[20px] font-light leading-tight">{item.title}</span>
                        </span>
                        <span className={`hidden self-center rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] sm:block ${isActive ? 'bg-white/10 text-white/70' : 'bg-[#f5f5f7] text-[#86868b]'}`}>
                          {item.output}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section id="pilares" className="mt-24 scroll-mt-24">
            <div className="mb-8 max-w-4xl">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Seis pilares</p>
              <h2 className="text-[40px] font-semibold leading-tight sm:text-[60px]">Comunicação de congresso precisa de método, não improviso.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {pillars.map(([title, body], index) => (
                <article key={title} className={`plans-card rounded-[30px] border p-6 shadow-[0_22px_70px_rgba(0,0,0,0.06)] ${index === 1 ? 'border-[#111113] bg-[#111113] text-white' : 'border-black/[0.055] bg-white/70 backdrop-blur-xl'}`}>
                  <Flag size={18} className={`mb-10 ${index === 1 ? 'text-white/70' : 'text-[#1d1d1f]/70'}`} />
                  <h3 className="text-[28px] font-light leading-tight">{title}</h3>
                  <p className={`mt-5 text-[13px] leading-relaxed ${index === 1 ? 'text-white/60' : 'text-[#6e6e73]'}`}>{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-24 overflow-hidden rounded-[42px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.10)]">
            <div className="grid lg:grid-cols-[1.04fr_0.96fr]">
              <div className="p-8 sm:p-12 lg:p-16">
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Método Longecta</p>
                <h2 className="text-[40px] font-semibold leading-tight sm:text-[58px]">Da estratégia da edição à memória do próximo ano.</h2>
                <div className="mt-8 grid gap-3">
                  {method.map(([title, body], index) => (
                    <div key={title} className="grid gap-4 rounded-[24px] border border-black/[0.055] bg-[#f7f7f8] p-5 sm:grid-cols-[42px_1fr]">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111113] text-[12px] font-bold text-white">{index + 1}</span>
                      <div>
                        <p className="text-[18px] font-semibold">{title}</p>
                        <p className="mt-2 text-[12px] leading-relaxed text-[#6e6e73]">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative min-h-[560px] overflow-hidden bg-[#050506]">
                <img src="/assets/longecta-congress-speaker.png" alt="Médica palestrante se preparando para apresentação em congresso" className="h-full w-full object-cover object-center grayscale opacity-95" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,19,0.05),rgba(17,17,19,0.74))]" />
                <div className="absolute bottom-8 left-8 right-8 rounded-[28px] border border-white/12 bg-black/35 p-6 text-white backdrop-blur-xl">
                  <Mic2 size={18} className="mb-8 text-white/58" />
                  <p className="text-[28px] font-extralight leading-tight">Cada palestrante confirmado pode se tornar um ativo de divulgação.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="solucoes" className="mt-24 scroll-mt-24">
            <div className="mb-8 max-w-4xl">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Soluções</p>
              <h2 className="text-[40px] font-semibold leading-tight sm:text-[60px]">Produtos Longecta para congressos médicos.</h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {products.map(([title, body], index) => {
                const icons = [Landmark, Megaphone, Network, ClipboardList, Mic2, Store, BadgeCheck, Layers3];
                const Icon = icons[index] || Award;
                const isSpeakerKit = title === 'Speaker Visibility Kit';
                if (isSpeakerKit) {
                  return (
                    <button
                      key={title}
                      type="button"
                      onClick={onSpeakerKit}
                      className="plans-card group rounded-[34px] border border-black/[0.055] bg-white/72 p-7 text-left text-[#111113] shadow-[0_24px_80px_rgba(0,0,0,0.07)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:bg-white hover:shadow-[0_30px_100px_rgba(0,0,0,0.10)]"
                    >
                      <Icon size={20} className="mb-10 text-[#1d1d1f]/70" />
                      <h3 className="text-[30px] font-light leading-tight">{title}</h3>
                      <p className="mt-4 text-[14px] leading-relaxed text-[#6e6e73]">{body}</p>
                      <span className="button-nowrap mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-[#111113] px-5 py-3 text-[12px] font-semibold text-white group-hover:bg-[#2d2d2f]">
                        Conhecer o kit
                        <ArrowRight size={14} />
                      </span>
                    </button>
                  );
                }
                return (
                  <article key={title} className={`plans-card rounded-[34px] border p-7 shadow-[0_24px_80px_rgba(0,0,0,0.07)] ${index === 2 ? 'border-[#111113] bg-[#111113] text-white' : 'border-black/[0.055] bg-white/72 text-[#111113] backdrop-blur-xl'}`}>
                    <Icon size={20} className={`mb-10 ${index === 2 ? 'text-white/70' : 'text-[#1d1d1f]/70'}`} />
                    <h3 className="text-[30px] font-light leading-tight">{title}</h3>
                    <p className={`mt-4 text-[14px] leading-relaxed ${index === 2 ? 'text-white/60' : 'text-[#6e6e73]'}`}>{body}</p>
                    <a href={congressMailto(`Quero conhecer ${title}`)} className={`button-nowrap mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[12px] font-semibold ${index === 2 ? 'bg-white text-[#111113] hover:bg-white/90' : 'bg-[#111113] text-white hover:bg-[#2d2d2f]'}`}>
                      Solicitar solução
                      <ArrowRight size={14} />
                    </a>
                  </article>
                );
              })}
            </div>
          </section>

          <section id="legado" className="mt-24 overflow-hidden rounded-[42px] bg-[#111113] text-white shadow-[0_38px_120px_rgba(0,0,0,0.25)]">
            <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative min-h-[520px] overflow-hidden bg-[#050506]">
                <img src="/assets/longecta-congress-expo.png" alt="Estandes e networking em congresso médico" className="h-full w-full object-cover object-center grayscale opacity-85" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,19,0.72),rgba(17,17,19,0.08))]" />
                <div className="absolute bottom-8 left-8 right-8 rounded-[28px] border border-white/12 bg-black/35 p-6 backdrop-blur-xl">
                  <Store size={18} className="mb-8 text-white/58" />
                  <p className="text-[28px] font-extralight leading-tight">O patrocinador não quer apenas aparecer. Ele quer enxergar valor.</p>
                </div>
              </div>
              <div className="p-8 sm:p-12 lg:p-16">
                <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/38">Antes, durante e depois</p>
                <h2 className="max-w-3xl text-[40px] font-extralight leading-tight sm:text-[62px]">Cada fase do congresso pode gerar valor.</h2>
                <div className="mt-9 grid gap-3">
                  {phases.map(({ icon: Icon, title, body }, index) => (
                    <div key={title} className={`rounded-[24px] border p-5 ${index === 0 ? 'border-white/24 bg-white text-[#111113]' : 'border-white/10 bg-white/[0.06] text-white'}`}>
                      <Icon size={18} className={`mb-7 ${index === 0 ? 'text-[#111113]' : 'text-white/70'}`} />
                      <p className="text-[18px] font-semibold">{title}</p>
                      <p className={`mt-3 text-[13px] leading-relaxed ${index === 0 ? 'text-[#6e6e73]' : 'text-white/56'}`}>{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-24">
            <div className="mb-8 max-w-4xl">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Situações que resolvemos</p>
              <h2 className="text-[40px] font-semibold leading-tight sm:text-[60px]">Seu congresso já tem valor. Agora ele precisa ser percebido.</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {situations.map(([title, body], index) => (
                <article key={title} className={`rounded-[28px] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.06)] ${index === 2 ? 'bg-[#111113] text-white' : 'bg-white/72 text-[#111113] backdrop-blur-xl'}`}>
                  <Users size={18} className={`mb-10 ${index === 2 ? 'text-white/60' : 'text-[#1d1d1f]/70'}`} />
                  <h3 className="text-[24px] font-light leading-tight">{title}</h3>
                  <p className={`mt-4 text-[13px] leading-relaxed ${index === 2 ? 'text-white/58' : 'text-[#6e6e73]'}`}>{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="faq" className="mt-24 scroll-mt-24 grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">FAQ</p>
              <h2 className="text-[40px] font-semibold leading-tight sm:text-[56px]">Dúvidas antes de estruturar a edição.</h2>
            </div>
            <div className="grid gap-3">
              {faqs.map(([question, answer]) => (
                <details key={question} className="group rounded-[26px] border border-black/[0.055] bg-white/72 p-5 shadow-sm backdrop-blur-xl">
                  <summary className="cursor-pointer list-none text-[17px] font-semibold tracking-tight text-[#1d1d1f]">
                    {question}
                    <span className="float-right text-[#a1a1a6] transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 text-[13px] leading-relaxed text-[#6e6e73]">{answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="relative mt-24 overflow-hidden rounded-[42px] bg-[#111113] px-7 py-16 text-center text-white shadow-[0_38px_130px_rgba(0,0,0,0.26)] sm:px-12 sm:py-20">
            <img src="/assets/longecta-congress-networking.png" alt="" className="absolute inset-0 h-full w-full object-cover object-center grayscale opacity-42" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,19,0.95),rgba(17,17,19,0.62),rgba(17,17,19,0.95))]" />
            <div className="relative z-10">
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/44">Marca científica</p>
              <h2 className="mx-auto max-w-4xl text-[42px] font-extralight leading-tight sm:text-[66px]">Seu congresso pode ser mais do que um evento. Pode ser uma marca científica.</h2>
              <p className="mx-auto mt-7 max-w-2xl text-[16px] font-light leading-relaxed text-white/62">
                A Longecta estrutura programação, palestrantes, patrocinadores, experiência e legado para que o valor do congresso seja visto, desejado e lembrado.
              </p>
              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <a href={congressMailto('Quero estruturar meu congresso com a Longecta')} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-[13px] font-semibold text-[#111113] hover:bg-white/90">
                  Quero estruturar meu congresso
                  <Send size={15} />
                </a>
                <button onClick={onMethod} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3 text-[13px] font-semibold text-white backdrop-blur hover:bg-white/16">
                  Voltar ao método Longecta
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

export default LongectaCongressPage;
