import { useMutation } from '@tanstack/react-query';
import { 
  filesService,
  type FileUploadType 
} from '../../services';

// 파일 업로드
export const useUploadFiles = () => {
  return useMutation({
    mutationFn: ({ type, files }: { type: FileUploadType; files: FileList | File[] }) =>
      filesService.uploadFiles(type, files),
    onError: (error) => {
      console.error('File upload failed:', error);
    },
  });
};

// 파일 유틸리티 훅
export const useFileUtils = () => {
  return {
    getDownloadUrl: filesService.getFileDownloadUrl,
    getPreviewUrl: filesService.getFilePreviewUrl,
    formatFileSize: filesService.formatFileSize,
    isImageFile: filesService.isImageFile,
    validateFileType: filesService.validateFileType,
    validateFileSize: filesService.validateFileSize,
  };
};

// 이미지 파일 업로드 전용 훅
export const useUploadImages = () => {
  return useMutation({
    mutationFn: ({ type, files }: { type: FileUploadType; files: FileList | File[] }) => {
      // 이미지 파일만 필터링
      const imageFiles = Array.from(files).filter(file => 
        filesService.isImageFile(file.name)
      );
      
      if (imageFiles.length === 0) {
        throw new Error('이미지 파일만 업로드 가능합니다.');
      }
      
      return filesService.uploadFiles(type, imageFiles);
    },
    onError: (error) => {
      console.error('Image upload failed:', error);
    },
  });
};

// 프로필 이미지 업로드 전용 훅
export const useUploadProfileImage = () => {
  return useMutation({
    mutationFn: (file: File) => {
      // 파일 크기 제한 (5MB)
      if (!filesService.validateFileSize(file, 5)) {
        throw new Error('파일 크기는 5MB 이하여야 합니다.');
      }
      
      // 이미지 파일 타입 검증
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!filesService.validateFileType(file, allowedTypes)) {
        throw new Error('JPG, PNG, GIF, WebP 형식의 이미지만 업로드 가능합니다.');
      }
      
      return filesService.uploadFiles('profile', [file]);
    },
    onError: (error) => {
      console.error('Profile image upload failed:', error);
    },
  });
};

// 게시글 첨부파일 업로드 전용 훅
export const useUploadArticleFiles = () => {
  return useMutation({
    mutationFn: (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      
      // 파일 개수 제한 (최대 10개)
      if (fileArray.length > 10) {
        throw new Error('최대 10개의 파일까지 업로드 가능합니다.');
      }
      
      // 각 파일 크기 제한 (10MB)
      const oversizedFiles = fileArray.filter(file => 
        !filesService.validateFileSize(file, 10)
      );
      
      if (oversizedFiles.length > 0) {
        throw new Error('각 파일의 크기는 10MB 이하여야 합니다.');
      }
      
      return filesService.uploadFiles('article', fileArray);
    },
    onError: (error) => {
      console.error('Article file upload failed:', error);
    },
  });
};
