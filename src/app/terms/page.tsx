'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const TermsPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              이용약관
            </h1>
            <p className="text-sm text-gray-600">독성물질 자료관리 시스템</p>
          </div>

          <div className="prose prose-sm max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">제1조 (목적)</h2>
              <p className="text-gray-700 leading-relaxed">
                본 약관은 독성물질 자료관리 시스템(이하 &quot;시스템&quot;)이 제공하는 서비스의 이용과 관련하여 
                시스템과 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">제2조 (용어의 정의)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>&quot;시스템&quot;이란 독성물질 자료관리 시스템을 의미합니다.</li>
                <li>&quot;회원&quot;이란 시스템에 개인정보를 제공하여 회원등록을 한 자로서, 시스템의 정보를 지속적으로 제공받으며, 시스템이 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</li>
                <li>&quot;아이디(ID)&quot;란 회원의 식별과 서비스 이용을 위하여 회원이 정하고 시스템이 승인하는 문자와 숫자의 조합을 의미합니다.</li>
                <li>&quot;비밀번호&quot;란 회원이 부여받은 아이디와 일치되는 회원임을 확인하고 비밀보호를 위해 회원 자신이 정한 문자 또는 숫자의 조합을 의미합니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">제3조 (이용계약의 성립)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>이용계약은 이용자가 본 약관 내용에 동의를 한 다음 회원가입 신청을 하고 시스템이 이러한 신청에 대하여 승낙함으로써 체결됩니다.</li>
                <li>시스템은 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다.
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>가입신청자가 본 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                    <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                    <li>허위의 정보를 기재하거나, 시스템이 제시하는 내용을 기재하지 않은 경우</li>
                    <li>기타 회원으로 등록하는 것이 시스템의 기술상 현저히 지장이 있다고 판단되는 경우</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">제4조 (서비스의 제공 및 변경)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>시스템은 다음과 같은 서비스를 제공합니다.
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>마약재료 연구 정보 제공</li>
                    <li>연구 활동 관리 및 기록</li>
                    <li>연구성과 및 연구보고서 제공</li>
                    <li>기타 시스템이 정하는 서비스</li>
                  </ul>
                </li>
                <li>시스템은 그 변경될 서비스의 내용 및 제공일자를 제7조에서 정한 방법으로 이용자에게 통지하고, 제1항에 정한 서비스를 변경하여 제공할 수 있습니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">제5조 (개인정보의 보호)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>시스템은 관계법령이 정하는 바에 따라 이용자 등록정보를 포함한 이용자의 개인정보를 보호하기 위해 노력합니다.</li>
                <li>이용자의 개인정보보호에 관해서는 관련법령 및 시스템이 정하는 &quot;개인정보처리방침&quot;에 정한 바에 의합니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">제6조 (회원의 의무)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>회원은 다음 행위를 하여서는 안 됩니다.
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>신청 또는 변경 시 허위내용의 등록</li>
                    <li>타인의 정보 도용</li>
                    <li>시스템에 게시된 정보의 변경</li>
                    <li>시스템이 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                    <li>시스템 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                    <li>시스템 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                    <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 시스템에 공개 또는 게시하는 행위</li>
                  </ul>
                </li>
              </ol>
            </section>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
            >
              로그인 페이지로
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
            >
              메인으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;

