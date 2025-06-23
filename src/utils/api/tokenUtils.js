export const getAccessToken = () => localStorage.getItem('access');
export const getRefreshToken = () => localStorage.getItem('refresh');

export const setToken =({acces,refresh}) =>{
    localStorage.setItem('acces',acces);
    localStorage.setItem('refresh',refresh)
}

export  const setAccessToken = (access) => {
  localStorage.setItem('access', access);
};

export const clearTokens = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
};