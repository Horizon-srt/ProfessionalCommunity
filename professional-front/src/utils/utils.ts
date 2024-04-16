export const getToken = () => {
  return window.localStorage.getItem('pt-auth') || '';
};

export const getType = () => {
  return window.localStorage.getItem('user-type') || 'NORMAL';
};
