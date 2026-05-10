import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Brain,
  Check,
  ClipboardCheck,
  Layers3,
  Linkedin,
  Megaphone,
  Mic2,
  PenLine,
  Send,
  Share2,
  Sparkles,
  UploadCloud,
  Users,
} from 'lucide-react';

interface SpeakerVisibilityKitPageProps {
  onBack: () => void;
  onCongress: () => void;
  onMethod: () => void;
  onPlans: () => void;
}

const speakerMailto = (subject: string) =>
  `mailto:contato@lonsuite.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Olá, quero estruturar um Speaker Visibility Kit para meu congresso médico com a Longecta. Pode me orientar nos próximos passos?')}`;

const promiseCards = [
  ['Palestrante vira canal', 'Cada convidado recebe materiais prontos para divulgar sua participação com clareza, estética e autoridade.'],
  ['Congresso ganha alcance', 'A divulgação deixa de depender apenas dos canais oficiais e passa a circular pela rede dos próprios speakers.'],
  ['Valor científico aparece', 'Temas, cargos, mesas e trilhas são traduzidos em mensagens que fazem o público entender por que precisa estar presente.'],
];

const workflow = [
  {
    icon: UploadCloud,
    label: '1. Entrada',
    title: 'Coletamos o material certo',
    body: 'Palestrantes, temas, cargos, fotos, minicurrículos, horários e objetivos da campanha entram em uma estrutura organizada, sem depender de arquivos soltos no WhatsApp.',
  },
  {
    icon: Brain,
    label: '2. Inteligência',
    title: 'Transformamos dados em ângulos de comunicação',
    body: 'A plataforma e a curadoria Longecta identificam relevância científica, público de interesse, promessa de cada mesa e mensagens que aumentam desejo de participação.',
  },
  {
    icon: PenLine,
    label: '3. Copy + design',
    title: 'Criamos kits prontos para publicação',
    body: 'Cards, mini bios, chamadas, legendas, LinkedIn, stories, e-mails e peças compartilháveis são desenvolvidos com unidade visual e linguagem premium.',
  },
  {
    icon: ClipboardCheck,
    label: '4. Aprovação',
    title: 'Organizamos revisão sem atrito',
    body: 'O kit fica claro para aprovação da organização e, quando necessário, do palestrante. Menos ruído, menos retrabalho, mais velocidade de campanha.',
  },
  {
    icon: Share2,
    label: '5. Distribuição',
    title: 'Entregamos para circular',
    body: 'Cada speaker recebe o material certo, no formato certo, com textos de apoio para publicar sem ter que pensar do zero.',
  },
  {
    icon: Layers3,
    label: '6. Memória',
    title: 'Tudo volta para o Lon Event Brain',
    body: 'Os materiais, aprendizados e melhores mensagens alimentam a memória estratégica do congresso para próximas campanhas, relatórios e novas edições.',
  },
];

const deliverables = [
  ['Speaker card', 'Peça principal com nome, tema, cargo, data e identidade visual da edição.'],
  ['Mini bio estratégica', 'Biografia curta com autoridade, relevância e linguagem pronta para site, post e e-mail.'],
  ['Legenda para Instagram', 'Texto ajustado para publicação rápida pelo palestrante e pela organização.'],
  ['Texto para LinkedIn', 'Copy mais institucional para alcance profissional e científico.'],
  ['Stories e reposts', 'Formato vertical para circulação simples antes e durante o congresso.'],
  ['Quote cards', 'Frases, temas e provocações do speaker transformados em ativos de campanha.'],
  ['E-mail snippets', 'Blocos para newsletters segmentadas por trilha, tema ou perfil de público.'],
  ['Speaker hub', 'Organização dos materiais por palestrante para envio, aprovação e reutilização.'],
];

const timeline = [
  ['Confirmação', 'Speaker confirmado entra na régua de visibilidade.'],
  ['Contexto', 'Tema, público e relevância científica são estruturados.'],
  ['Kit', 'Peças e textos são criados com identidade da edição.'],
  ['Aprovação', 'Organização valida rapidamente o material.'],
  ['Publicação', 'Speaker e congresso divulgam com consistência.'],
  ['Amplificação', 'A campanha reaproveita falas, trilhas e temas.'],
  ['Legado', 'Tudo vira memória para pós-evento e próxima edição.'],
];

const examples = [
  {
    title: 'Antes',
    points: ['Palestrante recebe arte genérica.', 'Tema científico aparece sem contexto.', 'Organização precisa cobrar publicação.', 'Cada speaker divulga de um jeito.'],
  },
  {
    title: 'Depois',
    points: ['Kit individual pronto para postar.', 'Tema vira argumento de participação.', 'Palestrante entende seu papel na campanha.', 'Congresso ganha presença coordenada.'],
  },
];

const segments = [
  ['Congressos médicos', 'Para edições que precisam transformar corpo docente em força real de divulgação.'],
  ['Simpósios e jornadas', 'Para eventos com especialistas fortes, mas comunicação ainda dependente de posts avulsos.'],
  ['Sociedades e serviços', 'Para instituições que querem valorizar convidados, programação e reputação científica.'],
  ['Eventos patrocinados', 'Para agendas em que speaker, marca, trilha e patrocinador precisam aparecer com equilíbrio.'],
];

const SpeakerVisibilityKitPage: React.FC<SpeakerVisibilityKitPageProps> = ({ onBack, onCongress, onMethod, onPlans }) => {
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
              Congressos
            </button>
            <div className="hidden items-center gap-6 text-[11px] font-semibold text-[#6e6e73] md:flex">
              <a href="#funciona" className="hover:text-[#1d1d1f]">Como funciona</a>
              <a href="#entregas" className="hover:text-[#1d1d1f]">Entregas</a>
              <a href="#regua" className="hover:text-[#1d1d1f]">Régua</a>
              <a href="#aplicacao" className="hover:text-[#1d1d1f]">Aplicação</a>
            </div>
            <button onClick={onPlans} className="button-nowrap rounded-full bg-[#1d1d1f] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#2d2d2f]">
              Ver planos
            </button>
          </nav>

          <div className="grid min-h-[700px] items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="plans-story-enter">
              <p className="plans-eyebrow lon-glass-panel mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase text-[#6e6e73]">
                <Mic2 size={13} className="text-[#1d1d1f]" />
                Speaker Visibility Kit
              </p>
              <h1 className="max-w-5xl text-[43px] leading-[0.98] sm:text-[66px] lg:text-[76px]">
                Transforme palestrantes em ativos de divulgação do congresso.
              </h1>
              <p className="mt-8 max-w-2xl text-[18px] font-light leading-relaxed text-[#6e6e73] sm:text-[21px]">
                A Longecta cria uma estrutura híbrida de plataforma, serviço, inteligência e curadoria para fazer cada speaker divulgar sua participação com mais clareza, prestígio e impacto.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href={speakerMailto('Quero um Speaker Visibility Kit')} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-6 py-3 text-[13px] font-semibold text-white shadow-[0_18px_44px_rgba(0,0,0,0.18)] hover:bg-[#2d2d2f]">
                  Quero ativar meus speakers
                  <ArrowRight size={15} />
                </a>
                <a href="#funciona" className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.07] bg-white/72 px-6 py-3 text-[13px] font-semibold text-[#1d1d1f] shadow-sm backdrop-blur-xl hover:bg-white">
                  Ver método
                </a>
              </div>
            </div>

            <div className="relative min-h-[560px] sm:min-h-[680px]">
              <img src="/assets/longecta-congress-speaker.png" alt="Médica palestrante se preparando para apresentação em congresso" className="absolute right-0 top-0 h-[430px] w-[94%] rounded-[30px] object-cover object-center grayscale shadow-[0_38px_120px_rgba(0,0,0,0.16)] sm:h-[540px] sm:w-[88%] sm:rounded-[38px]" />
              <div className="absolute bottom-0 left-0 w-[90%] rounded-[28px] bg-[#111113] p-5 text-white shadow-[0_40px_130px_rgba(0,0,0,0.32)] sm:w-[76%] sm:rounded-[34px] sm:p-7">
                <p className="mb-7 text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">Promessa clara</p>
                <h2 className="text-[32px] font-extralight leading-tight sm:text-[38px]">O speaker deixa de ser apenas nome na grade e passa a ser parte ativa da campanha.</h2>
                <div className="mt-7 grid grid-cols-3 gap-2">
                  {['Prestígio', 'Alcance', 'Inscrição'].map(item => (
                    <span key={item} className="rounded-full bg-white/10 px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-white/70">{item}</span>
                  ))}
                </div>
              </div>
              <div className="plans-floating-metric lon-glass-panel-strong absolute bottom-[164px] right-0 hidden max-w-[158px] rounded-[20px] px-4 py-3 sm:block sm:right-6">
                <p className="text-[34px] font-extralight leading-none">1</p>
                <p className="mt-2 text-[10px] font-semibold leading-relaxed text-[#86868b]">kit por speaker, com narrativa e destino</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3 rounded-[30px] border border-white/78 bg-white/56 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.06)] backdrop-blur-xl md:grid-cols-3">
            {promiseCards.map(([title, body], index) => (
              <article key={title} className={`rounded-[22px] p-5 ${index === 1 ? 'bg-[#111113] text-white' : 'bg-white/70 text-[#111113]'}`}>
                <Megaphone size={18} className={`mb-8 ${index === 1 ? 'text-white/70' : 'text-[#1d1d1f]/70'}`} />
                <h2 className="text-[25px] font-light leading-tight">{title}</h2>
                <p className={`mt-4 text-[13px] leading-relaxed ${index === 1 ? 'text-white/58' : 'text-[#6e6e73]'}`}>{body}</p>
              </article>
            ))}
          </div>

          <section className="mt-12 grid gap-4 rounded-[36px] bg-[#111113] p-5 text-white shadow-[0_30px_100px_rgba(0,0,0,0.18)] sm:p-7 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-6">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white/38">O que resolve</p>
              <h2 className="text-[34px] font-extralight leading-tight sm:text-[46px]">O congresso para de pedir divulgação. Ele entrega divulgação pronta.</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              {[
                ['Sem kit', 'Speaker esquece, improvisa ou publica tarde demais.'],
                ['Com kit', 'Speaker recebe peça, texto e orientação de uso.'],
                ['Na campanha', 'A organização usa os speakers como rede coordenada.'],
                ['No legado', 'O histórico vira prova de prestígio e base futura.'],
              ].map(([title, body], index) => (
                <div key={title} className={`rounded-[24px] p-5 ${index === 1 ? 'bg-white text-[#111113]' : 'bg-white/[0.08] text-white'}`}>
                  <p className={`mb-8 text-[10px] font-bold uppercase tracking-[0.16em] ${index === 1 ? 'text-[#86868b]' : 'text-white/40'}`}>{title}</p>
                  <p className={`text-[13px] leading-relaxed ${index === 1 ? 'text-[#424245]' : 'text-white/58'}`}>{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="funciona" className="mt-24 scroll-mt-24">
            <div className="mb-8 max-w-4xl">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Como funciona</p>
              <h2 className="text-[40px] font-semibold leading-tight sm:text-[60px]">Plataforma para organizar. Serviço para executar. Curadoria para elevar.</h2>
              <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[#6e6e73]">
                O Speaker Visibility Kit não é uma pasta de artes. É uma operação de visibilidade para transformar o corpo docente em força de campanha.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {workflow.map(({ icon: Icon, label, title, body }, index) => (
                <article key={title} className={`plans-card rounded-[30px] border p-6 shadow-[0_22px_70px_rgba(0,0,0,0.06)] ${index === 2 ? 'border-[#111113] bg-[#111113] text-white' : 'border-black/[0.055] bg-white/70 backdrop-blur-xl'}`}>
                  <div className={`mb-10 flex h-12 w-12 items-center justify-center rounded-full ${index === 2 ? 'bg-white text-[#111113]' : 'bg-[#111113] text-white'}`}>
                    <Icon size={18} />
                  </div>
                  <p className={`mb-3 text-[10px] font-bold uppercase tracking-[0.18em] ${index === 2 ? 'text-white/42' : 'text-[#86868b]'}`}>{label}</p>
                  <h3 className="text-[28px] font-light leading-tight">{title}</h3>
                  <p className={`mt-5 text-[13px] leading-relaxed ${index === 2 ? 'text-white/60' : 'text-[#6e6e73]'}`}>{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="regua" className="mt-24 scroll-mt-24 overflow-hidden rounded-[42px] border border-black/[0.055] bg-white/72 shadow-[0_30px_100px_rgba(0,0,0,0.08)] backdrop-blur-xl">
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Régua de ativação</p>
              <h2 className="max-w-4xl text-[40px] font-semibold leading-tight sm:text-[58px]">Uma linha visual para o cliente entender o que acontece com cada palestrante.</h2>
            </div>
            <div className="border-t border-black/[0.055] p-6 sm:p-8 lg:p-10">
              <div className="grid gap-3 lg:grid-cols-7">
                {timeline.map(([title, body], index) => (
                  <div key={title} className="relative rounded-[26px] border border-black/[0.055] bg-white p-5 shadow-sm">
                    {index < timeline.length - 1 && <div className="absolute left-1/2 top-full hidden h-3 w-px bg-black/10 lg:left-full lg:top-1/2 lg:block lg:h-px lg:w-3" />}
                    <span className="mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-[#111113] text-[12px] font-bold text-white">{index + 1}</span>
                    <h3 className="text-[20px] font-light leading-tight">{title}</h3>
                    <p className="mt-3 text-[12px] leading-relaxed text-[#6e6e73]">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="entregas" className="mt-24 scroll-mt-24 grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Entregas</p>
              <h2 className="text-[40px] font-semibold leading-tight sm:text-[60px]">O que o Speaker Visibility Kit pode incluir.</h2>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#6e6e73]">
                A composição varia conforme tamanho do congresso, número de palestrantes, fase da campanha e profundidade de serviço contratada.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {deliverables.map(([title, body], index) => (
                <article key={title} className={`rounded-[24px] border p-5 ${index === 0 ? 'border-[#111113] bg-[#111113] text-white' : 'border-black/[0.055] bg-white/72 text-[#111113] backdrop-blur-xl'}`}>
                  <BadgeCheck size={18} className={`mb-8 ${index === 0 ? 'text-white/70' : 'text-[#1d1d1f]/70'}`} />
                  <h3 className="text-[22px] font-light leading-tight">{title}</h3>
                  <p className={`mt-3 text-[12px] leading-relaxed ${index === 0 ? 'text-white/58' : 'text-[#6e6e73]'}`}>{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-24 overflow-hidden rounded-[42px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.10)]">
            <div className="grid lg:grid-cols-[1.04fr_0.96fr]">
              <div className="p-8 sm:p-12 lg:p-16">
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Exemplo prático</p>
                <h2 className="text-[40px] font-semibold leading-tight sm:text-[58px]">O mesmo speaker, duas experiências completamente diferentes.</h2>
                <div className="mt-8 grid gap-3 md:grid-cols-2">
                  {examples.map((column, index) => (
                    <article key={column.title} className={`rounded-[30px] p-6 ${index === 1 ? 'bg-[#111113] text-white' : 'bg-[#f5f5f7] text-[#111113]'}`}>
                      <p className={`mb-7 text-[10px] font-bold uppercase tracking-[0.18em] ${index === 1 ? 'text-white/42' : 'text-[#86868b]'}`}>{column.title}</p>
                      <div className="space-y-3">
                        {column.points.map(point => (
                          <div key={point} className="flex gap-3 text-[13px] leading-relaxed">
                            <Check size={15} className={`mt-0.5 shrink-0 ${index === 1 ? 'text-white' : 'text-[#111113]'}`} />
                            <span className={index === 1 ? 'text-white/66' : 'text-[#424245]'}>{point}</span>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
              <div className="relative min-h-[560px] overflow-hidden bg-[#050506]">
                <img src="/assets/longecta-doctor-video.png" alt="Médico gravando conteúdo com smartphone" className="h-full w-full object-cover object-center grayscale opacity-95" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,19,0.05),rgba(17,17,19,0.74))]" />
                <div className="absolute bottom-8 left-8 right-8 rounded-[28px] border border-white/12 bg-black/35 p-6 text-white backdrop-blur-xl">
                  <Linkedin size={18} className="mb-8 text-white/58" />
                  <p className="text-[28px] font-extralight leading-tight">A melhor divulgação é aquela que o palestrante consegue publicar sem fricção.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="aplicacao" className="mt-24">
            <div className="mb-8 max-w-4xl">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Onde se aplica</p>
              <h2 className="text-[40px] font-semibold leading-tight sm:text-[60px]">Para eventos que têm bons nomes, mas ainda não usam esses nomes como estratégia.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {segments.map(([title, body], index) => (
                <article key={title} className={`rounded-[30px] border p-6 shadow-[0_22px_70px_rgba(0,0,0,0.06)] ${index === 0 ? 'border-[#111113] bg-[#111113] text-white' : 'border-black/[0.055] bg-white/70 text-[#111113] backdrop-blur-xl'}`}>
                  <Users size={18} className={`mb-10 ${index === 0 ? 'text-white/70' : 'text-[#1d1d1f]/70'}`} />
                  <h3 className="text-[25px] font-light leading-tight">{title}</h3>
                  <p className={`mt-4 text-[13px] leading-relaxed ${index === 0 ? 'text-white/58' : 'text-[#6e6e73]'}`}>{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="relative mt-24 overflow-hidden rounded-[42px] bg-[#111113] px-7 py-16 text-center text-white shadow-[0_38px_130px_rgba(0,0,0,0.26)] sm:px-12 sm:py-20">
            <img src="/assets/longecta-congress-networking.png" alt="" className="absolute inset-0 h-full w-full object-cover object-center grayscale opacity-42" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,19,0.95),rgba(17,17,19,0.62),rgba(17,17,19,0.95))]" />
            <div className="relative z-10">
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/44">Speaker como mídia científica</p>
              <h2 className="mx-auto max-w-4xl text-[42px] font-extralight leading-tight sm:text-[66px]">Se o seu congresso tem grandes nomes, esses nomes precisam trabalhar pela percepção da edição.</h2>
              <p className="mx-auto mt-7 max-w-2xl text-[16px] font-light leading-relaxed text-white/62">
                A Longecta estrutura os speakers como uma rede de autoridade: com materiais, narrativa, organização, aprovação e inteligência para transformar presença científica em alcance real.
              </p>
              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <a href={speakerMailto('Quero estruturar um Speaker Visibility Kit')} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-[13px] font-semibold text-[#111113] hover:bg-white/90">
                  Quero ativar meus speakers
                  <Send size={15} />
                </a>
                <button onClick={onCongress} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3 text-[13px] font-semibold text-white backdrop-blur hover:bg-white/16">
                  Voltar para Congressos
                  <ArrowRight size={15} />
                </button>
                <button onClick={onMethod} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3 text-[13px] font-semibold text-white backdrop-blur hover:bg-white/16">
                  Método Longecta
                  <Sparkles size={15} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default SpeakerVisibilityKitPage;
