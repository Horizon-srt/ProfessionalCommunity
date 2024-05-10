import useSWR from 'swr';
import { ProvideMethod, host, port } from '@/types/data-types';
import useSWRMutation from 'swr/mutation';
import { message } from 'antd';
import { JointContent } from 'antd/es/message/interface';

const getToken = () => {
  return window.localStorage.getItem('pt-auth') || '';
};

// 适用于get请求与body参数为json类型的请求
const dataFetcher = async (url: string, method: ProvideMethod, params: any) => {
  const newParams = {
    Authorization: getToken(),
    params
  };
  // console.log(newParams, params);
  try {
    const res = await fetch(`http://${host}:${port}/${url}`, {
      method,
      headers: {
        ...(method === 'GET'
          ? {}
          : {
              'Content-Type': 'application/json',
              Authorization: newParams.Authorization
            })
      },
      body: JSON.stringify(newParams.params)
    }).then(async r => {
      const res = await r.json();
      // 这里把非预期错误状态码全拦住，保证useFetch里是成功情况+用户预期错误情况
      if (res.code === 404) {
        return Promise.reject(new Error(`${res.code}: ${res.message}`));
      }

      return res;
    });
    return res.data;
  } catch (error) {
    message.error(error?.toString() as JointContent);
  }
};

export default function useFetch(params: {
  url: string;
  method: ProvideMethod;
  params: any;
}) {
  const { url, method, params: fetchParams } = params;

  const { data, error, isLoading, mutate } = useSWR(
    [url, method, fetchParams],
    ([url, method, fetchParams]) => dataFetcher(url, method, fetchParams)
  );
  return { data, error, isLoading, mutate };
}

// 只能手动触发
export function useFetchMutation(params: {
  url: string;
  method: ProvideMethod;
  params: any;
}) {
  const { url, method, params: fetchParams } = params;

  const { data, error, trigger, isMutating } = useSWRMutation(
    [url, method, fetchParams],
    (
      [url, method, fetchParams],
      { arg }: { arg: { url: string; method: ProvideMethod; params: any } }
    ) => {
      if (arg) {
        const newUrl = arg.url;
        const newMethod = arg.method;
        const newFetchParams = arg.params;
        return dataFetcher(newUrl, newMethod, newFetchParams);
      }
      return dataFetcher(url, method, fetchParams);
    }
  );
  return { data, error, isMutating, trigger };
}
