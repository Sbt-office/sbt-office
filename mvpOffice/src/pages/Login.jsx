import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useLogin } from "@/hooks/useAuth";
import { getCookie } from "@/utils/cookie";
import { useAuthStore } from "@/store/authStore";

import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import logo from "@/assets/images/logo.png";
import AuthBackground from "@/components/AuthBackground";

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
    const isLoginCookie = getCookie("isLogin");
    if (isAuthenticated && isLoginCookie && location.pathname !== "/signin") {
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-dvw h-dvh bg-gradient-to-r from-[#9FAFD8] to-[#BDCAE7] text-black"
    >
      <div className="flex justify-evenly items-center w-full h-full gap-4">
        <div className="flex flex-col gap-2 w-[32rem] h-[42rem] bg-white rounded-3xl px-14 py-16 shadow-xl">
          {/* Introduce */}
          <div className="w-full h-20 p-5 flex flex-col justify-center items-center gap-4 mb-7">
            <img src={logo} alt="logo" aria-label="Company logo" draggable={false} className="w-36 h-9" />
            <p className="text-sm text-[#919191]">Welcome to the SBT Global Office IoT world</p>
          </div>
          {/* ID */}
          <div className="flex flex-col gap-3 w-full h-[5.5rem]">
            <p className="text-comBlue text-lg">ID</p>
            <input
              type="text"
              {...register("sabeon", {
                required: "사번을 입력해주세요",
                minLength: {
                  value: 3,
                  message: "사번은 최소 3자 이상이어야 합니다",
                },
                pattern: {
                  value: /^[A-Za-z0-9]+$/,
                  message: "사번은 영문자와 숫자만 입력 가능합니다",
                },
              })}
              placeholder="사번을 입력하세요."
              aria-label="사번 입력"
              autoFocus
              className="p-3 ring-1 ring-sbtLightBlue rounded-sm text-black w-full px-4 bg-[#E7ECF8]"
            />
          </div>
          {errors.sabeon && (
            <span className="text-red-500 text-sm w-full flex justify-start items-center mb-2">
              {errors.sabeon.message}
            </span>
          )}
          {/* Password */}
          <div className="relative w-full flex flex-col gap-3 mt-3">
            <p className="text-comBlue text-lg">Password</p>
            <div className="relative">
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
                aria-label="비밀번호 입력"
                className="p-3 px-4 ring-1 ring-sbtLightBlue rounded-sm text-black w-full bg-[#E7ECF8] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 "
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showPassword ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
              </button>
            </div>
          </div>
          {errors.password && (
            <span className="text-red-500 text-sm w-60 flex justify-start items-center">{errors.password.message}</span>
          )}
          {/* Button */}
          <div className="flex flex-col gap-4 mt-10">
            <button
              type="submit"
              disabled={login.isLoading}
              className="p-2 bg-comBlue ring-1 ring-comBlue text-white rounded-lg disabled:bg-gray-300 text-center transition-colors 
              h-12 text-lg hover:bg-sbtDarkBlue"
            >
              {login.isLoading ? "Login in..." : "Login"}
            </button>
            <Link
              to="/signin"
              className="text-center p-2 ring-1 ring-comBlue text-comBlue rounded-lg hover:bg-blue-50 transition-colors h-12 text-lg"
            >
              Create Account
            </Link>
          </div>
        </div>
        <AuthBackground />
      </div>
    </form>
  );
};

export default Login;
