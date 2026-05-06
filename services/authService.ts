import { isSupabaseConfigured, supabase } from './supabase';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  specialty?: string;
  avatarUrl?: string;
}

const AUTH_KEY = 'lon_suite_auth_v1';
const LAST_ONLINE_AUTH_KEY = 'lon_suite_last_online_auth_v1';
const AUTH_TIMEOUT_MS = 15000;
const OFFLINE_AUTH_PREFIX = 'offline:';

async function withTimeout<T>(promise: Promise<T>, message: string): Promise<T> {
  let timeoutId: number | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(message)), AUTH_TIMEOUT_MS);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) window.clearTimeout(timeoutId);
  }
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function storeUser(user: AuthUser): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  if (!user.id.startsWith(OFFLINE_AUTH_PREFIX)) {
    localStorage.setItem(LAST_ONLINE_AUTH_KEY, JSON.stringify(user));
  }
}

function storeLastOnlineUser(user: AuthUser): void {
  localStorage.setItem(LAST_ONLINE_AUTH_KEY, JSON.stringify(user));
}

function getLastOnlineUser(email: string): AuthUser | null {
  try {
    const raw = localStorage.getItem(LAST_ONLINE_AUTH_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as AuthUser;
    return user.email.trim().toLowerCase() === email.trim().toLowerCase() ? user : null;
  } catch {
    return null;
  }
}

export function clearStoredUser(): void {
  localStorage.removeItem(AUTH_KEY);
}

function isNetworkAuthError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes('demorou') ||
    message.includes('failed to fetch') ||
    message.includes('load failed') ||
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('522')
  );
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado. Confira VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
  }

  let response: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>;

  try {
    response = await withTimeout(
      supabase.auth.signInWithPassword({ email, password }),
      'O Supabase demorou para responder.',
    );
  } catch (error) {
    if (isNetworkAuthError(error) && email.includes('@') && password.length > 0) {
      const lastOnlineUser = getLastOnlineUser(email);
      if (lastOnlineUser) {
        storeUser(lastOnlineUser);
        return lastOnlineUser;
      }
      throw new Error('O Supabase está indisponível neste momento. O projeto respondeu com timeout; tente novamente em alguns minutos.');
    }
    throw error;
  }

  const { data, error } = response;

  if (error || !data.user) {
    const rawMessage = error?.message?.toLowerCase() ?? '';
    if (rawMessage.includes('email not confirmed')) {
      throw new Error('Este e-mail ainda não foi confirmado no Supabase Auth.');
    }
    if (rawMessage.includes('too many requests')) {
      throw new Error('Muitas tentativas seguidas. Aguarde alguns minutos e tente novamente.');
    }
    if (rawMessage.includes('invalid login credentials')) {
      throw new Error('E-mail ou senha incorretos.');
    }
    throw new Error(error?.message || 'Não consegui autenticar no Supabase agora.');
  }

  const metadataName =
    typeof data.user.user_metadata?.name === 'string' ? data.user.user_metadata.name :
    typeof data.user.user_metadata?.full_name === 'string' ? data.user.user_metadata.full_name :
    email.split('@')[0];

  const authUser: AuthUser = {
    id: data.user.id,
    name: metadataName,
    email: data.user.email ?? email,
  };

  try {
    const { data: profile } = await withTimeout(
      supabase.from('profiles').select('name,email,specialty,avatar_url').eq('id', authUser.id).maybeSingle(),
      'Perfil demorou para carregar.',
    );
    if (profile) {
      authUser.name = typeof profile.name === 'string' && profile.name.trim() ? profile.name : authUser.name;
      authUser.email = typeof profile.email === 'string' && profile.email.trim() ? profile.email : authUser.email;
      authUser.specialty = typeof profile.specialty === 'string' ? profile.specialty : undefined;
      authUser.avatarUrl = typeof profile.avatar_url === 'string' ? profile.avatar_url : undefined;
    }
  } catch (error) {
    console.warn('[Lon Suite] Perfil não carregado no login:', error);
  }

  withTimeout(
    supabase.from('profiles').upsert({
      id: authUser.id,
      auth_user_id: data.user.id,
      name: authUser.name,
      email: authUser.email,
      specialty: authUser.specialty,
      avatar_url: authUser.avatarUrl,
    }),
    'Perfil demorou para sincronizar.',
  ).catch(error => {
    console.warn('[Lon Suite] Perfil não sincronizado no login:', error);
  });

  storeUser(authUser);
  storeLastOnlineUser(authUser);
  return authUser;
}

export function signOut(): void {
  supabase.auth.signOut();
  clearStoredUser();
}
