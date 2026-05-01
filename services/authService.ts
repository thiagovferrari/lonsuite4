import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

const AUTH_KEY = 'lon_suite_auth_v1';

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
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

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

  await supabase.from('profiles').upsert({
    id: authUser.id,
    auth_user_id: data.user.id,
    name: authUser.name,
    email: authUser.email,
  });

  storeUser(authUser);
  return authUser;
}

export function signOut(): void {
  supabase.auth.signOut();
  clearStoredUser();
}
