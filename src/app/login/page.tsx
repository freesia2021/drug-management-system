'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLogin } from '../../hooks/queries/auth';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    autoLogin: false,
  });
  const [errors, setErrors] = useState({
    id: '',
    password: '',
  });

  const loginMutation = useLogin();

  useEffect(() => {
    // 이미 로그인되어 있으면 메인 페이지로 리다이렉트
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken && refreshToken) {
      router.replace('/');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // 입력 시 에러 메시지 제거
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      id: '',
      password: '',
    };
    let isValid = true;

    if (!formData.id.trim()) {
      newErrors.id = '아이디를 입력해주세요.';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
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
      await loginMutation.mutateAsync(formData);
      // 로그인 성공 시 메인 페이지로 이동
      window.location.href = '/';
    } catch (error) {
      // 에러는 mutation에서 처리
      console.error('로그인 실패:', error);
      alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* 로그인 폼 */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* 타이틀 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              독성물질 자료관리 시스템
            </h1>
            <p className="text-sm text-gray-600">로그인하여 시스템을 이용하세요</p>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 아이디 입력 */}
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">
                아이디
              </label>
              <input
                id="id"
                name="id"
                type="text"
                value={formData.id}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.id ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder="아이디를 입력하세요"
              />
              {errors.id && (
                <p className="mt-1 text-sm text-red-600">{errors.id}</p>
              )}
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder="비밀번호를 입력하세요"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* 자동 로그인 체크박스 */}
            <div className="flex items-center">
              <input
                id="autoLogin"
                name="autoLogin"
                type="checkbox"
                checked={formData.autoLogin}
                onChange={handleChange}
                className="h-4 w-4 text-blue-900 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="autoLogin" className="ml-2 block text-sm text-gray-700">
                자동 로그인
              </label>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3 px-4 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* 하단 링크 */}
          <div className="mt-6 flex items-center justify-center gap-4 text-sm">
            <Link
              href="/register"
              className="text-gray-600 hover:text-blue-900 transition-colors"
            >
              회원가입
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              href="/terms"
              className="text-gray-600 hover:text-blue-900 transition-colors"
            >
              이용약관
            </Link>
          </div>

          {/* 메인으로 돌아가기 */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← 메인으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

