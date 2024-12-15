/**
 * Checks if the user is authenticated by verifying the presence and validity of a token in localStorage.
 * 
 * @returns {boolean} - Returns true if the user is authenticated, otherwise false.
 */

export function isAuthenticated(): boolean {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token') || '';

    // If the token is not present, return false
    if (!token){
        return false;
    }

    try {
        // Decode the token
        const payload = JSON.parse(atob(token.split('.')[1]));

        // Get the expiry time of the token converting the seconds to milliseconds
        const expiry = payload.exp * 1000;

        // Check if the token is expired
        if(Date.now() < expiry) {
            return true;
        } else {
            // If the token is expired, remove it from localStorage
            localStorage.removeItem('token');
            return false;
        }
      } catch (e) {
        // If there's an error, the token is invalid
        console.error('Invalid token:', e);
        return false;
      }
  }