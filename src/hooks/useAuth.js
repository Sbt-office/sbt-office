import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { loginCheckFetch, registerFetch } from "@/utils/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/useToast";
import { setCookie } from "@/utils/cookie";
import useAdminStore from "@/store/adminStore";

export const useLogin = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const { addToast } = useToast();
  const { setIsAdmin, setSabeon } = useAdminStore();

  return useMutation({
    mutationFn: loginCheckFetch,
    onSuccess: (data) => {
      if (data.user.status === "200") {
        setUser(data);
        setSabeon(data.sabeon);
        setIsAdmin(data.user.ou_admin_yn);
        setCookie("isLogin", true);
        addToast({ type: "success", message: "로그인에 성공했습니다." });
        navigate("/main");
      } else {
        addToast({ type: "error", message: data.message || "로그인에 실패했습니다." });
      }
    },
    onError: (error) => {
      addToast({ type: "error", message: error.message });
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: registerFetch,
    onSuccess: (data) => {
      if (data.status === "200") {
        addToast({ type: "success", message: "회원가입이 완료되었습니다." });
        navigate("/");
      } else {
        addToast({ type: "error", message: data.message || "회원가입에 실패했습니다." });
      }
    },
    onError: (error) => {
      addToast({ type: "error", message: error.message || "회원가입 중 오류가 발생했습니다." });
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { addToast } = useToast();
  const { setIsAdmin, setSabeon } = useAdminStore();

  const handleLogout = () => {
    logout();
    setIsAdmin("N");
    setSabeon("");
    localStorage.removeItem("auth-storage");
    addToast({ type: "success", message: "로그아웃되었습니다." });
    navigate("/");
  };

  return handleLogout;
};
