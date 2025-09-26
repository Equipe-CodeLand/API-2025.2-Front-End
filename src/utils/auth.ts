export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;

  const payload = JSON.parse(atob(token.split(".")[1]));
  const now = Date.now() / 1000;
  return !payload.exp || payload.exp > now;
}
