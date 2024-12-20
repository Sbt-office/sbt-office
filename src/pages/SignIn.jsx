/**
 * 회원가입 페이지
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

import { useRegister } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";

import logo from "@/assets/images/logo.png";
import AuthBackground from "@/components/AuthBackground";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const register = useRegister();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      sabeon: "",
      username: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const password = watch("password");

  if (isAuthenticated) {
    return <Navigate to="/main" replace />;
  }

  const onSubmit = (data) => {
    const { ...registerData } = data;
    register.mutate(registerData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-dvw h-dvh bg-gradient-to-r from-[#9FAFD8] to-[#BDCAE7] text-black"
    >
      <div className="flex justify-evenly items-center w-full h-full gap-4">
        <div className="flex flex-col gap-3 w-[32rem] h-[50rem] bg-white rounded-3xl px-14 py-10 shadow-lg">
          {/* Introduce */}
          <div className="w-full h-20 p-5 flex flex-col justify-center items-center gap-4 mb-2">
            <img src={logo} alt="logo" aria-label="Company logo" draggable={false} className="w-36 h-9" />
            <p className="text-sm text-[#919191]">Welcome to the SBT Global Office IoT world</p>
          </div>

          {/* ID */}
          <div className="flex flex-col gap-2 w-full">
            <p className="text-comBlue text-lg">ID</p>
            <input
              type="text"
              {...registerField("sabeon", {
                required: "사번을 입력해주세요",
                minLength: {
                  value: 3,
                  message: "사번은 최소 3자 이상이어야 합니다",
                },
                pattern: {
                  value: /^[A-Za-z0-9]+$/,
                  message: "사번 형식이 올바르지 않습니다. 영문자와 숫자만 입력 가능합니다",
                },
              })}
              placeholder="사번을 입력하세요"
              aria-label="사번 입력"
              autoFocus
              className="p-3 ring-1 ring-sbtLightBlue rounded-sm text-black w-full px-4 bg-[#E7ECF8]"
            />
          </div>
          {errors.sabeon && (
            <span className="text-red-500 text-sm w-full flex justify-start items-center mb-1">
              {errors.sabeon.message}
            </span>
          )}

          {/* Username */}
          <div className="flex flex-col gap-2 w-full ">
            <p className="text-comBlue text-lg">Username</p>
            <input
              type="text"
              {...registerField("username", {
                required: "이름을 입력해주세요",
                minLength: {
                  value: 2,
                  message: "이름은 최소 2자 이상이어야 합니다",
                },
              })}
              placeholder="이름을 입력하세요"
              aria-label="이름 입력"
              className="p-3 ring-1 ring-sbtLightBlue rounded-sm text-black w-full px-4 bg-[#E7ECF8]"
            />
          </div>
          {errors.username && (
            <span className="text-red-500 text-sm w-full flex justify-start items-center mb-1">
              {errors.username.message}
            </span>
          )}

          {/* Password */}
          <div className="relative w-full flex flex-col gap-2">
            <p className="text-comBlue text-lg">Password</p>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...registerField("password", {
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showPassword ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
              </button>
            </div>
          </div>
          {errors.password && (
            <span className="text-red-500 text-sm w-60 flex justify-start items-center mb-1">
              {errors.password.message}
            </span>
          )}

          {/* Password Confirm */}
          <div className="relative w-full flex flex-col gap-2">
            <p className="text-comBlue text-lg">Password Confirm</p>
            <div className="relative">
              <input
                type={showPasswordConfirm ? "text" : "password"}
                {...registerField("passwordConfirm", {
                  required: "비밀번호 확인을 입력해주세요",
                  validate: (value) => value === password || "비밀번호가 일치하지 않습니다",
                })}
                placeholder="비밀번호를 다시 입력하세요"
                aria-label="비밀번호 확인"
                className="p-3 px-4 ring-1 ring-sbtLightBlue rounded-sm text-black w-full bg-[#E7ECF8] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPasswordConfirm ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showPasswordConfirm ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
              </button>
            </div>
          </div>
          {errors.passwordConfirm && (
            <span className="text-red-500 text-sm w-60 flex justify-start items-center">
              {errors.passwordConfirm.message}
            </span>
          )}

          {/* Buttons */}
          <div className="flex flex-col gap-3 mt-3">
            <button
              type="submit"
              disabled={register.isLoading}
              className="p-2 bg-comBlue ring-1 ring-comBlue text-white rounded-lg disabled:bg-gray-300 text-center transition-colors 
              h-12 text-lg hover:bg-sbtDarkBlue"
            >
              {register.isLoading ? "Sign Up..." : "Sign Up"}
            </button>
            <Link
              to="/login"
              className="text-center p-2 ring-1 ring-comBlue text-comBlue rounded-lg hover:bg-blue-50 transition-colors h-12 text-lg"
            >
              Back to Login
            </Link>
          </div>
        </div>
        <AuthBackground />
      </div>
    </form>
  );
};

export default SignIn;
