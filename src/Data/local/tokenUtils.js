export const getAccessToken = () => localStorage.getItem('access');
export const getRefreshToken = () => localStorage.getItem('refresh');

export const setToken = ({ access, refresh }) => {
  localStorage.setItem('access', access);   // ✅ fixed key
  localStorage.setItem('refresh', refresh); // ✅ this was fine
};

export  const setAccessToken = (access) => {
  localStorage.setItem('access', access);
};

export const clearTokens = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
};