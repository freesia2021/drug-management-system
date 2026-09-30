// 네비게이션 관련 타입
export interface NavItem {
  id: string;
  label: string;
  isActive?: boolean;
  href?: string;
}

// 검색 관련 타입
export interface SearchState {
  query: string;
  isFocused: boolean;
}

// 메뉴 아이템 타입
export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

// 공지사항 관련 타입
export interface NoticeItem {
  id: string;
  title: string;
  date: string;
  category: NoticeCategory;
}

export type NoticeCategory = '연구승인' | '연구일지' | '연구성과' | '센터소식';

// 뉴스/배너 관련 타입
export interface NewsItem {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  isMain?: boolean;
}

// 푸터 관련 타입
export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterButton {
  label: string;
  icon?: string;
  arrow?: boolean;
  onClick: () => void;
}

// API 응답 타입
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// 페이지네이션 타입
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 연구승인 관련 타입
export interface ResearchProject {
  id: string;
  title: string;
  type: ResearchType;
  description: string;
  status: ResearchStatus;
  startDate: string;
  endDate: string;
  researcher: string;
  organization: string;
}

export type ResearchType = '지정과제' | '자유과제' | '기획연구' | '수탁연구';

export type ResearchStatus = '진행중' | '완료' | '예정' | '중단';

export interface ResearchReport {
  id: string;
  title: string;
  author: string;
  publishDate: string;
  category: string;
  downloadUrl: string;
  fileSize: string;
}

// 게시판 관련 타입
export interface BoardItem {
  id: string;
  number?: number;
  title: string;
  author: string;
  date: string;
  views: number;
  attachment?: boolean;
  category?: string;
  // 연구승인 관련 추가 필드
  type?: string;
  researcher?: string;
  organization?: string;
  status?: string;
  // 연구일지 관련 추가 필드
  project?: string;
  equipment?: string;
}

export interface BoardColumn {
  key: string;
  title: string;
  width?: string;
}

export interface BoardSearchOptions {
  type: string;
  options: string[];
}

// 학술세미나 타입
export interface AcademicSeminar extends BoardItem {
  description?: string;
  location?: string;
  participants?: number;
}

// 연구성과 타입
export interface Publication extends BoardItem {
  fileSize?: string;
  downloadCount?: number;
  fileType?: string;
}

// 연구일지 타입
export interface ResearchJournal extends BoardItem {
  researchType?: string;
  progress?: string;
  tags?: string[];
}

// API 관련 추가 타입들
export type FileUploadType = 'article' | 'profile' | 'comment';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED';

export type ArticleStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type FileTargetType = 'ARTICLE' | 'COMMENT' | 'STANDALONE';

// API 에러 타입
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// 페이징 관련 타입 확장
export interface PaginationMeta {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

// 검색 관련 타입
export interface SearchParams {
  keyword?: string;
  searchType?: 'title' | 'content' | 'author' | 'all';
  category?: string;
  startDate?: string;
  endDate?: string;
}

// 정렬 관련 타입
export type SortDirection = 'asc' | 'desc';

export interface SortOption {
  field: string;
  direction: SortDirection;
}

// 필터 관련 타입
export interface FilterOption {
  key: string;
  value: string | number | boolean;
  operator?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith';
}

// 게시글 상세 관련 타입
export interface ArticleDetail {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  views: number;
  attachments?: ArticleAttachment[];
  prevArticle?: ArticleNeighbor;
  nextArticle?: ArticleNeighbor;
  // 연구일지 메타데이터 (선택 필드)
  organization?: string;
  projectName?: string;
  period?: string;
  project?: string;
  equipment?: string;
  department?: string;
  researcher?: string;
}

export interface ArticleAttachment {
  id: string;
  filename: string;
  size?: string;
  url: string;
  targetType?: string; // 파일 다운로드용 (ARTICLE, COMMENT 등)
}

export interface ArticleNeighbor {
  id: string;
  title: string;
}
