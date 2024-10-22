import { GetProp, UploadProps, message } from 'antd';
import dayjs from 'dayjs';

export const getToken = () => {
  return localStorage.getItem('pt-auth') || '';
};

export const getType = () => {
  return localStorage.getItem('user-type') || 'TOURIST';
};

export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};
export const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  return isJpgOrPng;
};

export const getAntdFormErrorMessage = (e: any) => {
  let errorMsg = '';

  e.errorFields.forEach((error: any) => {
    errorMsg = errorMsg + error.errors[0] + '\n';
  });

  return errorMsg;
};

export const toStatus = (startTime: string, endTime: string) => {
  if (dayjs().isBefore(dayjs(startTime))) {
    return 1;
  }
  if (dayjs().isAfter(dayjs(endTime))) {
    return 2;
  }
  return 0;
};
