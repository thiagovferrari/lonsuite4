import React, { useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  FileText,
  Globe2,
  Mail,
  Megaphone,
  MonitorSmartphone,
  PanelTop,
  Send,
  Sparkles,
} from 'lucide-react';

interface LongectaSponsorVisibilityPageProps {
  onBack: () => void;
  onSponsors: () => void;
  onCongress: () => void;
  onMaterials: () => void;
}

const visibilityMailto = (subject: string) =>
  `mailto:contato@lonsuite.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Olá, quero organizar as entregas de visibilidade dos patrocinadores do meu congresso: site, materiais, redes e relatório. Pode me orientar nos próximos passos?')}`;

const deliverables = [
  'Mapa de visibilidade por cota',
  'Blocos de patrocinadores no site',
  'Aplicações no programa científico',
  'Cards e posts de sponsor visibility',
  'Peças de agradecimento institucional',
  'Inserção em telas e sinalização',
  'Materiais para estande e ativações',
  'Templates para redes sociais',
  'Páginas ou seções de parceiros',
  'Retrospectiva pós-evento',
  'Sponsor report visual',
  'Base para renovação de patrocínio',
];

const operatingLayers = [
  {
    icon: Globe2,
    title: 'Site',
    body: 'Patrocinadores com hierarquia por cota, presença contextual e conexão com programação, trilhas e experiência do congresso.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Redes sociais',
    body: 'Peças que dão visibilidade sem transformar o feed científico em vitrine comercial genérica.',
  },
  {
    icon: PanelTop,
    title: 'Materiais presenciais',
    body: 'Telas, sinalização, programa, crachá, balcão, totens e materiais físicos com presença limpa e premium.',
  },
  {
    icon: ClipboardList,
    title: 'Relatório',
    body: 'Organização visual do que foi entregue para que o patrocinador perceba valor e o congresso tenha argumento de renovação.',
  },
];

const process = [
  ['Inventário', 'Listamos cotas, contrapartidas, canais e momentos reais de visibilidade.'],
  ['Hierarquia', 'Definimos onde cada patrocinador aparece sem competir com a experiência científica.'],
  ['Produção', 'Criamos peças digitais e físicas com consistência visual e editorial.'],
  ['Comprovação', 'Estruturamos registros e materiais para pós-evento, relatório e próxima venda.'],
];

const LongectaSponsorVisibilityPage: React.FC<LongectaSponsorVisibilityPageProps> = ({ onBack, onSponsors, onCongress, onMaterials }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <div className="plans-premium-page min-h-screen overflow-hidden bg-[#f5f4f1] text-[#111113]">
      <section className="relative min-h-[92vh] px-5 pb-14 pt-6 text-white sm:px-8 lg:px-12">
        <img src="/assets/longecta-sponsors-materials.jpg" alt="Materiais premium de congresso com estratégia de patrocinadores" className="absolute inset-0 h-full w-full object-cover object-[54%_44%]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.68)_36%,rgba(0,0,0,0.24)_72%,rgba(0,0,0,0.40)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f5f4f1] to-transparent" />

        <div className="relative mx-auto flex min-h-[calc(92vh-5rem)] max-w-7xl flex-col">
          <nav className="sticky top-4 z-30 flex items-center justify-between rounded-full border border-white/12 bg-black/24 px-3 py-2 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
            <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold text-white/72 hover:bg-white hover:text-[#111113]">
              <ArrowLeft size={14} />
              Voltar
            </button>
            <div className="hidden items-center gap-6 text-[11px] font-semibold text-white/52 md:flex">
              <a href="#camadas" className="hover:text-white">Camadas</a>
              <a href="#entregas" className="hover:text-white">Entregas</a>
              <a href="#processo" className="hover:text-white">Processo</a>
              <a href="#contato" className="hover:text-white">Contato</a>
            </div>
            <a href={visibilityMailto('Quero organizar entregas de patrocinadores')} className="button-nowrap rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-[#111113] hover:bg-white/90">
              Diagnóstico
            </a>
          </nav>

          <div className="flex flex-1 items-center py-20">
            <div className="max-w-3xl">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/62 backdrop-blur-xl">
                <Sparkles size={13} />
                Sponsor Visibility Kit
              </p>
              <h1 className="text-[48px] font-light leading-[0.98] tracking-[0] sm:text-[76px] lg:text-[96px]">
                Entregas de patrocinador precisam parecer estratégia, não obrigação.
              </h1>
              <p className="mt-7 max-w-2xl text-[18px] font-light leading-relaxed text-white/74 sm:text-[21px]">
                Um kit para organizar presença de patrocinadores no site, nos materiais, nas redes e no pós-evento, preservando o tom científico e aumentando a percepção de entrega.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href={visibilityMailto('Quero um Sponsor Visibility Kit')} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-[13px] font-semibold text-[#111113] shadow-[0_22px_70px_rgba(255,255,255,0.16)] hover:bg-white/90">
                  Estruturar kit
                  <Send size={15} />
                </a>
                <button onClick={onSponsors} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/[0.07] px-7 py-3 text-[13px] font-semibold text-white backdrop-blur-xl hover:bg-white hover:text-[#111113]">
                  Ver tese de patrocinadores
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[8px] border border-white/10 bg-white/10 backdrop-blur-xl sm:grid-cols-4">
            {[
              ['Organizar', 'contrapartidas por cota'],
              ['Produzir', 'peças digitais e físicas'],
              ['Publicar', 'site e redes com hierarquia'],
              ['Provar', 'relatório para renovação'],
            ].map(([title, body]) => (
              <div key={title} className="bg-black/22 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">{title}</p>
                <p className="mt-5 text-[17px] font-light leading-tight text-white">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="camadas" className="bg-[#111113] px-5 py-24 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/36">Camadas de entrega</p>
              <h2 className="text-[42px] font-light leading-tight sm:text-[64px]">Do site ao relatório, tudo precisa contar a mesma história.</h2>
              <p className="mt-6 max-w-xl text-[16px] font-light leading-relaxed text-white/58">
                A Longecta cuida da apresentação e da materialização dos patrocinadores dentro da comunicação do congresso. A captação continua sendo do organizador; nossa frente é percepção, consistência e entrega visual.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button onClick={onMaterials} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-[#111113] hover:bg-white/90">
                  Ver materiais
                  <ArrowRight size={15} />
                </button>
                <button onClick={onCongress} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/[0.06] px-6 py-3 text-[13px] font-semibold text-white hover:bg-white hover:text-[#111113]">
                  Ver congressos
                </button>
              </div>
            </div>
            <div className="grid gap-px overflow-hidden rounded-[8px] border border-white/10 bg-white/10 sm:grid-cols-2">
              {operatingLayers.map(({ icon: Icon, title, body }) => (
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

      <section id="entregas" className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-4xl">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#86868b]">Entregáveis</p>
            <h2 className="text-[42px] font-light leading-tight sm:text-[64px]">O patrocinador deve conseguir ver onde apareceu, como apareceu e por que aquilo teve valor.</h2>
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

      <section id="processo" className="bg-[#111113] px-5 py-24 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/36">Processo</p>
            <h2 className="text-[42px] font-light leading-tight sm:text-[64px]">Visibilidade boa nasce antes do post.</h2>
          </div>
          <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
            {process.map(([title, body], index) => (
              <article key={title} className="grid gap-4 py-8 sm:grid-cols-[80px_0.62fr_1fr]">
                <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-white/32">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="text-[24px] font-light leading-tight">{title}</h3>
                <p className="text-[15px] font-light leading-relaxed text-white/58">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl items-end gap-10 border-t border-black/[0.08] pt-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#86868b]">Próximo passo</p>
            <h2 className="max-w-4xl text-[44px] font-light leading-tight sm:text-[70px]">Quando a entrega é bem apresentada, patrocínio deixa de ser custo e vira parceria renovável.</h2>
          </div>
          <div className="rounded-[8px] bg-[#111113] p-7 text-white sm:p-8">
            <div className="mb-12 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#111113]">
              <BadgeCheck size={18} />
            </div>
            <p className="text-[17px] font-light leading-relaxed text-white/68">
              Estruturamos a visibilidade que o congresso prometeu e a forma como essa entrega será percebida no site, nos materiais, nas redes e no pós-evento.
            </p>
            <a href={visibilityMailto('Quero organizar visibilidade de patrocinadores')} className="button-nowrap mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-[#111113] hover:bg-white/90">
              Solicitar diagnóstico
              <Mail size={15} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LongectaSponsorVisibilityPage;
