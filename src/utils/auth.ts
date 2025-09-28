export function setToken(token: string) {
  sessionStorage.setItem("token", token);
}

export function getToken(): string | null {
  return sessionStorage.getItem("token");
}

export function removeToken() {
  sessionStorage.removeItem("token");
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;

  const payload = JSON.parse(atob(token.split(".")[1]));
  const now = Date.now() / 1000;
  return !payload.exp || payload.exp > now;
}

export function getUserRole(): string | null {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.cargo || null;
  } catch (e) {
    console.error("Error parsing JWT token:", e);
    return null;
  }
}

export function isAdmin(): boolean {
  return getUserRole() === 'Administrador';
}