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

const PlansPage: React.FC<PlansPageProps> = ({ onBack }) => {
  const plans = [
    {
      name: 'Free',
      icon: Sparkles,
      price: 'R$ 0',
      period: 'para experimentar',
      description: 'Para conhecer a experiência Lon Suite e organizar os primeiros ativos científicos.',
      storage: '100 MB',
      highlight: false,
      cta: 'Começar pelo Free',
      href: planMailto('Free'),
      features: ['Biblioteca inicial de ativos', 'Login seguro por conta', 'Cases científicos básicos', 'Ideal para teste e validação'],
    },
    {
      name: 'Personal',
      icon: Database,
      price: 'R$ 49',
      period: '/mês',
      description: 'Para o médico que quer preservar, localizar e apresentar sua própria produção científica.',
      storage: '5 GB',
      highlight: true,
      cta: 'Assinar Personal',
      href: planMailto('Personal'),
      features: ['Até 5 GB de imagens e documentos', 'Busca e organização por tags', 'Cases com modo apresentação', 'Suporte para evolução do acervo'],
    },
    {
      name: 'Premium',
      icon: Crown,
      price: 'R$ 149',
      period: '/mês',
      description: 'Para produção científica recorrente, aulas, apresentações e documentação clínica robusta.',
      storage: '20 GB',
      highlight: false,
      cta: 'Assinar Premium',
      href: planMailto('Premium'),
      features: ['20 GB para acervo avançado', 'Biblioteca científica ampliada', 'Exportação e apresentação premium', 'Preparado para recursos de IA'],
    },
    {
      name: 'Enterprise',
      icon: Building2,
      price: 'Sob consulta',
      period: 'para equipes',
      description: 'Para clínicas, serviços, grupos médicos e instituições que precisam governança e escala.',
      storage: '100 GB+',
      highlight: false,
      cta: 'Consultar equipe',
      href: planMailto('Enterprise'),
      features: ['Limites personalizados', 'Onboarding assistido', 'Governança para equipes', 'Plano de dados sob medida'],
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#f5f5f7] text-[#1d1d1f]">
      <section className="relative px-5 pb-16 pt-6 sm:px-8 lg:px-12">
        <div className="plans-orbit absolute right-[8%] top-20 h-56 w-56 rounded-full border border-black/[0.06]" />
        <div className="plans-orbit plans-orbit-slow absolute bottom-20 left-[7%] h-72 w-72 rounded-full border border-black/[0.04]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 flex items-center justify-between gap-5">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-[12px] font-semibold text-[#424245] shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:bg-[#1d1d1f] hover:text-white"
            >
              <ArrowLeft size={14} />
              Voltar ao login
            </button>
            <div className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-semibold text-[#86868b] shadow-[0_10px_30px_rgba(0,0,0,0.05)] sm:flex">
              <ShieldCheck size={14} className="text-[#1d1d1f]" />
              Dados científicos, acervo e apresentação em um só workspace
            </div>
          </div>

          <div className="grid items-end gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="plans-story-enter">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6e6e73] shadow-[0_12px_34px_rgba(0,0,0,0.05)]">
                <Award size={13} className="text-[#1d1d1f]" />
                Planos Lon Suite
              </p>
              <h1 className="max-w-4xl text-[44px] font-extralight leading-[1.02] tracking-tight text-[#1d1d1f] sm:text-[64px] lg:text-[74px]">
                O plano certo para transformar produção médica em patrimônio científico.
              </h1>
              <p className="mt-7 max-w-2xl text-[16px] font-light leading-relaxed text-[#6e6e73] sm:text-[18px]">
                A Lon Suite não é um drive. É o espaço onde imagens cirúrgicas, documentos, evidências e cases ganham contexto, busca, apresentação e permanência.
              </p>
            </div>

            <div className="plans-showcase relative min-h-[430px] rounded-[34px] bg-[#101114] p-6 text-white shadow-[0_34px_110px_rgba(0,0,0,0.22)]">
              <div className="absolute inset-0 rounded-[34px] bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.16),transparent_32%),radial-gradient(circle_at_84%_82%,rgba(58,123,213,0.20),transparent_38%)]" />
              <div className="relative grid h-full gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">Value engine</p>
                    <h2 className="mt-2 max-w-[460px] text-[32px] font-extralight leading-tight tracking-tight">Menos arquivo perdido. Mais conhecimento reaproveitado.</h2>
                  </div>
                  <div className="rounded-full bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#1d1d1f]">Premium</div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ['5 GB', 'Personal'],
                    ['20 GB', 'Premium'],
                    ['100 GB+', 'Enterprise'],
                  ].map(([value, label], index) => (
                    <div key={label} className="plans-metric rounded-[22px] border border-white/[0.08] bg-white/[0.075] p-4 backdrop-blur" style={{ animationDelay: `${index * 260}ms` }}>
                      <p className="text-[32px] font-extralight">{value}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/42">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-[24px] bg-white p-4 text-[#1d1d1f]">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#86868b]">Acervo médico</p>
                      <Images size={16} className="text-[#3a7bd5]" />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                        <div key={i} className="aspect-square rounded-[14px] bg-[linear-gradient(135deg,#d8dde2,#f5f2ec_52%,#aeb8bf)]" />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.08] p-4">
                    <Brain size={18} className="mb-8 text-white/70" />
                    <p className="text-[24px] font-extralight leading-tight">IA pronta para entrar quando o acervo pedir escala.</p>
                    <p className="mt-3 text-[11px] leading-relaxed text-white/45">Começamos com storage e organização. Depois ativamos tokens, limites e automação.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-4">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <article
                  key={plan.name}
                  className={`plans-card group relative overflow-hidden rounded-[30px] border p-6 transition-all hover:-translate-y-1 ${plan.highlight ? 'border-[#1d1d1f] bg-[#1d1d1f] text-white shadow-[0_32px_90px_rgba(0,0,0,0.22)]' : 'border-black/[0.06] bg-white text-[#1d1d1f] shadow-[0_18px_60px_rgba(0,0,0,0.07)]'}`}
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  {plan.highlight && (
                    <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#1d1d1f]">
                      Recomendado
                    </div>
                  )}
                  <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-[16px] ${plan.highlight ? 'bg-white text-[#1d1d1f]' : 'bg-[#f5f5f7] text-[#1d1d1f]'}`}>
                    <Icon size={21} />
                  </div>

                  <h3 className="text-[24px] font-light tracking-tight">{plan.name}</h3>
                  <p className={`mt-2 min-h-[56px] text-[13px] leading-relaxed ${plan.highlight ? 'text-white/58' : 'text-[#6e6e73]'}`}>{plan.description}</p>

                  <div className="my-7">
                    <div className="flex items-end gap-1">
                      <span className="text-[38px] font-extralight tracking-tight">{plan.price}</span>
                      <span className={`pb-2 text-[12px] font-medium ${plan.highlight ? 'text-white/45' : 'text-[#86868b]'}`}>{plan.period}</span>
                    </div>
                    <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold ${plan.highlight ? 'bg-white/10 text-white/70' : 'bg-[#f5f5f7] text-[#424245]'}`}>
                      <Database size={13} />
                      {plan.storage} de espaço
                    </div>
                  </div>

                  <div className="space-y-3">
                    {plan.features.map(feature => (
                      <div key={feature} className="flex gap-2 text-[12px] leading-relaxed">
                        <Check size={14} className={`mt-0.5 shrink-0 ${plan.highlight ? 'text-white' : 'text-[#1d1d1f]'}`} />
                        <span className={plan.highlight ? 'text-white/70' : 'text-[#424245]'}>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <a
                    href={plan.href}
                    className={`mt-8 flex w-full items-center justify-center gap-2 rounded-[16px] px-4 py-3 text-[13px] font-semibold transition-all active:scale-[0.98] ${plan.highlight ? 'bg-white text-[#1d1d1f] hover:bg-white/90' : 'bg-[#1d1d1f] text-white hover:bg-[#2d2d2f]'}`}
                  >
                    {plan.cta}
                    <ArrowRight size={14} />
                  </a>
                </article>
              );
            })}
          </div>

          <div className="mt-16 grid gap-4 lg:grid-cols-3">
            {[
              { icon: ShieldCheck, title: 'Controle por usuário', body: 'Cada médico tem sua própria conta, acervo e limite. O próximo passo é automatizar uso, alertas e upgrade.' },
              { icon: Zap, title: 'Cresce sem perder elegância', body: 'Comece com storage e biblioteca. Evolua para IA, tokens, cobrança automática e painel administrativo.' },
              { icon: Presentation, title: 'Valor percebido imediato', body: 'O usuário não compra apenas espaço. Ele compra clareza, memória científica e presença profissional.' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.055)]">
                  <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#1d1d1f] text-white">
                    <Icon size={19} />
                  </div>
                  <h3 className="text-[20px] font-light tracking-tight">{item.title}</h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-[#6e6e73]">{item.body}</p>
                </div>
              );
            })}
          </div>
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
                  <p className="mt-1 text-[12px] leading-relaxed text-[#86868b]">Use suas credenciais cadastradas no Supabase.</p>
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
          <div className="relative mx-auto grid w-full max-w-[900px] grid-cols-[0.88fr_1.12fr] items-center gap-10">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.06] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/62">
                <Award size={12} />
                {story.eyebrow}
              </p>
              <div key={activeStory} className="login-story-enter">
                <h2 className="text-[44px] font-extralight leading-[1.04] tracking-tight xl:text-[56px]">
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

              <div className="mt-8 grid gap-3">
                {[
                  { icon: Images, title: 'Ativos organizados', body: 'Imagens, PDFs e materiais científicos com tags, contexto e busca.' },
                  { icon: Brain, title: 'IA como assistente editorial', body: 'Indexação, resumos e achados principais para acelerar curadoria.' },
                  { icon: Presentation, title: 'Cases apresentáveis', body: 'Documentação clínica com modo apresentação e exportação estruturada.' },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="login-feature-card flex gap-3 rounded-[18px] border border-white/[0.08] bg-white/[0.055] p-4 backdrop-blur">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-white text-[#1d1d1f]">
                        <Icon size={17} />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-white">{item.title}</p>
                        <p className="mt-1 text-[12px] leading-relaxed text-white/48">{item.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative min-h-[620px]">
              <div className="login-product-card absolute left-0 top-8 w-[92%] rounded-[30px] border border-white/[0.10] bg-[#f7f7f5] p-5 text-[#1d1d1f] shadow-[0_36px_110px_rgba(0,0,0,0.44)]">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#86868b]">Case em preparo</p>
                    <h3 className="mt-1 text-[22px] font-light tracking-tight">{activeStory === 1 ? 'Curadoria por IA' : activeStory === 2 ? 'Apresentação clínica' : 'Reconstrução complexa'}</h3>
                  </div>
                  <div className="rounded-full bg-[#1d1d1f] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">Pronto</div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 h-44 overflow-hidden rounded-[22px] bg-[#d8dde2]">
                    <div className="login-scan h-full w-full bg-[linear-gradient(135deg,#cfd8df,#f5f2ec_48%,#aeb8bf)]" />
                  </div>
                  <div className="grid gap-2">
                    <div className="rounded-[18px] bg-white p-3 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                      <Images size={16} className="mb-5 text-[#3a7bd5]" />
                      <p className="text-[24px] font-light">{story.metric}</p>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-[#86868b]">{story.metricLabel}</p>
                    </div>
                    <div className="login-pulse-card rounded-[18px] bg-[#1d1d1f] p-3 text-white">
                      <Search size={16} className="mb-5 text-white/72" />
                      <p className="text-[24px] font-light">IA</p>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-white/42">Indexado</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    activeStory === 0
                      ? ['Contexto científico', 'Retalho local, evolução pós-operatória, evidência moderada']
                      : activeStory === 1
                        ? ['Resumo por IA', 'Título, tags e achados principais sugeridos automaticamente']
                        : ['Roteiro visual', 'Narrativa pronta para discussão clínica e apresentação'],
                    activeStory === 0
                      ? ['Achados principais', 'Boa integração tecidual e documentação longitudinal']
                      : activeStory === 1
                        ? ['Busca semântica', 'Localize materiais por tema, técnica, evidência ou descrição']
                        : ['Modo palco', 'Slides limpos com imagens, referências e ativos vinculados'],
                    activeStory === 0
                      ? ['Apresentação', '12 slides editoriais gerados para discussão clínica']
                      : activeStory === 1
                        ? ['Curadoria', 'Menos tempo catalogando, mais tempo produzindo conhecimento']
                        : ['Exportação', 'Case organizado para PDF, aula, round ou publicação'],
                  ].map(([label, value], index) => (
                    <div key={label} className="login-row-reveal rounded-[16px] border border-black/[0.05] bg-white px-4 py-3" style={{ animationDelay: `${index * 120}ms` }}>
                      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#86868b]">{label}</p>
                      <p className="mt-1 text-[12px] leading-relaxed text-[#424245]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="login-library-card absolute bottom-12 right-0 w-[66%] rounded-[26px] border border-white/[0.12] bg-white/[0.10] p-4 shadow-[0_28px_80px_rgba(0,0,0,0.36)] backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/48">Biblioteca</p>
                  <FileText size={15} className="text-white/62" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['Cirurgia', 'Artigo', 'Caso', 'Imagem', 'PDF', 'Aula'].map(label => (
                    <div key={label} className="aspect-square rounded-[16px] bg-white/[0.10] p-2">
                      <div className="mb-3 h-2 w-8 rounded-full bg-white/24" />
                      <p className="text-[10px] font-semibold text-white/70">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-[16px] bg-white px-4 py-3 text-[#1d1d1f]">
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
