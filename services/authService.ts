import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

const AUTH_KEY = 'lon_suite_auth_v1';
const AUTH_TIMEOUT_MS = 12000;

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
}

export function clearStoredUser(): void {
  localStorage.removeItem(AUTH_KEY);
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await withTimeout(
    supabase.auth.signInWithPassword({ email, password }),
    'O Supabase demorou para responder. Verifique a conexão e tente novamente.',
  );

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

  withTimeout(
    supabase.from('profiles').upsert({
      id: authUser.id,
      auth_user_id: data.user.id,
      name: authUser.name,
      email: authUser.email,
    }),
    'Perfil demorou para sincronizar.',
  ).catch(error => {
    console.warn('[Lon Suite] Perfil não sincronizado no login:', error);
  });

  storeUser(authUser);
  return authUser;
}

export function signOut(): void {
  supabase.auth.signOut();
  clearStoredUser();
}
