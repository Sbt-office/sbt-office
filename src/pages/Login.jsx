import { useState, useEffect } from "react";
import { useLogin } from "@/hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/authStore";
import { FaRegUser } from "react-icons/fa";
import { RiLockUnlockLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import logo from "@/assets/images/logo.png";
import { getCookie } from "@/utils/cookie";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      sabeon: "",
      password: "",
    },
  });

  useEffect(() => {
    const img = new Image();
    img.src = logo;
    img.onload = () => setIsLoaded(true);
  }, []);

  useEffect(() => {
    const sabeonCookie = getCookie("sabeon");
    if (isAuthenticated && sabeonCookie && location.pathname !== "/signin") {
      navigate("/main", { replace: true });
    }
  }, [isAuthenticated, navigate, location.pathname]);

  const onSubmit = (data) => {
    login.mutate(data);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-dvw h-dvh bg-sbtLightBlue2 text-black">
      <div className="shadow-md flex flex-col gap-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/70 p-4 rounded-lg max-w-md w-96">
        <div className="w-full h-[76px] flex justify-center items-center p-5">
          <img
            src={logo}
            alt="logo"
            className="w-full h-12 object-contain"
            aria-label="Company logo"
            draggable={false}
          />
        </div>
        <div className="flex gap-1 items-center justify-between w-full">
          <FaRegUser size={20} className="w-20 h-7 text-sbtDarkBlue" />
          <input
            type="text"
            {...register("sabeon", {
              required: "사번을 입력해주세요",
              minLength: {
                value: 3,
                message: "사번은 최소 3자 이상이어야 합니다",
              },
              pattern: {
                value: /^[A-Za-z]+\d+$/,
                message: "사번 형식이 올바르지 않습니다 (예:A0001)",
              },
            })}
            placeholder="사번을 입력하세요."
            className="p-2 ring-1 ring-sbtLightBlue rounded-md text-black w-72 px-3"
            aria-label="사번 입력"
            autoFocus
          />
        </div>
        {errors.sabeon && (
          <span className="text-red-500 text-sm w-60 mb-1 ml-20 flex justify-start items-center">
            {errors.sabeon.message}
          </span>
        )}

        <div className="flex gap-1 items-center justify-between">
          <RiLockUnlockLine size={20} className="w-20 h-7 text-sbtDarkBlue" />
          <div className="relative w-72">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "비밀번호를 입력해주세요",
                minLength: {
                  value: 4,
                  message: "비밀번호는 최소 4자 이상이어야 합니다",
                },
              })}
              placeholder="비밀번호를 입력하세요"
              className="p-2 ring-1 ring-sbtLightBlue rounded-md text-black w-full px-3 pr-10"
              aria-label="비밀번호 입력"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showPassword ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
            </button>
          </div>
        </div>
        {errors.password && (
          <span className="text-red-500 text-sm w-60 ml-20 flex justify-start items-center">
            {errors.password.message}
          </span>
        )}

        <div className="flex flex-col gap-3 mt-2">
          <button
            type="submit"
            disabled={login.isLoading}
            className="p-2 bg-sbtDarkBlue text-white rounded disabled:bg-gray-300 text-center hover:bg-sbtDarkBlue/80 transition-colors"
          >
            {login.isLoading ? "로그인 중..." : "로그인"}
          </button>
          <Link
            to="/signin"
            className="text-center p-2 ring-1 ring-sbtDarkBlue/40 text-sbtDarkBlue rounded hover:bg-blue-50 transition-colors"
          >
            회원가입
          </Link>
        </div>
      </div>
    </form>
  );
};

export default Login;
