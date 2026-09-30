import { api } from './api';
import { FileResponse } from './articles';

// 파일 업로드 타입
export type FileUploadType = 'article' | 'profile' | 'comment';

// 파일 API 서비스
export const filesService = {
  // 파일 업로드
  uploadFiles: async (
    type: FileUploadType,
    files: FileList | File[]
  ): Promise<FileResponse[]> => {
    const formData = new FormData();
    
    // FileList인 경우 Array로 변환
    const fileArray = Array.from(files);
    
    fileArray.forEach((file) => {
      formData.append('files', file);
    });

    const response = await api.post(`/files/${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // 파일 다운로드 URL 생성
  getFileDownloadUrl: (filePath: string): string => {
    return `/api/orbit/files/download?path=${encodeURIComponent(filePath)}`;
  },

  // 파일 미리보기 URL 생성  
  getFilePreviewUrl: (filePath: string): string => {
    return `/api/orbit/files/preview?path=${encodeURIComponent(filePath)}`;
  },

  // 파일 크기 포맷 함수
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // 파일 확장자 검증
  isImageFile: (fileName: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    return imageExtensions.includes(extension);
  },

  // 파일 타입 검증
  validateFileType: (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type);
  },

  // 파일 크기 검증 (MB 단위)
  validateFileSize: (file: File, maxSizeMB: number): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  },
};
