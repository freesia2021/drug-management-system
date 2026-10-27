'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useLogin } from '../../hooks/queries/auth';
import { BrandEmblem } from '../../components/brand/BrandLogo';

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

  const inputClass = (hasError: boolean) =>
    `w-full h-[52px] pl-11 pr-4 rounded border ${
      hasError ? 'border-red-500' : 'border-[#c3ccd9]'
    } bg-white text-[15px] text-ink placeholder-gray-400 focus:outline-none focus:border-royal focus:ring-4 focus:ring-royal/10 transition`;

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr] bg-white">
      {/* 브랜드 패널 */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-navy-deep p-14 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: "url('/images/배너1.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1b45]/95 via-[#15295f]/85 to-[#1d3994]/70" />
        <div className="relative flex items-center gap-3">
          <BrandEmblem className="w-11 h-11" light />
          <div className="leading-tight">
            <p className="text-xs text-blue-200">법과학연구센터</p>
            <p className="text-xl font-bold">독성물질 자료관리 시스템</p>
          </div>
        </div>
        <div className="relative">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-200">Forensic Toxicology Data System</p>
          <h2 className="mt-4 text-[38px] font-bold leading-[1.3] tracking-tight">
            연구의 시작부터 성과까지,
            <br />
            안전하고 체계적으로.
          </h2>
          <ul className="mt-8 space-y-3 text-[15px] text-white/80">
            {['연구일지 작성 및 승인 관리', '시료·분석자료 통합 관리', '연구성과 및 발간자료 공유'].map((text) => (
              <li key={text} className="flex items-center gap-3">
                <CheckCircleIcon className="w-5 h-5 text-[#8fb2ff]" />
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-white/40">본 시스템은 인가된 사용자만 이용할 수 있습니다.</p>
      </aside>

      {/* 로그인 폼 */}
      <main className="flex items-center justify-center px-6 py-16 bg-surface lg:bg-white">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <BrandEmblem className="w-10 h-10" />
            <p className="text-lg font-bold text-navy">독성물질 자료관리 시스템</p>
          </div>

          <h1 className="text-[30px] font-bold text-ink tracking-tight">로그인</h1>
          <p className="mt-2 text-[15px] text-gray-500">아이디와 비밀번호를 입력하여 시스템에 접속하세요.</p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-5" noValidate>
            {/* 아이디 입력 */}
            <div>
              <label htmlFor="id" className="block mb-2 text-sm font-semibold text-gray-700">아이디</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="id"
                  name="id"
                  type="text"
                  autoComplete="username"
                  value={formData.id}
                  onChange={handleChange}
                  className={inputClass(!!errors.id)}
                  placeholder="아이디를 입력하세요"
                />
              </div>
              {errors.id && <p className="mt-1.5 text-sm text-red-600">{errors.id}</p>}
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-semibold text-gray-700">비밀번호</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass(!!errors.password)}
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
              {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* 자동 로그인 체크박스 */}
            <label htmlFor="autoLogin" className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input
                id="autoLogin"
                name="autoLogin"
                type="checkbox"
                checked={formData.autoLogin}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-navy focus:ring-royal"
              />
              자동 로그인
            </label>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-[52px] rounded bg-navy text-base font-semibold text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-royal/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* 하단 링크 */}
          <div className="mt-8 pt-6 border-t border-line flex items-center justify-between text-sm">
            <span className="text-gray-500">
              계정이 없으신가요?{' '}
              <Link href="/register" className="font-semibold text-royal hover:underline underline-offset-4">회원가입</Link>
            </span>
            <Link href="/terms" className="text-gray-500 hover:text-navy">이용약관</Link>
          </div>

          <button
            onClick={() => router.push('/')}
            className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← 메인으로 돌아가기
          </button>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;

