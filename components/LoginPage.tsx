import React, { useState } from 'react';
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
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4">
      <div className="w-full max-w-[380px]">

        {/* Brand */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-[#1d1d1f] rounded-[18px] flex items-center justify-center mx-auto mb-5 shadow-[0_6px_24px_rgba(0,0,0,0.14)]">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M3 5.5h16M3 11h10M3 16.5h12" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-[26px] font-light tracking-tight text-[#1d1d1f]">Lon Suite</h1>
          <p className="text-[11px] text-[#86868b] mt-1 font-medium tracking-[0.12em] uppercase">Patrimônio Científico · Longecta</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[24px] p-8 shadow-[0_2px_24px_rgba(0,0,0,0.07)] border border-black/[0.05]">
          <h2 className="text-[18px] font-semibold text-[#1d1d1f] mb-1">Acessar conta</h2>
          <p className="text-[12px] text-[#aeaeb2] mb-7">Insira suas credenciais para continuar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-[#86868b] uppercase tracking-[0.15em] mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="seu@email.com"
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-[#f5f5f7] rounded-[12px] text-[14px] text-[#1d1d1f] outline-none focus:ring-2 focus:ring-black/10 transition-all placeholder:text-[#c7c7cc] border border-transparent focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#86868b] uppercase tracking-[0.15em] mb-1.5">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-[#f5f5f7] rounded-[12px] text-[14px] text-[#1d1d1f] outline-none focus:ring-2 focus:ring-black/10 transition-all placeholder:text-[#c7c7cc] border border-transparent focus:bg-white"
              />
            </div>

            {error && (
              <p className="text-[12px] text-[#ff3b30] font-medium pl-1">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-3 bg-[#1d1d1f] text-white rounded-[12px] text-[14px] font-semibold hover:bg-[#2d2d2f] active:scale-[0.98] disabled:opacity-40 transition-all shadow-[0_1px_6px_rgba(0,0,0,0.12)] flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" opacity="0.3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Entrando…
                </>
              ) : 'Entrar'}
            </button>
          </form>

          <p className="text-[11px] text-[#c7c7cc] text-center mt-7 leading-relaxed">
            Acesso somente por convite.{' '}
            <a href="mailto:suporte@longecta.com.br" className="text-[#3a7bd5] hover:underline">
              suporte@longecta.com.br
            </a>
          </p>
        </div>

        {/* Demo hint */}
        <p className="text-center text-[10px] text-[#c7c7cc] mt-5 font-mono">
          demo@longecta.com · lon2025
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
