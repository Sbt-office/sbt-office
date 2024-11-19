/**
 * 회원가입 페이지
 */
import { useState } from "react";
import { useRegister } from "../hooks/useAuth";
import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/authStore";
import { FaRegUser } from "react-icons/fa";
import { RiLockUnlockLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { MdDriveFileRenameOutline } from "react-icons/md";
import logo from "../assets/images/logo.png";

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
    <form onSubmit={handleSubmit(onSubmit)} className="w-dvw h-dvh bg-sbtLightBlue2 text-black">
      <div className="shadow-md flex flex-col gap-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/70 p-4 rounded-lg max-w-md w-96">
        <div className="w-full h-full flex justify-center items-center p-5">
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
            {...registerField("sabeon", {
              required: "사번을 입력해주세요",
              minLength: {
                value: 3,
                message: "사번은 최소 3자 이상이어야 합니다",
              },
              pattern: {
                value: /^[A-Za-z]+\d+$/,
                message: "사번 형식이 올바르지 않습니다 (예: A0001)",
              },
            })}
            placeholder="사번을 입력하세요"
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

        <div className="flex gap-1 items-center justify-between w-full">
          <MdDriveFileRenameOutline size={20} className="w-20 h-7 text-sbtDarkBlue" />
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
            className="p-2 ring-1 ring-sbtLightBlue rounded-md text-black w-72 px-3"
            aria-label="이름 입력"
          />
        </div>
        {errors.username && (
          <span className="text-red-500 text-sm w-60 mb-1 ml-20 flex justify-start items-center">
            {errors.username.message}
          </span>
        )}

        <div className="flex gap-1 items-center justify-between">
          <RiLockUnlockLine size={20} className="w-20 h-7 text-sbtDarkBlue" />
          <div className="relative w-72">
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

        <div className="flex gap-1 items-center justify-between">
          <RiLockUnlockLine size={20} className="w-20 h-7 text-sbtDarkBlue" />
          <div className="relative w-72">
            <input
              type={showPasswordConfirm ? "text" : "password"}
              {...registerField("passwordConfirm", {
                required: "비밀번호 확인을 입력해주세요",
                validate: (value) => value === password || "비밀번호가 일치하지 않습니다",
              })}
              placeholder="비밀번호를 다시 입력하세요"
              className="p-2 ring-1 ring-sbtLightBlue rounded-md text-black w-full px-3 pr-10"
              aria-label="비밀번호 확인"
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
          <span className="text-red-500 text-sm w-60 ml-20 flex justify-start items-center">
            {errors.passwordConfirm.message}
          </span>
        )}

        <div className="flex flex-col gap-3 mt-2">
          <button
            type="submit"
            disabled={register.isLoading}
            className="p-2 bg-sbtDarkBlue text-white rounded disabled:bg-gray-300 text-center hover:bg-sbtDarkBlue/80 transition-colors"
          >
            {register.isLoading ? "가입 중..." : "회원가입"}
          </button>
          <Link
            to="/"
            className="text-center p-2 ring-1 ring-sbtDarkBlue/40 text-sbtDarkBlue rounded hover:bg-blue-50 transition-colors"
          >
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignIn;
