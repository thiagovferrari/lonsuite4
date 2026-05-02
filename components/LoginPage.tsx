import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Award, Brain, FileText, Images, LockKeyhole, Presentation, Search, ShieldCheck } from 'lucide-react';
import { signIn } from '../services/authService';
import type { AuthUser } from '../services/authService';

interface Props {
  onLogin: (user: AuthUser) => void;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [activeStory, setActiveStory] = useState(0);

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
