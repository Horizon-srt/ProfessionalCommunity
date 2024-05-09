'use client';
import React, { useEffect, useState } from 'react';
import style from '@/app/login/styles/style.module.css';
import { Button, Form, Input } from 'antd';
import Image from 'next/image';
import useFetch, { useFetchMutation } from '@/services/use-fetch';
import router from 'next/router';
import { ProvideMethod } from '@/types/data-types';
import { useStore } from '@/hooks/useStore';

const Login: React.FC = () => {
  const [pageState, setPageState] = useState('login');
  const defaultLoginParams = {
    url: '/login',
    method: 'POST' as ProvideMethod,
    params: null
  };
  const {
    data,
    error,
    trigger: login,
    isMutate
  } = useFetchMutation(defaultLoginParams);

  const defaultRegisterParams = {
    url: '/register/normal',
    method: 'POST' as ProvideMethod,
    params: null
  };
  const {
    data: registerData,
    error: registerError,
    trigger: register,
    isMutate: registerIsMutate
  } = useFetchMutation(defaultRegisterParams);

  const onFinish = async (values: any) => {
    if (pageState === 'login') {
      login({ ...defaultLoginParams, params: values });
    } else {
      // 记得改下
      // setFetchParam({
      //   url: '/register/normal',
      //   method: 'POST',
      //   params: values
      // });
      register({ ...defaultRegisterParams, params: values });
    }
  };

  const setUserType = useStore(state => state.setUserType);

  useEffect(() => {
    if (data && data.jwt) {
      window.localStorage.setItem('pt-auth', data.jwt);
      window.localStorage.setItem('user-type', data.userType);
      setUserType(data.userType);
      window.localStorage.setItem('user-id', data.uid);
      router.push(`/${data.userType.toLowerCase()}`);
    } else {
      console.log(error);
    }
  }, [data, error]);

  const onFinishFailed = (e: any) => {
    console.log(e);
  };

  // const userType = useStore(state => state.userType);

  const LoginForm: React.FC = () => {
    return (
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className={style.rectangleContent}
      >
        <div className={style.loginFont}>Login</div>
        <div className={style.inputArea}>
          <Form.Item
            name='account'
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              className={style.inputStyle}
              placeholder={'Username/e-mail/phone'}
            />
          </Form.Item>
          <Form.Item
            name='password'
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              className={style.inputStyle}
              placeholder={'Password'}
            />
          </Form.Item>
        </div>
        <Form.Item style={{ width: '100%' }}>
          <Button className={style.buttonStyle} htmlType='submit'>
            Login
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const RegisterForm: React.FC = () => {
    return (
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className={style.rectangleContent}
      >
        <div className={style.loginFont}>Register</div>
        <div className={style.inputArea}>
          <Form.Item
            name='name'
            rules={[
              {
                required: true,
                message: 'Please input your username!',
                max: 120
              }
            ]}
          >
            <Input className={style.inputStyle} placeholder={'Name'} />
          </Form.Item>
          <Form.Item
            name='password'
            rules={[
              { required: true, message: 'Please input your username!', len: 6 }
            ]}
          >
            <Input.Password
              className={style.inputStyle}
              placeholder={'Password'}
            />
          </Form.Item>
          <Form.Item
            name='email'
            rules={[
              {
                required: true,
                message: 'Please input your username!',
                type: 'email'
              }
            ]}
          >
            <Input className={style.inputStyle} placeholder={'Email'} />
          </Form.Item>
          <Form.Item
            name='phone'
            rules={[
              {
                required: true,
                message: 'Please input your username!'
                // type: 'number'
              }
            ]}
          >
            <Input className={style.inputStyle} placeholder={'Phone'} />
          </Form.Item>
          <Form.Item
            name='building'
            rules={[
              {
                required: true,
                message: 'Please input your username!',
                // type: 'number',
                len: 10
              }
            ]}
          >
            <Input className={style.inputStyle} placeholder={'Building'} />
          </Form.Item>
          <Form.Item
            name='unit'
            rules={[
              {
                required: true,
                message: 'Please input your username!',
                // type: 'number',
                len: 10
              }
            ]}
          >
            <Input className={style.inputStyle} placeholder={'Unit'} />
          </Form.Item>
          <Form.Item
            name='room'
            rules={[
              {
                required: true,
                message: 'Please input your username!',
                // type: 'number',
                len: 10
              }
            ]}
          >
            <Input className={style.inputStyle} placeholder={'Room'} />
          </Form.Item>
        </div>
        <Form.Item style={{ width: '100%' }}>
          <Button className={style.buttonStyle} htmlType='submit'>
            Register
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const doAnimation = function (flag: string) {
    document.styleSheets[0].insertRule(
      `@keyframes toRight {
        0% {
          transform: translateX(0%);
        }
        100% {
          transform: translateX(100%);
        }
      }`
    );
    document.styleSheets[0].insertRule(
      `@keyframes toLeft {
        0% {
          transform: translateX(0%);
        }
        100% {
          transform: translateX(-100%);
        }
      }`
    );
    const formPart = document.getElementById('formPart') as HTMLElement;
    const infoPart = document.getElementById('infoPart') as HTMLElement;
    if (flag === 'login') {
      formPart.style.animation = 'toLeft 0.5s linear';
      infoPart.style.animation = 'toRight 0.5s linear';
      setTimeout(() => {
        setPageState('login');
        formPart.style.removeProperty('animation');
        infoPart.style.removeProperty('animation');
      }, 500);
    } else {
      formPart.style.animation = 'toRight 0.5s linear';
      infoPart.style.animation = 'toLeft 0.5s linear';
      setTimeout(() => {
        setPageState('register');
        formPart.style.removeProperty('animation');
        infoPart.style.removeProperty('animation');
      }, 500);
    }
  };

  const LoginArea: React.FC = () => {
    return (
      <div className={style.registerArea}>
        <div className={style.tips}>already have an account?</div>
        <Button
          type='link'
          style={{ color: '#16A609' }}
          onClick={() => {
            doAnimation('login');
          }}
        >
          {'Login >'}
        </Button>
      </div>
    );
  };

  const RegisterArea: React.FC = () => {
    return (
      <div className={style.registerArea}>
        <div className={style.tips}>no account?</div>
        <Button
          type='link'
          style={{ color: '#16A609' }}
          onClick={() => {
            doAnimation('register');
          }}
        >
          {'< Register'}
        </Button>
      </div>
    );
  };

  return (
    <div className={style.page}>
      <div className={style.background}>
        {pageState === 'login' ? (
          <>
            <div id='formPart' className={style.rectangle}>
              <LoginForm />
            </div>
            <div id='infoPart' className={style.welcomeArea}>
              <div className={style.rectangleContent}>
                <div className={style.welcome}>Welcome to</div>
                <div className={style.welcome}>Green Life community</div>
                <Image src='/complogo.svg' alt='' width='250' height='250' />
                <RegisterArea />
              </div>
            </div>
          </>
        ) : (
          <>
            <div id='infoPart' className={style.welcomeArea}>
              <div className={style.rectangleContent}>
                <div className={style.welcome}>Welcome to</div>
                <div className={style.welcome}>Green Life community</div>
                <Image src='/complogo.svg' alt='' width='250' height='250' />
                <LoginArea />
              </div>
            </div>
            <div id='formPart' className={style.rectangle}>
              <RegisterForm />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
