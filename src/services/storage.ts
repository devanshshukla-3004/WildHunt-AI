const KEY = "wildhunt.session.v1";

export function saveSession<T>(session: T): void {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function loadSession<T>(): T | null {
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as T) : null;
}

export function clearSession(): void {
  localStorage.removeItem(KEY);
}