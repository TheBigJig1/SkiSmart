export function isAuthenticated(): boolean {
    const token = localStorage.getItem('token') || '';
    if (!token){
        return false;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp * 1000; // Convert expiry to milliseconds
        if(Date.now() < expiry) {
            return true;
        } else {
            localStorage.removeItem('token');
            return false;
        }
      } catch (e) {
        console.error('Invalid token:', e);
        return false;
      }
  }