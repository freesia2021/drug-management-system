// React Query 쿼리 키 관리

// 인증 관련 쿼리 키
export const authKeys = {
  all: ['auth'] as const,
  login: () => [...authKeys.all, 'login'] as const,
  refresh: () => [...authKeys.all, 'refresh'] as const,
  checkId: (userId: string) => [...authKeys.all, 'checkId', userId] as const,
};

// 게시판 관련 쿼리 키
export const boardKeys = {
  all: ['boards'] as const,
  lists: () => [...boardKeys.all, 'list'] as const,
  list: (filters?: any) => [...boardKeys.lists(), filters] as const,
  details: () => [...boardKeys.all, 'detail'] as const,
  detail: (id: number) => [...boardKeys.details(), id] as const,
  notices: (boardId: number) => [...boardKeys.all, 'notices', boardId] as const,
  search: (boardId: number, params?: any) => [...boardKeys.all, 'search', boardId, params] as const,
};

// 게시판 그룹 관련 쿼리 키
export const boardGroupKeys = {
  all: ['boardGroups'] as const,
  lists: () => [...boardGroupKeys.all, 'list'] as const,
  list: (filters?: any) => [...boardGroupKeys.lists(), filters] as const,
  details: () => [...boardGroupKeys.all, 'detail'] as const,
  detail: (id: number) => [...boardGroupKeys.details(), id] as const,
  boards: (groupId: number) => [...boardGroupKeys.all, 'boards', groupId] as const,
  articles: (groupId: number, params?: any) => [...boardGroupKeys.all, 'articles', groupId, params] as const,
  notices: (groupId: number) => [...boardGroupKeys.all, 'notices', groupId] as const,
};

// 게시글 관련 쿼리 키
export const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  list: (boardId: number, filters?: any) => [...articleKeys.lists(), boardId, filters] as const,
  details: () => [...articleKeys.all, 'detail'] as const,
  detail: (boardId: number, articleId: number) => [...articleKeys.details(), boardId, articleId] as const,
  neighbor: (boardId: number, articleId: number) => [...articleKeys.all, 'neighbor', boardId, articleId] as const,
  likers: (boardId: number, articleId: number) => [...articleKeys.all, 'likers', boardId, articleId] as const,
  commenters: (boardId: number, articleId: number) => [...articleKeys.all, 'commenters', boardId, articleId] as const,
};

// 댓글 관련 쿼리 키
export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (boardId: number, articleId: number, filters?: any) => [...commentKeys.lists(), boardId, articleId, filters] as const,
  details: () => [...commentKeys.all, 'detail'] as const,
  detail: (boardId: number, articleId: number, commentId: number) => [...commentKeys.details(), boardId, articleId, commentId] as const,
  likers: (boardId: number, articleId: number, commentId: number) => [...commentKeys.all, 'likers', boardId, articleId, commentId] as const,
};

// 사용자 관련 쿼리 키
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters?: any) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (userId: string) => [...userKeys.details(), userId] as const,
  nicknames: (userId: string) => [...userKeys.all, 'nicknames', userId] as const,
  articles: (userId: string, filters?: any) => [...userKeys.all, 'articles', userId, filters] as const,
  comments: (userId: string, filters?: any) => [...userKeys.all, 'comments', userId, filters] as const,
  myAccount: (userId: string) => [...userKeys.all, 'myAccount', userId] as const,
  myArticles: (userId: string, filters?: any) => [...userKeys.all, 'myArticles', userId, filters] as const,
  myComments: (userId: string, filters?: any) => [...userKeys.all, 'myComments', userId, filters] as const,
  myLikedArticles: (userId: string, filters?: any) => [...userKeys.all, 'myLikedArticles', userId, filters] as const,
  myLikedComments: (userId: string, filters?: any) => [...userKeys.all, 'myLikedComments', userId, filters] as const,
  myScraps: (userId: string, filters?: any) => [...userKeys.all, 'myScraps', userId, filters] as const,
  myReportedArticles: (userId: string, filters?: any) => [...userKeys.all, 'myReportedArticles', userId, filters] as const,
  myReportedComments: (userId: string, filters?: any) => [...userKeys.all, 'myReportedComments', userId, filters] as const,
};

// 메시지 관련 쿼리 키
export const messageKeys = {
  all: ['messages'] as const,
  lists: () => [...messageKeys.all, 'list'] as const,
  list: (userId: string) => [...messageKeys.lists(), userId] as const,
  conversation: (userId: string, targetUserId: string) => [...messageKeys.all, 'conversation', userId, targetUserId] as const,
};

// 메모 관련 쿼리 키
export const memoKeys = {
  all: ['memos'] as const,
  lists: () => [...memoKeys.all, 'list'] as const,
  list: (userId: string) => [...memoKeys.lists(), userId] as const,
  detail: (userId: string, targetUserId: string) => [...memoKeys.all, 'detail', userId, targetUserId] as const,
};

// 파일 관련 쿼리 키
export const fileKeys = {
  all: ['files'] as const,
  upload: (type: string) => [...fileKeys.all, 'upload', type] as const,
};
