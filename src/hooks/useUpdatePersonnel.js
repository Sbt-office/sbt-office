import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserInfoFetch } from "@/utils/api";
import { useToast } from "./useToast";
import { getCookie } from "@/utils/cookie";

export const useUpdatePersonnel = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (updateData) => {
      const isAdminFromCookie = getCookie("isAdmin");
      const sabeonFromCookie = getCookie("sabeon");
      const sabeon = isAdminFromCookie ? updateData.sabeon : sabeonFromCookie;

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
          isAdmin: updateData.insa_info.isAdmin,
        },
      });
    },
    onMutate: async (newUserData) => {
      // 진행 중인 관련 쿼리들을 취소
      await queryClient.cancelQueries({ queryKey: ["userInfo"] });
      await queryClient.cancelQueries({ queryKey: ["infiniteUserInfo"] });
      await queryClient.cancelQueries({ queryKey: ["userList"] });

      // 이전 데이터를 스냅샷으로 저장
      const previousUserInfo = queryClient.getQueryData(["userInfo"]);
      const previousInfiniteUserInfo = queryClient.getQueryData(["infiniteUserInfo"]);
      const previousUserList = queryClient.getQueryData(["userList"]);

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
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      queryClient.invalidateQueries({ queryKey: ["infiniteUserInfo"] });
      queryClient.invalidateQueries({ queryKey: ["userList"] });
    },
  });
};
