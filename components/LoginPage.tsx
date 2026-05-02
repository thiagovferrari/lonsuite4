import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Award, Brain, Building2, Check, Crown, Database, FileText, Images, LockKeyhole, Presentation, Search, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { signIn } from '../services/authService';
import type { AuthUser } from '../services/authService';

interface Props {
  onLogin: (user: AuthUser) => void;
}

interface PlansPageProps {
  onBack: () => void;
}

const planMailto = (plan: string) =>
  `mailto:suporte@longecta.com.br?subject=${encodeURIComponent(`Assinar Lon Suite ${plan}`)}&body=${encodeURIComponent(`Olá, quero assinar o plano ${plan} da Lon Suite. Pode me orientar nos próximos passos?`)}`;

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
              <span>Ativos</span>
              <span>Busca semântica</span>
              <span>Case Builder</span>
              <span>Planos</span>
            </div>
            <a href={planMailto('Personal')} className="rounded-full bg-[#1d1d1f] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#2d2d2f]">
              Assinar
            </a>
          </nav>

          <div className="grid min-h-[640px] items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="plans-story-enter">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6e6e73] shadow-[0_12px_34px_rgba(0,0,0,0.05)]">
                <Award size={13} className="text-[#1d1d1f]" />
                Lon Suite Pricing
              </p>
              <h1 className="max-w-4xl text-[48px] font-extralight leading-[0.98] tracking-tight text-[#111113] sm:text-[76px] lg:text-[92px]">
                O acervo científico que trabalha por você.
              </h1>
              <p className="mt-8 max-w-2xl text-[18px] font-light leading-relaxed text-[#6e6e73] sm:text-[21px]">
                A Lon Suite transforma imagens, fotos e documentos em ativos científicos pesquisáveis. O que antes era arquivo esquecido passa a gerar aula, case, apresentação, memória e autoridade.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href={planMailto('Personal')} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-6 py-3 text-[13px] font-semibold text-white shadow-[0_18px_44px_rgba(0,0,0,0.18)] hover:bg-[#2d2d2f]">
                  Escolher plano
                  <ArrowRight size={15} />
                </a>
                <button onClick={() => setActiveDemo(0)} className="inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.08] bg-white px-6 py-3 text-[13px] font-semibold text-[#424245] hover:bg-[#f5f5f7]">
                  Ver o conceito
                </button>
              </div>
            </div>

            <div className="relative min-h-[680px]">
              <img
                src="/assets/lon-suite-physician-editorial.png"
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

          <section className="mt-12 rounded-[36px] bg-[#ededeb] px-4 py-12 sm:px-8 lg:px-10">
            <div className="mx-auto mb-9 max-w-3xl text-center">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Planos</p>
              <h2 className="text-[38px] font-semibold leading-tight tracking-tight sm:text-[56px]">Planos para transformar acervo em presença científica.</h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-4">
              {plans.map((plan, index) => {
                const Icon = plan.icon;
                return (
                  <article
                    key={plan.name}
                    className={`plans-card group relative min-h-[560px] overflow-hidden rounded-[34px] border p-5 transition-all hover:-translate-y-1 ${plan.highlight ? 'border-[#111113] bg-[#111113] text-white shadow-[0_38px_100px_rgba(0,0,0,0.30)] lg:-translate-y-4' : 'border-white bg-white text-[#111113] shadow-[0_22px_70px_rgba(0,0,0,0.08)]'}`}
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

                    <a href={plan.href} className={`absolute bottom-5 left-5 right-5 flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[13px] font-semibold transition-all active:scale-[0.98] ${plan.highlight ? 'bg-white text-[#111113] hover:bg-white/90' : 'bg-[#111113] text-white hover:bg-[#2d2d2f]'}`}>
                      {plan.cta}
                      <ArrowRight size={14} />
                    </a>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mt-24 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">O problema real</p>
              <h2 className="text-[42px] font-semibold leading-tight tracking-tight sm:text-[64px]">O médico já tem conteúdo. Ele só não consegue encontrá-lo quando precisa.</h2>
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

          <section className="mt-24 overflow-hidden rounded-[38px] bg-[#111113] text-white shadow-[0_40px_120px_rgba(0,0,0,0.25)]">
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
                    {[0, 1, 2].map(i => <div key={i} className="h-28 rounded-[18px] bg-[linear-gradient(135deg,#d8dde2,#f7f2ea_48%,#aeb8bf)]" />)}
                  </div>
                </div>
                <div className="plans-product-stack absolute bottom-12 right-8 w-[60%] rounded-[28px] border border-white/[0.10] bg-white/[0.10] p-5 backdrop-blur-xl">
                  <Presentation size={20} className="mb-12 text-white/70" />
                  <p className="text-[28px] font-extralight leading-tight">Pronto para aula, round ou publicação.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-24 grid gap-5 lg:grid-cols-3">
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

          <section className="mt-24 rounded-[38px] bg-white p-8 text-center shadow-[0_28px_90px_rgba(0,0,0,0.08)] sm:p-14">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Comece pela decisão certa</p>
            <h2 className="mx-auto max-w-4xl text-[42px] font-semibold leading-tight tracking-tight sm:text-[64px]">O próximo ativo científico que você perder pode ser justamente o que mais precisava encontrar.</h2>
            <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-[#6e6e73]">Escolha um plano e comece a transformar seu acervo em vantagem intelectual.</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={planMailto('Personal')} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111113] px-7 py-3 text-[13px] font-semibold text-white hover:bg-[#2d2d2f]">
                Assinar Personal
                <ArrowRight size={15} />
              </a>
              <a href={planMailto('Enterprise')} className="inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.08] px-7 py-3 text-[13px] font-semibold text-[#424245] hover:bg-[#f5f5f7]">
                Falar com a equipe
              </a>
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
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#86868b]">Longecta Scientific Workspace</p>
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
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#1d1d1f] py-3 text-[14px] font-semibold text-white shadow-[0_10px_26px_rgba(0,0,0,0.16)] transition-all hover:bg-[#2d2d2f] active:scale-[0.98] disabled:opacity-40"
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
                <a href="mailto:suporte@longecta.com.br" className="font-medium text-[#3a7bd5] hover:underline">
                  suporte@longecta.com.br
                </a>
              </p>

              <button
                type="button"
                onClick={() => setShowPlans(true)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-[14px] border border-black/[0.06] bg-[#f9f9fb] px-4 py-3 text-[12px] font-semibold text-[#424245] hover:bg-[#1d1d1f] hover:text-white"
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
              <div className="absolute inset-x-4 top-0 h-[430px] overflow-hidden rounded-[34px] bg-white shadow-[0_34px_120px_rgba(0,0,0,0.34)] xl:inset-x-0 xl:h-[470px]">
                <img
                  src="/assets/lon-suite-physician-female-editorial.png"
                  alt="Médica pesquisadora representando a Lon Suite"
                  className="h-full w-full object-cover object-[44%_50%]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,17,20,0.20)_0%,rgba(16,17,20,0)_42%,rgba(16,17,20,0.10)_100%)]" />
              </div>

              <div className="login-product-card absolute left-0 top-[385px] w-[62%] rounded-[30px] border border-white/[0.10] bg-[#f7f7f5] p-4 text-[#1d1d1f] shadow-[0_36px_110px_rgba(0,0,0,0.44)] xl:top-[410px] xl:w-[60%] xl:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#86868b]">Ativo científico</p>
                    <h3 className="mt-1 text-[20px] font-light tracking-tight xl:text-[22px]">{activeStory === 1 ? 'Curadoria por IA' : activeStory === 2 ? 'Case pronto' : 'Imagem com contexto'}</h3>
                  </div>
                  <div className="rounded-full bg-[#1d1d1f] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white xl:px-3 xl:text-[10px]">Indexado</div>
                </div>

                <div className="grid grid-cols-[0.9fr_1.1fr] gap-3">
                  <div className="h-28 overflow-hidden rounded-[22px] bg-[#d8dde2] xl:h-36">
                    <div className="login-scan h-full w-full bg-[linear-gradient(135deg,#cfd8df,#f5f2ec_48%,#aeb8bf)]" />
                  </div>
                  <div className="rounded-[20px] bg-white p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] xl:p-4">
                    <Search size={16} className="mb-5 text-[#3a7bd5] xl:mb-8" />
                    <p className="text-[22px] font-light xl:text-[24px]">{story.metric}</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#86868b]">{story.metricLabel}</p>
                  </div>
                </div>

                <div className="mt-3 space-y-2 xl:mt-4 xl:space-y-2.5">
                  {[
                    activeStory === 0
                      ? ['Contexto', 'Imagem catalogada por significado clínico']
                      : activeStory === 1
                        ? ['Resumo', 'Tags e achados sugeridos para revisão']
                        : ['Narrativa', 'Blocos prontos para apresentação'],
                    activeStory === 0
                      ? ['Busca', 'Encontrável por tema, técnica e evolução']
                      : activeStory === 1
                        ? ['Curadoria', 'Menos arquivo solto, mais ativo útil']
                        : ['Destino', 'Aula, round, publicação ou memória'],
                  ].map(([label, value], index) => (
                    <div key={label} className="login-row-reveal rounded-[16px] border border-black/[0.05] bg-white px-3.5 py-2.5 xl:px-4 xl:py-3" style={{ animationDelay: `${index * 120}ms` }}>
                      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#86868b]">{label}</p>
                      <p className="mt-1 text-[12px] leading-relaxed text-[#424245]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="login-library-card absolute bottom-4 right-4 w-[42%] rounded-[26px] border border-white/[0.12] bg-white/[0.10] p-3.5 shadow-[0_28px_80px_rgba(0,0,0,0.36)] backdrop-blur-xl xl:bottom-8 xl:right-0 xl:w-[40%] xl:p-4">
                <div className="mb-3 flex items-center justify-between xl:mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/48">Biblioteca</p>
                  <FileText size={15} className="text-white/62" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['Cirurgia', 'Caso', 'Imagem', 'PDF'].map(label => (
                    <div key={label} className="aspect-square rounded-[16px] bg-white/[0.10] p-2">
                      <div className="mb-2 h-2 w-8 rounded-full bg-white/24 xl:mb-3" />
                      <p className="text-[10px] font-semibold text-white/70">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-[16px] bg-white px-4 py-3 text-[#1d1d1f] xl:mt-4">
                  <p className="text-[11px] font-semibold">Busca semântica</p>
                  <p className="mt-1 text-[10px] leading-relaxed text-[#86868b]">Encontre um caso por tema, técnica, imagem ou evidência.</p>
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
