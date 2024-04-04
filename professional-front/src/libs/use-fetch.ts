import useSWR from 'swr';
import { ProvideMethod } from '@/utils/data-types';

const getToken = () => {
  return window.localStorage.getItem('pt-auth') || '';
};

// 适用于get请求与body参数为json类型的请求
const dataFetcher = async (url: string, method: ProvideMethod, params: any) => {
  const newParams = {
    Authorization: getToken(),
    params
  };
  const res = await fetch(url, {
    method,
    headers: {
      ...
      method === 'GET' ? {} : {
        'Content-Type': 'application/json',
        body: JSON.stringify(newParams)
      }
    }
  }).then(async(r) => {
    const res = await r.json();
    // 这里把非预期错误状态码全拦住，保证useFetch里是成功情况+用户预期错误情况
    if (res.code === 404) {
      return Promise.reject(new Error(`${res.code}: ${res.message}`));
    }
    return res;
  }).catch(e => {
    throw e;
  });
  return res;
};

export default function useFetch(params: {
  url: string,
  method: ProvideMethod,
  params: any
}) {
  const { url, method, params:fetchParams } = params;
  const { data, error, isLoading, mutate } = useSWR(
    [url, method, fetchParams],
    ([url, method, fetchParams]) => dataFetcher(url, method, fetchParams)
  );
  return { data, error, isLoading, mutate };
}