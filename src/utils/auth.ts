import { jwtDecode } from 'jwt-decode';

/**
 * accessToken에서 roles 정보를 가져옵니다.
 * @returns roles 배열 또는 null
 */
export const getRolesFromToken = (): string[] | null => {
  if (typeof window === 'undefined') return null;
  
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return null;
  
  try {
    const decodedToken: any = jwtDecode(accessToken);
    return decodedToken.roles || null;
  } catch (error) {
    console.error('토큰 디코딩 실패:', error);
    return null;
  }
};

/**
 * 사용자가 특정 role을 가지고 있는지 확인합니다.
 * @param role 확인할 role (예: 'ADMIN')
 * @returns role을 가지고 있으면 true, 없으면 false
 */
export const hasRole = (role: string): boolean => {
  const roles = getRolesFromToken();
  if (!roles || !Array.isArray(roles)) return false;
  return roles.includes(role);
};

/**
 * 사용자가 ADMIN 권한을 가지고 있는지 확인합니다.
 * @returns ADMIN 권한이 있으면 true, 없으면 false
 */
export const isAdmin = (): boolean => {
  return hasRole('ADMIN');
};

