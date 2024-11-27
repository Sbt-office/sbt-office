import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserInfoFetch } from "@/utils/api";
import { useToast } from "./useToast";
import useAdminStore from "@/store/adminStore";
import { QueryKeys } from "../queryClient";

export const useUpdatePersonnel = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const storedSabeon = useAdminStore((state) => state.sabeon);
  const isAdmin = useAdminStore((state) => state.isAdmin);

  return useMutation({
    mutationFn: (updateData) => {
      const sabeon = isAdmin === "Y" ? updateData.sabeon : storedSabeon;

      return updateUserInfoFetch({
        sabeon,
        username: updateData.username,
        seat_cd: updateData.seat_cd,
        team_cd: updateData.team_cd,
        team_name: updateData.team_name,
        insa_info: {
          hp: updateData.insa_info.hp,
          level: updateData.insa_info.level,
          profile_img: updateData.insa_info.profile_img,
          isAdmin: updateData.ou_admin_yn,
        },
      });
    },
    onMutate: async (newUserData) => {
      // 진행 중인 관련 쿼리들을 취소
      await queryClient.cancelQueries({ queryKey: [QueryKeys.USER_INFO] });
      await queryClient.cancelQueries({ queryKey: [QueryKeys.INFINITE_USER_INFO] });
      await queryClient.cancelQueries({ queryKey: [QueryKeys.ALL_USER_LIST] });

      // 이전 데이터를 스냅샷으로 저장
      const previousUserInfo = queryClient.getQueryData([QueryKeys.USER_INFO]);
      const previousInfiniteUserInfo = queryClient.getQueryData([QueryKeys.INFINITE_USER_INFO]);
      const previousUserList = queryClient.getQueryData([QueryKeys.ALL_USER_LIST]);

      // 낙관적으로 캐시를 업데이트
      queryClient.setQueryData(["userInfo"], (old) => ({
        ...old,
        ...newUserData,
      }));

      return { previousUserInfo, previousInfiniteUserInfo, previousUserList };
    },
    onError: (error, newUserData, context) => {
      // 오류 발생 시 이전 상태로 롤백
      queryClient.setQueryData(["userInfo"], context.previousUserInfo);
      queryClient.setQueryData(["infiniteUserInfo"], context.previousInfiniteUserInfo);
      queryClient.setQueryData(["userList"], context.previousUserList);
      addToast({ type: "error", message: error.message });
    },
    onSuccess: () => {
      addToast({ type: "success", message: "인사정보가 수정되었습니다." });
    },
    onSettled: () => {
      // mutation이 완료된 후 관련 쿼리들을 무효화하고 다시 가져오기
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER_INFO] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.INFINITE_USER_INFO] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ALL_USER_LIST] });
    },
  });
};
