// Lon Suite — Auth Service (mock until Supabase Auth is wired)

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface MockUser extends AuthUser {
  password: string;
}

const MOCK_USERS: MockUser[] = [
  { id: 'user-demo-001', name: 'Dr. Demo Longecta', email: 'demo@longecta.com', password: 'lon2025' },
];

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
  await new Promise(r => setTimeout(r, 500));
  const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) throw new Error('E-mail ou senha incorretos.');
  const authUser: AuthUser = { id: user.id, name: user.name, email: user.email };
  storeUser(authUser);
  return authUser;
}

export function signOut(): void {
  clearStoredUser();
}
