import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Award, Brain, Building2, Check, Crown, Database, FileText, Fingerprint, Globe2, Images, KeyRound, LockKeyhole, Network, Presentation, Search, Server, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { signIn } from '../services/authService';
import type { AuthUser } from '../services/authService';

interface Props {
  onLogin: (user: AuthUser) => void;
}

interface PlansPageProps {
  onBack: () => void;
}

const planMailto = (plan: string) =>
  `mailto:contato@lonsuite.com.br?subject=${encodeURIComponent(`Assinar Lon Suite ${plan}`)}&body=${encodeURIComponent(`Olá, quero assinar o plano ${plan} da Lon Suite. Pode me orientar nos próximos passos?`)}`;

const PriceDisplay: React.FC<{ price: string; period: string; inverted?: boolean }> = ({ price, period, inverted = false }) => {
  if (price === 'Sob consulta') {
    return (
      <div>
        <span className="block text-[34px] font-semibold leading-none tracking-tight">Sob consulta</span>
        <span className={`mt-2 block text-[12px] font-semibold ${inverted ? 'text-white/55' : 'text-[#6e6e73]'}`}>{period}</span>
      </div>
    );
  }

  const [, amount = price] = price.split(' ');
  return (
    <div className="flex items-end gap-1.5">
      <span className={`pb-1.5 text-[18px] font-semibold tracking-tight ${inverted ? 'text-white/70' : 'text-[#424245]'}`}>R$</span>
      <span className="text-[50px] font-semibold leading-[0.9] tracking-tight">{amount}</span>
      <span className={`pb-2 text-[13px] font-semibold ${inverted ? 'text-white/55' : 'text-[#6e6e73]'}`}>{period}</span>
    </div>
  );
};

const PlansPage: React.FC<PlansPageProps> = ({ onBack }) => {
  const [activeDemo, setActiveDemo] = useState(0);

  const demoSteps = [
    { label: 'Material bruto', title: 'Tudo começa no acervo invisível.', body: 'A imagem que ficaria esquecida ganha entrada, dono, contexto e futuro.' },
    { label: 'Ativo científico', title: 'O arquivo passa a carregar significado.', body: 'Tags, resumo, evidência e relação clínica transformam memória solta em patrimônio.' },
    { label: 'Busca semântica', title: 'Encontre pelo que o caso significa.', body: 'Procure por técnica, achado, complicação, evolução ou intenção científica.' },
    { label: 'Case Builder', title: 'Do ativo ao case com fluidez.', body: 'Construa uma narrativa clínica com blocos, imagens, referências e apresentação.' },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveDemo(index => (index + 1) % demoSteps.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [demoSteps.length]);

  const plans = [
    {
      name: 'Free',
      icon: Sparkles,
      price: 'R$ 0',
      period: 'para experimentar',
      description: 'Para sentir a diferença entre guardar arquivos e começar um acervo científico.',
      storage: '100 MB',
      highlight: false,
      cta: 'Começar pelo Free',
      href: planMailto('Free'),
      features: ['Primeiros ativos científicos', 'Conta individual segura', 'Case Builder básico', 'Entrada sem fricção'],
    },
    {
      name: 'Personal',
      icon: Database,
      price: 'R$ 150',
      period: '/mês',
      description: 'Para o médico que quer encontrar, reaproveitar e apresentar seu próprio conhecimento.',
      storage: '5 GB',
      highlight: true,
      cta: 'Assinar Personal',
      href: planMailto('Personal'),
      features: ['5 GB para acervo pessoal', 'Busca semântica por significado', 'Case Builder para aulas e rounds', 'Ativos com valor profissional'],
    },
    {
      name: 'Premium',
      icon: Crown,
      price: 'R$ 299',
      period: '/mês',
      description: 'Para quem documenta com frequência e quer transformar acervo em produção científica.',
      storage: '20 GB',
      highlight: false,
      cta: 'Assinar Premium',
      href: planMailto('Premium'),
      features: ['20 GB para acervo avançado', 'Produção recorrente de cases', 'Apresentações com acabamento premium', 'Preparado para IA e automações'],
    },
    {
      name: 'Enterprise',
      icon: Building2,
      price: 'Sob consulta',
      period: 'para equipes',
      description: 'Para clínicas, serviços e grupos que querem transformar memória institucional em vantagem científica.',
      storage: '100 GB+',
      highlight: false,
      cta: 'Consultar equipe',
      href: planMailto('Enterprise'),
      features: ['Limites e usuários personalizados', 'Onboarding assistido', 'Governança para equipes', 'Plano de dados sob medida'],
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#f4f4f2] text-[#111113]">
      <section className="relative min-h-screen px-5 pb-20 pt-6 sm:px-8 lg:px-12">
        <div className="absolute inset-x-0 top-0 h-[720px] bg-white" />
        <div className="plans-orbit absolute right-[8%] top-28 h-56 w-56 rounded-full border border-black/[0.05]" />
        <div className="plans-orbit plans-orbit-slow absolute bottom-28 left-[7%] h-72 w-72 rounded-full border border-black/[0.04]" />

        <div className="relative mx-auto max-w-7xl">
          <nav className="mb-14 flex items-center justify-between rounded-full border border-black/[0.06] bg-white/85 px-3 py-2 shadow-[0_18px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl">
            <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold text-[#424245] hover:bg-[#1d1d1f] hover:text-white">
              <ArrowLeft size={14} />
              Login
            </button>
            <div className="hidden items-center gap-7 text-[11px] font-semibold text-[#6e6e73] md:flex">
              <a href="#ativos" className="transition-colors hover:text-[#1d1d1f]">Ativos</a>
              <a href="#busca" className="transition-colors hover:text-[#1d1d1f]">Busca semântica</a>
              <a href="#case-builder" className="transition-colors hover:text-[#1d1d1f]">Case Builder</a>
              <a href="#planos" className="transition-colors hover:text-[#1d1d1f]">Planos</a>
            </div>
            <a href="#planos" className="button-nowrap rounded-full bg-[#1d1d1f] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#2d2d2f]">
              Ver planos
            </a>
          </nav>

          <div className="grid min-h-[640px] items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="plans-story-enter">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6e6e73] shadow-[0_12px_34px_rgba(0,0,0,0.05)]">
                <Award size={13} className="text-[#1d1d1f]" />
                Lon Suite Pricing
              </p>
              <h1 className="max-w-4xl text-[48px] font-extralight leading-[0.98] tracking-tight text-[#111113] sm:text-[76px] lg:text-[78px] xl:text-[92px]">
                O acervo científico que trabalha por você.
              </h1>
              <p className="mt-8 max-w-2xl text-[18px] font-light leading-relaxed text-[#6e6e73] sm:text-[21px]">
                A Lon Suite transforma imagens, fotos e documentos em ativos científicos pesquisáveis. O que antes era arquivo esquecido passa a gerar aula, case, apresentação, memória e autoridade.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href="#planos" className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-6 py-3 text-[13px] font-semibold text-white shadow-[0_18px_44px_rgba(0,0,0,0.18)] hover:bg-[#2d2d2f]">
                  Ver planos
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>

            <div className="relative min-h-[680px]">
              <img
                src="/assets/lon-suite-physician-editorial.jpg"
                alt="Médico pesquisador representando o valor científico da Lon Suite"
                className="absolute right-0 top-0 h-[560px] w-[78%] rounded-[34px] object-cover object-center shadow-[0_36px_120px_rgba(0,0,0,0.16)]"
              />
              <div className="plans-showcase absolute bottom-0 left-0 w-[74%] rounded-[34px] bg-[#101114] p-6 text-white shadow-[0_40px_130px_rgba(0,0,0,0.32)]">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">Demonstração viva</p>
                  <Brain size={17} className="text-white/64" />
                </div>
                <div key={activeDemo} className="plans-demo-enter">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/38">{demoSteps[activeDemo].label}</p>
                  <h2 className="mt-3 text-[34px] font-extralight leading-tight tracking-tight">{demoSteps[activeDemo].title}</h2>
                  <p className="mt-4 text-[13px] leading-relaxed text-white/55">{demoSteps[activeDemo].body}</p>
                </div>
                <div className="mt-7 grid grid-cols-4 gap-2">
                  {demoSteps.map((step, index) => (
                    <button
                      key={step.label}
                      onClick={() => setActiveDemo(index)}
                      className={`h-1.5 rounded-full transition-all ${activeDemo === index ? 'bg-white' : 'bg-white/16 hover:bg-white/36'}`}
                      aria-label={`Ver etapa ${step.label}`}
                    />
                  ))}
                </div>
              </div>
              <div className="absolute right-8 top-[470px] rounded-[24px] border border-black/[0.05] bg-white p-5 shadow-[0_26px_80px_rgba(0,0,0,0.12)]">
                <p className="text-[44px] font-extralight leading-none">4x</p>
                <p className="mt-2 max-w-[150px] text-[11px] font-semibold leading-relaxed text-[#86868b]">mais reaproveitamento do acervo científico</p>
              </div>
            </div>
          </div>

          <section id="planos" className="mt-12 scroll-mt-8 rounded-[36px] bg-[#ededeb] px-4 py-12 sm:px-8 lg:px-10">
            <div className="mx-auto mb-9 max-w-3xl text-center">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Planos</p>
              <h2 className="text-[38px] font-semibold leading-tight tracking-tight sm:text-[56px]">Planos para transformar acervo em presença científica.</h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
              {plans.map((plan, index) => {
                const Icon = plan.icon;
                return (
                  <article
                    key={plan.name}
                    className={`plans-card group relative min-h-[540px] overflow-hidden rounded-[34px] border p-5 transition-all hover:-translate-y-1 ${plan.highlight ? 'border-[#111113] bg-[#111113] text-white shadow-[0_38px_100px_rgba(0,0,0,0.30)] xl:-translate-y-4' : 'border-white bg-white text-[#111113] shadow-[0_22px_70px_rgba(0,0,0,0.08)]'}`}
                    style={{ animationDelay: `${index * 120}ms` }}
                  >
                    <div className={`mb-6 rounded-[26px] p-5 ${plan.highlight ? 'bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(58,123,213,0.18))]' : 'bg-[#f0f0ef]'}`}>
                      <div className="mb-12 flex items-center justify-between">
                        <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${plan.highlight ? 'bg-white text-[#111113]' : 'bg-white text-[#424245]'}`}>{plan.name}</span>
                        <Icon size={20} className={plan.highlight ? 'text-white/72' : 'text-[#1d1d1f]'} />
                      </div>
                      <PriceDisplay price={plan.price} period={plan.period} inverted={plan.highlight} />
                      <p className={`mt-4 min-h-[58px] text-[13px] leading-relaxed ${plan.highlight ? 'text-white/64' : 'text-[#6e6e73]'}`}>{plan.description}</p>
                    </div>

                    <div className={`mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold ${plan.highlight ? 'bg-white/10 text-white/72' : 'bg-[#f5f5f7] text-[#424245]'}`}>
                      <Database size={13} />
                      {plan.storage} de espaço
                    </div>

                    <div className="space-y-3">
                      {plan.features.map(feature => (
                        <div key={feature} className="flex gap-2 text-[13px] leading-relaxed">
                          <Check size={15} className={`mt-0.5 shrink-0 ${plan.highlight ? 'text-white' : 'text-[#111113]'}`} />
                          <span className={plan.highlight ? 'text-white/72' : 'text-[#424245]'}>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <a href={plan.href} className={`button-nowrap absolute bottom-5 left-5 right-5 flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[13px] font-semibold transition-all active:scale-[0.98] ${plan.highlight ? 'bg-white text-[#111113] hover:bg-white/90' : 'bg-[#111113] text-white hover:bg-[#2d2d2f]'}`}>
                      {plan.cta}
                      <ArrowRight size={14} />
                    </a>
                  </article>
                );
              })}
            </div>
          </section>

          <section id="ativos" className="mt-24 scroll-mt-8 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">O problema real</p>
              <h2 className="text-[42px] font-semibold leading-tight tracking-tight sm:text-[64px]">Seu acervo científico deve responder na velocidade da sua prática.</h2>
              <p className="mt-6 max-w-xl text-[16px] font-light leading-relaxed text-[#6e6e73]">
                A Lon Suite organiza a memória clínica em uma camada viva: cada imagem, PDF e anotação passa a ter contexto, destino e valor de apresentação.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['Celular', 'Fotos científicas misturadas com vida pessoal.'],
                ['WhatsApp', 'Casos importantes soterrados em conversas.'],
                ['Drive', 'Pastas com nomes frios e pouca inteligência.'],
                ['Lon Suite', 'Ativos com contexto, busca e destino editorial.'],
              ].map(([title, body], index) => (
                <div key={title} className={`plans-card rounded-[28px] border p-6 ${index === 3 ? 'border-[#111113] bg-[#111113] text-white' : 'border-black/[0.06] bg-white'}`}>
                  <p className="text-[22px] font-light">{title}</p>
                  <p className={`mt-4 text-[13px] leading-relaxed ${index === 3 ? 'text-white/62' : 'text-[#6e6e73]'}`}>{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-24 grid gap-5 lg:grid-cols-3">
            {[
              {
                image: '/assets/lon-suite-doctors-laptop-editorial.jpg',
                eyebrow: 'Workspace científico',
                title: 'A revisão deixa de depender de pastas soltas.',
                body: 'O médico abre o sistema e encontra o material pelo significado clínico, não pelo nome improvisado do arquivo.',
              },
              {
                image: '/assets/lon-suite-doctor-smartphone-editorial.jpg',
                eyebrow: 'Acesso imediato',
                title: 'O caso acompanha a rotina, inclusive no celular.',
                body: 'Quando surge a aula, o round ou a conversa científica, o ativo certo já está perto o bastante para ser usado.',
              },
              {
                image: '/assets/lon-suite-physician-female-editorial.jpg',
                eyebrow: 'Presença editorial',
                title: 'De documentação clínica para narrativa de autoridade.',
                body: 'A imagem ganha contexto, o contexto vira case, e o case ganha forma para apresentação com acabamento premium.',
              },
            ].map((item, index) => (
              <article key={item.title} className={`plans-card overflow-hidden rounded-[36px] bg-white shadow-[0_28px_90px_rgba(0,0,0,0.08)] ${index === 1 ? 'lg:translate-y-10' : ''}`}>
                <div className="aspect-[4/3] overflow-hidden bg-[#e8e8e6]">
                  <img src={item.image} alt="" className="h-full w-full object-cover grayscale transition-transform duration-700 hover:scale-[1.035]" />
                </div>
                <div className="p-7">
                  <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">{item.eyebrow}</p>
                  <h3 className="text-[29px] font-light leading-tight tracking-tight text-[#111113]">{item.title}</h3>
                  <p className="mt-5 text-[14px] font-light leading-relaxed text-[#6e6e73]">{item.body}</p>
                </div>
              </article>
            ))}
          </section>

          <section id="case-builder" className="mt-24 scroll-mt-8 overflow-hidden rounded-[38px] bg-[#111113] text-white shadow-[0_40px_120px_rgba(0,0,0,0.25)]">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 sm:p-12 lg:p-16">
                <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Case Builder</p>
                <h2 className="text-[42px] font-extralight leading-tight tracking-tight sm:text-[64px]">Um case builder para transformar evidência em narrativa.</h2>
                <p className="mt-7 max-w-xl text-[16px] font-light leading-relaxed text-white/58">
                  A Lon Suite aproxima o momento clínico do momento científico. O médico encontra o ativo certo e monta o case com blocos, imagens, referências e apresentação sem recomeçar do zero.
                </p>
              </div>
              <div className="relative min-h-[520px] bg-[#0b0c0e] p-8">
                <div className="plans-product-stack absolute left-8 top-12 w-[76%] rounded-[30px] bg-white p-5 text-[#111113] shadow-[0_28px_100px_rgba(0,0,0,0.35)]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#86868b]">Case em construção</p>
                  <h3 className="mt-2 text-[30px] font-light tracking-tight">Evolução cirúrgica documentada</h3>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {[
                      { Icon: Images, label: 'Imagem' },
                      { Icon: FileText, label: 'Texto' },
                      { Icon: Presentation, label: 'Slide' },
                    ].map(({ Icon, label }) => (
                      <div key={label} className="flex h-28 flex-col items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#d8dde2,#f7f2ea_48%,#aeb8bf)] text-[#1d1d1f]/58">
                        <Icon size={22} strokeWidth={1.4} />
                        <span className="mt-2 text-[8px] font-bold uppercase tracking-[0.16em]">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="plans-product-stack absolute bottom-12 right-8 w-[60%] rounded-[28px] border border-white/[0.10] bg-white/[0.10] p-5 backdrop-blur-xl">
                  <Presentation size={20} className="mb-12 text-white/70" />
                  <p className="text-[28px] font-extralight leading-tight">Pronto para aula, round ou publicação.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="busca" className="mt-24 scroll-mt-8 grid gap-5 lg:grid-cols-3">
            {[
              { icon: Search, title: 'Busca semântica como diferencial', body: 'A busca não depende só do nome do arquivo. Ela entende contexto, tema, técnica, achado e intenção.' },
              { icon: Brain, title: 'Ativos com inteligência', body: 'Cada imagem e documento ganha metadados úteis, tags, resumo e lugar dentro da produção científica.' },
              { icon: Award, title: 'Presença científica sempre à mão', body: 'Seu melhor material deixa de depender da memória e passa a estar pronto para ser encontrado, revisado e apresentado.' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[34px] border border-black/[0.06] bg-white p-8 shadow-[0_22px_70px_rgba(0,0,0,0.07)]">
                  <div className="mb-12 flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#111113] text-white">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-[26px] font-light tracking-tight">{item.title}</h3>
                  <p className="mt-4 text-[14px] leading-relaxed text-[#6e6e73]">{item.body}</p>
                </div>
              );
            })}
          </section>

          <section className="mt-24 space-y-7">
            <article className="plans-card overflow-hidden rounded-[42px] bg-[#111113] text-white shadow-[0_38px_120px_rgba(0,0,0,0.25)]">
              <div className="grid min-h-[620px] lg:grid-cols-[1.08fr_0.92fr]">
                <div className="relative min-h-[420px] overflow-hidden bg-[#050506] lg:min-h-full">
                  <img
                    src="/assets/lon-suite-security-editorial.png"
                    alt=""
                    className="h-full w-full object-cover object-[42%_38%] grayscale opacity-95"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,6,0.05),rgba(5,5,6,0.16)_44%,rgba(5,5,6,0.72))]" />
                  <div className="absolute bottom-6 left-6 right-6 rounded-[26px] border border-white/12 bg-black/35 p-5 backdrop-blur-xl sm:left-8 sm:right-auto sm:w-[330px]">
                    <div className="mb-8 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/50">
                      <KeyRound size={13} />
                      Camada privada
                    </div>
                    <p className="text-[28px] font-extralight leading-tight tracking-tight">Cada acervo pertence ao seu usuário.</p>
                  </div>
                </div>
                <div className="flex flex-col justify-between p-8 sm:p-10 lg:p-14 xl:p-16">
                  <div>
                    <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-[18px] border border-white/10 bg-white/[0.08] p-3 text-white">
                      <ShieldCheck size={24} strokeWidth={1.4} />
                    </div>
                    <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/38">Proteção e confiança</p>
                    <h2 className="max-w-[560px] text-[36px] font-extralight leading-[1.04] tracking-tight sm:text-[52px] xl:text-[62px]">Um ambiente pensado para acervo clínico sensível.</h2>
                    <p className="mt-7 max-w-[520px] text-[15px] font-light leading-relaxed text-white/62 sm:text-[16px]">
                      A Lon Suite organiza cada ativo com dono, contexto e acesso individual. O sistema foi desenhado para preservar a privacidade do acervo e manter a experiência limpa, rastreável e profissional.
                    </p>
                  </div>
                  <div className="mt-12 grid gap-3 sm:grid-cols-3">
                    {[
                      { icon: LockKeyhole, label: 'Acesso individual' },
                      { icon: Fingerprint, label: 'Conta por usuário' },
                      { icon: Server, label: 'Base protegida' },
                    ].map(item => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="rounded-[22px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                          <Icon size={18} className="mb-7 text-white/70" strokeWidth={1.4} />
                          <p className="text-[12px] font-semibold leading-snug text-white/72">{item.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </article>

            <article className="plans-card relative min-h-[760px] overflow-hidden rounded-[42px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.10)]">
              <img
                src="/assets/lon-suite-global-editorial.png"
                alt=""
                className="absolute inset-0 h-full w-full object-cover grayscale"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.94),rgba(255,255,255,0.82)_36%,rgba(17,17,19,0.36)_68%,rgba(17,17,19,0.82))]" />
              <div className="relative z-10 grid min-h-[760px] items-center gap-8 p-8 sm:p-10 lg:grid-cols-[0.82fr_1.18fr] lg:p-14 xl:p-16">
                <div className="max-w-xl">
                  <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6e6e73]">Alcance global</p>
                  <h2 className="text-[40px] font-semibold leading-[1.02] tracking-tight sm:text-[64px]">Criado para uma prática médica sem fronteiras.</h2>
                  <p className="mt-7 text-[16px] font-light leading-relaxed text-[#424245]">
                    O conhecimento clínico não termina na sala de cirurgia. Ele vira aula, discussão, segunda opinião, conferência e colaboração científica.
                  </p>
                  <div className="mt-9 grid gap-3 sm:grid-cols-2">
                    {[
                      { icon: Globe2, label: 'Biblioteca pronta para circular' },
                      { icon: Network, label: 'Colaboração com contexto' },
                    ].map(item => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="rounded-[22px] border border-black/[0.06] bg-white/72 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl">
                          <Icon size={18} className="mb-7 text-[#1d1d1f]/70" strokeWidth={1.4} />
                          <p className="text-[12px] font-semibold leading-snug text-[#424245]">{item.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="relative mx-auto h-[360px] w-[360px] max-w-[86vw] sm:h-[500px] sm:w-[500px] lg:h-[560px] lg:w-[560px]">
                  <div className="plans-global-aura absolute inset-[-12%] rounded-full" />
                  <div className="plans-global-ring absolute inset-[-30px] rounded-full border border-white/50" />
                  <div className="plans-global-ring plans-global-ring-slow absolute inset-[-72px] rounded-full border border-white/24" />
                  <div className="plans-global-orbit plans-global-orbit-one absolute inset-[-44px] rounded-full border border-white/28" />
                  <div className="plans-global-orbit plans-global-orbit-two absolute inset-[-22px] rounded-full border border-white/22" />
                  <div className="plans-global-globe absolute inset-0 rounded-full border border-white/55 bg-black/[0.08] shadow-[inset_0_0_90px_rgba(255,255,255,0.74),inset_-42px_-30px_90px_rgba(17,17,19,0.28),0_36px_120px_rgba(0,0,0,0.24)] backdrop-blur-sm">
                    <div className="plans-globe-grid" />
                    <div className="plans-globe-map">
                      <span className="plans-continent plans-continent-americas" />
                      <span className="plans-continent plans-continent-europe" />
                      <span className="plans-continent plans-continent-africa" />
                      <span className="plans-continent plans-continent-asia" />
                      <span className="plans-continent plans-continent-australia" />
                    </div>
                    <div className="plans-globe-shine" />
                    <div className="plans-globe-lat top-[24%]" />
                    <div className="plans-globe-lat top-[50%]" />
                    <div className="plans-globe-lat top-[76%]" />
                    <div className="plans-globe-lon left-[25%]" />
                    <div className="plans-globe-lon left-[50%]" />
                    <div className="plans-globe-lon left-[75%]" />
                  </div>
                  {[
                    ['São Paulo', '4%', '57%'],
                    ['Boston', '78%', '28%'],
                    ['Lisboa', '20%', '9%'],
                    ['Tokyo', '74%', '75%'],
                    ['Zurich', '47%', '-1%'],
                    ['Dubai', '56%', '52%'],
                  ].map(([city, left, top]) => (
                    <span
                      key={city}
                      className="absolute z-10 rounded-full border border-white/60 bg-white/86 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#1d1d1f] shadow-[0_12px_34px_rgba(0,0,0,0.14)] backdrop-blur"
                      style={{ left, top }}
                    >
                      {city}
                    </span>
                  ))}
                  <div className="absolute bottom-2 left-1/2 z-20 w-[78%] -translate-x-1/2 rounded-[28px] border border-white/18 bg-[#111113]/82 p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-6">
                    <Network size={18} className="mb-6 text-white/60" />
                    <p className="text-[22px] font-extralight leading-tight sm:text-[26px]">Ativos científicos prontos para circular com clareza, contexto e autoridade.</p>
                  </div>
                </div>
              </div>
            </article>
          </section>

          <section className="mt-24 grid items-center gap-8 rounded-[38px] bg-[#ededeb] p-6 sm:p-10 lg:grid-cols-[0.95fr_1.05fr] lg:p-12">
            <div>
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Valor prático</p>
              <h2 className="text-[42px] font-semibold leading-tight tracking-tight sm:text-[60px]">Menos tempo procurando. Mais tempo usando o que você já construiu.</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['Antes', 'Arquivo perdido, sem contexto, difícil de reaproveitar.'],
                ['Depois', 'Ativo científico com busca, resumo e vínculo ao case.'],
                ['No dia a dia', 'Material pronto para aula, reunião, discussão e memória profissional.'],
                ['No crescimento', 'Acervo acumulado vira patrimônio intelectual organizado.'],
              ].map(([title, body], index) => (
                <div key={title} className={`rounded-[28px] p-6 ${index === 1 ? 'bg-[#111113] text-white shadow-[0_24px_70px_rgba(0,0,0,0.18)]' : 'bg-white text-[#111113]'}`}>
                  <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-current opacity-45">{title}</p>
                  <p className="mt-7 text-[20px] font-light leading-tight">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="relative mt-24 overflow-hidden rounded-[42px] bg-[#111113] px-7 py-16 text-center text-white shadow-[0_38px_130px_rgba(0,0,0,0.26)] sm:px-12 sm:py-20">
            <img
              src="/assets/lon-suite-tablet-doctor-editorial.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[50%_42%] grayscale opacity-54"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,19,0.94),rgba(17,17,19,0.58),rgba(17,17,19,0.92))]" />
            <div className="relative z-10">
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/44">Comece pela decisão certa</p>
              <h2 className="mx-auto max-w-4xl text-[42px] font-extralight leading-tight tracking-tight sm:text-[66px]">Seu acervo já existe. Agora ele precisa trabalhar no nível da sua carreira.</h2>
              <p className="mx-auto mt-7 max-w-2xl text-[16px] font-light leading-relaxed text-white/62">Escolha um plano e transforme imagens, PDFs e casos em uma biblioteca científica viva, pesquisável e pronta para apresentação.</p>
              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={planMailto('Personal')} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-[13px] font-semibold text-[#111113] hover:bg-white/90">
                Assinar Personal
                <ArrowRight size={15} />
              </a>
              <a href={planMailto('Enterprise')} className="button-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3 text-[13px] font-semibold text-white backdrop-blur hover:bg-white/16">
                Falar com a equipe
              </a>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [activeStory, setActiveStory] = useState(0);
  const [showPlans, setShowPlans] = useState(false);

  const stories = useMemo(() => [
    {
      eyebrow: 'Patrimônio Científico',
      title: 'A memória científica da sua prática, pronta para ser encontrada.',
      body: 'Transforme fotos cirúrgicas, PDFs e observações clínicas em um acervo pesquisável, organizado e seguro.',
      metric: '42',
      metricLabel: 'imagens indexadas',
    },
    {
      eyebrow: 'IA editorial',
      title: 'Da imagem bruta ao contexto científico em poucos segundos.',
      body: 'A IA ajuda a sugerir títulos, tags, resumo, achados principais e contexto para acelerar a curadoria médica.',
      metric: 'IA',
      metricLabel: 'curadoria assistida',
    },
    {
      eyebrow: 'Cases apresentáveis',
      title: 'Organize casos para discussão, aula, publicação e memória institucional.',
      body: 'Monte narrativas clínicas com imagens, textos, ativos vinculados e uma apresentação visualmente pronta.',
      metric: '12',
      metricLabel: 'slides editoriais',
    },
  ], []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStory(index => (index + 1) % stories.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [stories.length]);

  const story = stories[activeStory];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await signIn(email.trim(), password);
      onLogin(user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar.');
    } finally {
      setLoading(false);
    }
  };

  if (showPlans) {
    return <PlansPage onBack={() => setShowPlans(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">
      <div className="grid min-h-screen lg:grid-cols-[minmax(420px,0.86fr)_1.14fr]">
        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-[420px]">
            <div className="mb-10">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#1d1d1f] shadow-[0_8px_28px_rgba(0,0,0,0.16)]">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M3 5.5h16M3 11h10M3 16.5h12" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Lon Suite</p>
              <h1 className="text-[34px] font-extralight leading-tight tracking-tight text-[#1d1d1f]">Lon Suite</h1>
              <p className="mt-3 max-w-[340px] text-[13px] leading-relaxed text-[#6e6e73]">
                Entre no ambiente onde ativos científicos, imagens cirúrgicas e cases clínicos viram patrimônio organizado.
              </p>
            </div>

            <div className="rounded-[26px] border border-black/[0.05] bg-white p-7 shadow-[0_18px_60px_rgba(0,0,0,0.08)] sm:p-8">
              <div className="mb-7 flex items-start justify-between gap-5">
                <div>
                  <h2 className="text-[20px] font-semibold tracking-tight text-[#1d1d1f]">Acessar conta</h2>
                  <p className="mt-1 text-[12px] leading-relaxed text-[#86868b]">Entre no seu workspace científico.</p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#f5f5f7] text-[#1d1d1f]">
                  <LockKeyhole size={17} />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#86868b]">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="seu@email.com"
                    required
                    autoComplete="email"
                    className="w-full rounded-[14px] border border-transparent bg-[#f5f5f7] px-4 py-3 text-[14px] text-[#1d1d1f] outline-none transition-all placeholder:text-[#c7c7cc] focus:border-black/[0.08] focus:bg-white focus:ring-4 focus:ring-black/[0.04]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#86868b]">
                    Senha
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-[14px] border border-transparent bg-[#f5f5f7] px-4 py-3 text-[14px] text-[#1d1d1f] outline-none transition-all placeholder:text-[#c7c7cc] focus:border-black/[0.08] focus:bg-white focus:ring-4 focus:ring-black/[0.04]"
                  />
                </div>

                {error && (
                  <div className="rounded-[14px] border border-[#ff3b30]/10 bg-[#fff1f0] px-3 py-2 text-[12px] font-medium text-[#d92d20]">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="button-nowrap mt-2 flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#1d1d1f] py-3 text-[14px] font-semibold text-white shadow-[0_10px_26px_rgba(0,0,0,0.16)] transition-all hover:bg-[#2d2d2f] active:scale-[0.98] disabled:opacity-40"
                >
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" opacity="0.3"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                      Entrando...
                    </>
                  ) : (
                    <>
                      Entrar no workspace
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-7 text-center text-[11px] leading-relaxed text-[#aeaeb2]">
                Acesso somente por convite.{' '}
                <a href="mailto:contato@lonsuite.com.br" className="font-medium text-[#3a7bd5] hover:underline">
                  contato@lonsuite.com.br
                </a>
              </p>

              <button
                type="button"
                onClick={() => setShowPlans(true)}
                className="button-nowrap mt-4 flex w-full items-center justify-center gap-2 rounded-[14px] border border-black/[0.06] bg-[#f9f9fb] px-4 py-3 text-[12px] font-semibold text-[#424245] hover:bg-[#1d1d1f] hover:text-white"
              >
                Confira nossos planos
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[11px] font-medium text-[#86868b]">
              <ShieldCheck size={14} className="text-[#1d1d1f]" />
              Dados científicos organizados por conta e protegidos por autenticação.
            </div>
          </div>
        </section>

        <section className="relative hidden overflow-hidden bg-[#101114] px-10 py-10 text-white lg:flex lg:items-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(255,255,255,0.12),transparent_30%),radial-gradient(circle_at_82%_72%,rgba(58,123,213,0.18),transparent_34%)]" />
          <div className="login-orbit absolute left-[10%] top-[8%] h-36 w-36 rounded-full border border-white/[0.08]" />
          <div className="login-orbit login-orbit-delayed absolute bottom-[12%] right-[12%] h-52 w-52 rounded-full border border-white/[0.06]" />
          <div className="relative mx-auto grid w-full max-w-[1040px] grid-cols-[0.9fr_1.1fr] items-center gap-8 xl:gap-10">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.06] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/62">
                <Award size={12} />
                {story.eyebrow}
              </p>
              <div key={activeStory} className="login-story-enter">
                <h2 className="text-[40px] font-extralight leading-[1.04] tracking-tight xl:text-[54px]">
                  {story.title}
                </h2>
                <p className="mt-6 max-w-[470px] text-[15px] font-light leading-relaxed text-white/62">
                  {story.body}
                </p>
              </div>

              <div className="mt-7 flex items-center gap-2">
                {stories.map((item, index) => (
                  <button
                    key={item.eyebrow}
                    onClick={() => setActiveStory(index)}
                    aria-label={`Mostrar ${item.eyebrow}`}
                    className={`h-1.5 rounded-full transition-all ${index === activeStory ? 'w-12 bg-white' : 'w-4 bg-white/20 hover:bg-white/40'}`}
                  />
                ))}
              </div>

              <div className="mt-7 grid gap-2.5 xl:gap-3">
                {[
                  { icon: Images, title: 'Ativos organizados', body: 'Imagens, PDFs e materiais científicos com tags, contexto e busca.' },
                  { icon: Brain, title: 'IA como assistente editorial', body: 'Indexação, resumos e achados principais para acelerar curadoria.' },
                  { icon: Presentation, title: 'Cases apresentáveis', body: 'Documentação clínica com modo apresentação e exportação estruturada.' },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="login-feature-card flex gap-3 rounded-[18px] border border-white/[0.08] bg-white/[0.055] p-3.5 backdrop-blur xl:p-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-white text-[#1d1d1f]">
                        <Icon size={17} />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-white">{item.title}</p>
                        <p className="mt-1 text-[11px] leading-relaxed text-white/48 xl:text-[12px]">{item.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative min-h-[600px] xl:min-h-[650px]">
              <div className="absolute inset-x-0 top-0 h-[540px] overflow-hidden rounded-[36px] bg-[#f6f5f2] shadow-[0_34px_120px_rgba(0,0,0,0.34)] xl:h-[590px]">
                <img
                  src="/assets/lon-suite-login-doctors-editorial.png"
                  alt="Médicos pesquisadores representando a Lon Suite"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,17,20,0.16)_0%,rgba(16,17,20,0)_30%,rgba(16,17,20,0.06)_100%)]" />
              </div>

              <div className="login-product-card absolute bottom-4 left-5 w-[min(430px,calc(100%-40px))] rounded-[26px] border border-white/[0.14] bg-[#101114]/84 p-4 text-white shadow-[0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl xl:bottom-8 xl:left-8 xl:p-5">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/42">Lon Suite em ação</p>
                    <h3 className="mt-2 text-[23px] font-extralight leading-tight tracking-tight xl:text-[29px]">
                      {activeStory === 1 ? 'A imagem ganha leitura científica.' : activeStory === 2 ? 'O ativo vira narrativa clínica.' : 'O acervo fica pronto para ser encontrado.'}
                    </h3>
                  </div>
                  <div className="hidden shrink-0 items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1d1d1f] xl:flex">
                    <Search size={12} />
                    Semântico
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {[
                    ['Ativo', 'contexto'],
                    ['Busca', 'sentido'],
                    ['Case', 'narrativa'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[16px] border border-white/[0.08] bg-white/[0.08] px-3 py-2.5">
                      <p className="text-[11px] font-semibold text-white">{label}</p>
                      <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white/36">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
