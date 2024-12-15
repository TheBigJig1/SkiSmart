/**
 * Checks if the user is authenticated by verifying the token stored in localStorage.
 * 
 * @returns {boolean} - Returns true if the token is valid and not expired, otherwise false.
 */
export function isAuthenticated(): boolean {
    // Check if token is stored in localStorage
    const token = localStorage.getItem('token') || '';
    if (!token){
        return false;
    }

    // Decode the tokn - if its expired, remove it from localStorage
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