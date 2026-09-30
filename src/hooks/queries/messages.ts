import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  messagesService, 
  memosService,
  type SendMessageRequest, 
  type CreateMemoRequest 
} from '../../services';
import { messageKeys, memoKeys } from './queryKeys';

// === 메시지 관련 훅들 ===

// 쪽지 목록 조회
export const useMessages = (userId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: messageKeys.list(userId),
    queryFn: () => messagesService.getMessages(userId),
    enabled: enabled && !!userId,
    staleTime: 1000 * 30, // 30초간 fresh
  });
};

// 특정 사용자와의 쪽지 목록 조회
export const useMessagesWithTarget = (
  userId: string,
  targetUserId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: messageKeys.conversation(userId, targetUserId),
    queryFn: () => messagesService.getMessagesWithTarget(userId, targetUserId),
    enabled: enabled && !!userId && !!targetUserId,
    staleTime: 1000 * 30, // 30초간 fresh
  });
};

// 쪽지 보내기
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      userId, 
      targetUserId, 
      data 
    }: { 
      userId: string; 
      targetUserId: string; 
      data: SendMessageRequest;
    }) => messagesService.sendMessage(userId, targetUserId, data),
    onSuccess: (data, variables) => {
      // 쪽지 목록 무효화
      queryClient.invalidateQueries({ 
        queryKey: messageKeys.list(variables.userId)
      });
      queryClient.invalidateQueries({ 
        queryKey: messageKeys.list(variables.targetUserId)
      });
      
      // 해당 대화 무효화
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversation(variables.userId, variables.targetUserId)
      });
    },
  });
};

// 특정 사용자와의 쪽지 삭제
export const useDeleteMessages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, targetUserId }: { userId: string; targetUserId: string }) =>
      messagesService.deleteMessages(userId, targetUserId),
    onSuccess: (data, variables) => {
      // 쪽지 목록 무효화
      queryClient.invalidateQueries({ 
        queryKey: messageKeys.list(variables.userId)
      });
      
      // 해당 대화 캐시 제거
      queryClient.removeQueries({
        queryKey: messageKeys.conversation(variables.userId, variables.targetUserId)
      });
    },
  });
};

// === 메모 관련 훅들 ===

// 메모 목록 조회
export const useMemos = (userId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: memoKeys.list(userId),
    queryFn: () => memosService.getMemos(userId),
    enabled: enabled && !!userId,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
  });
};

// 메모 저장
export const useCreateMemo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      userId, 
      targetUserId, 
      data 
    }: { 
      userId: string; 
      targetUserId: string; 
      data: CreateMemoRequest;
    }) => memosService.createMemo(userId, targetUserId, data),
    onSuccess: (data, variables) => {
      // 메모 목록 무효화
      queryClient.invalidateQueries({ 
        queryKey: memoKeys.list(variables.userId)
      });
      
      // 특정 메모 캐시 업데이트
      queryClient.setQueryData(
        memoKeys.detail(variables.userId, variables.targetUserId),
        data
      );
    },
  });
};

// 메모 수정
export const useUpdateMemo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      userId, 
      targetUserId, 
      data 
    }: { 
      userId: string; 
      targetUserId: string; 
      data: CreateMemoRequest;
    }) => memosService.updateMemo(userId, targetUserId, data),
    onSuccess: (data, variables) => {
      // 메모 목록 무효화
      queryClient.invalidateQueries({ 
        queryKey: memoKeys.list(variables.userId)
      });
      
      // 특정 메모 캐시 업데이트
      queryClient.setQueryData(
        memoKeys.detail(variables.userId, variables.targetUserId),
        data
      );
    },
  });
};

// 메모 삭제
export const useDeleteMemo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, targetUserId }: { userId: string; targetUserId: string }) =>
      memosService.deleteMemo(userId, targetUserId),
    onSuccess: (data, variables) => {
      // 메모 목록 무효화
      queryClient.invalidateQueries({ 
        queryKey: memoKeys.list(variables.userId)
      });
      
      // 특정 메모 캐시 제거
      queryClient.removeQueries({
        queryKey: memoKeys.detail(variables.userId, variables.targetUserId)
      });
    },
  });
};
