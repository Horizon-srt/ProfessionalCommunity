export type ProvideMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export type UserType = 'NORMAL' | 'ADMIN' | 'ENTERPRISE' | 'TOURIST';

export type ServiceType = 'FIXED' | 'ONDOOR';

// For development
export const host = '127.0.0.1';
export const port = '5000';

// For deployment
// export const host = 'csi6220-4-vm2.ucd.ie';
// export const port = '80';

export const userVisibility: Record<string, string[]> = {
  NORMAL: [
    'main',
    'guide',
    'service',
    'ebook',
    'notice',
    'family',
    'employment'
  ],
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

export const defaultImageCarousel = [
  '/default_image1.jpg',
  '/default_image2.jpg',
  '/default_image3.jpg',
  '/default_image4.jpg'
];

export enum ResourceType {
  WATER,
  ELETRIC,
  GAS
}

export enum RecruitmentStatus {
  APPROVED,
  NOTAPPROVED,
  APPROVING
}
