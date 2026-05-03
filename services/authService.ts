import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  specialty?: string;
  avatarUrl?: string;
}

const AUTH_KEY = 'lon_suite_auth_v1';
const LAST_ONLINE_AUTH_KEY = 'lon_suite_last_online_auth_v1';
const AUTH_TIMEOUT_MS = 20000;
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

function createOfflineUser(email: string): AuthUser {
  const normalizedEmail = email.trim().toLowerCase();
  return {
    id: `${OFFLINE_AUTH_PREFIX}${normalizedEmail}`,
    name: normalizedEmail.split('@')[0] || 'Usuário',
    email: normalizedEmail,
  };
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  let response: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>;

  try {
    response = await withTimeout(
      supabase.auth.signInWithPassword({ email, password }),
      'O Supabase demorou para responder.',
    );
  } catch (error) {
    const isTimeout = error instanceof Error && error.message.includes('demorou');
    if (isTimeout && email.includes('@') && password.length > 0) {
      const lastOnlineUser = getLastOnlineUser(email);
      if (lastOnlineUser) {
        storeUser(lastOnlineUser);
        return lastOnlineUser;
      }
      throw new Error('O Supabase demorou para responder. Seus dados não foram apagados; tente novamente em alguns segundos.');
    }
    throw error;
  }

  const { data, error } = response;

  if (error || !data.user) {
    throw new Error('E-mail ou senha incorretos.');
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
