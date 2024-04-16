export type ProvideMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export type UserType = 'NORMAL' | 'ADMIN' | 'ENTERPRISE' | 'TOURIST';

export type ServiceType = 'FIXED' | 'ONDOOR';

export const host = '';

export const port = '';

export const userVisibility: Record<string, string[]> = {
  NORMAL: ['main', 'guide', 'service', 'ebook', 'notice'],
  ADMIN: ['main', 'guide', 'service', 'ebook', 'notice', 'review'],
  ENTERPRISE: [
    'main',
    'guide',
    'service',
    'ebook',
    'notice',
    'employment',
    'resume'
  ],
  TOURIST: ['main', 'guide', 'service', 'ebook', 'notice']
};
