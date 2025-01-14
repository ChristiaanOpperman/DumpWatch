export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode the token
        const isExpired = payload.exp * 1000 < Date.now(); // Compare expiry in milliseconds
        return !isExpired;
    } catch (e) {
        return false; // Invalid token
    }
};
