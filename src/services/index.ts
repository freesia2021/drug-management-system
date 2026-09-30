// API 서비스 통합 export
export { api, setAuthToken, removeAuthToken, handleApiError } from './api';
export type { ApiResponse, PageResponse, PageParams } from './api';

// 인증 서비스
export { authService } from './auth';
export type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RefreshTokenRequest, 
  TokenResponse 
} from './auth';

// 게시판 서비스
export { boardsService, boardGroupsService } from './boards';
export type { 
  BoardResponse, 
  BoardGroupResponse, 
  UpdateBoardConfigRequest 
} from './boards';

// 게시글 서비스
export { articlesService } from './articles';
export type { 
  ArticleResponse, 
  CreateArticleRequest, 
  UpdateArticleRequest, 
  ArticleNeighborResponse, 
  ScrapRequest, 
  ReportRequest,
  FileResponse 
} from './articles';

// 댓글 서비스
export { commentsService } from './comments';
export type { 
  CommentResponse, 
  CreateCommentRequest, 
  UpdateCommentRequest 
} from './comments';

// 사용자 서비스
export { usersService } from './users';
export type { 
  UserResponse, 
  UpdateUserRequest, 
  NicknameHistoryResponse 
} from './users';

// 파일 서비스
export { filesService } from './files';
export type { FileUploadType } from './files';

// 메시지/메모 서비스
export { messagesService, memosService } from './messages';
export type { 
  MessageResponse, 
  SendMessageRequest, 
  MemoResponse, 
  CreateMemoRequest 
} from './messages';
