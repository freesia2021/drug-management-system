'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRegister } from '../../hooks/queries/auth';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: '',
    username: '',
    password: '',
    passwordConfirm: '',
    email: '',
    nickname: '',
  });
  const [errors, setErrors] = useState({
    id: '',
    username: '',
    password: '',
    passwordConfirm: '',
    email: '',
    nickname: '',
  });

  const registerMutation = useRegister();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      id: '',
      username: '',
      password: '',
      passwordConfirm: '',
      email: '',
      nickname: '',
    };
    let isValid = true;

    if (!formData.id.trim()) {
      newErrors.id = '아이디를 입력해주세요.';
      isValid = false;
    }

    if (!formData.username.trim()) {
      newErrors.username = '이름을 입력해주세요.';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
      isValid = false;
    }

    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호 확인을 입력해주세요.';
      isValid = false;
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
      isValid = false;
    }

    if (!formData.nickname.trim()) {
      newErrors.nickname = '닉네임을 입력해주세요.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await registerMutation.mutateAsync({
        id: formData.id,
        username: formData.username,
        password: formData.password,
        email: formData.email,
        nickname: formData.nickname,
      });
      
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      router.push('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              회원가입
            </h1>
            <p className="text-sm text-gray-600">독성물질 자료관리 시스템</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 아이디 */}
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">
                아이디 *
              </label>
              <input
                id="id"
                name="id"
                type="text"
                value={formData.id}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.id ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.id && <p className="mt-1 text-sm text-red-600">{errors.id}</p>}
            </div>

            {/* 이름 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                이름 *
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
            </div>

            {/* 비밀번호 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 확인 *
              </label>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                value={formData.passwordConfirm}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.passwordConfirm ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.passwordConfirm && <p className="mt-1 text-sm text-red-600">{errors.passwordConfirm}</p>}
            </div>

            {/* 이메일 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                이메일 *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* 닉네임 */}
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
                닉네임 *
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                value={formData.nickname}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.nickname ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.nickname && <p className="mt-1 text-sm text-red-600">{errors.nickname}</p>}
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full py-3 px-4 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
            >
              {registerMutation.isPending ? '가입 중...' : '회원가입'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-blue-900 transition-colors"
            >
              이미 계정이 있으신가요? 로그인하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

