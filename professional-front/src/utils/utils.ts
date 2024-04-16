export const getToken = () => {
  return localStorage.getItem('pt-auth') || '';
};

export const getType = () => {
  return localStorage.getItem('user-type') || 'NORMAL';
};
