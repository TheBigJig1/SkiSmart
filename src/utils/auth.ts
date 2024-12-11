export function isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
  
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000;
    return Date.now() < expiry;
  }