import axios from "axios";

axios.defaults.timeout = 3000;

// VITE_BASE_URL = http://192.168.0.75:3000
const baseURL = import.meta.env.VITE_BASE_URL;

const handleErr = (err) => {
  console.error(err);
  return { message: "Failed Connect API" };
};

export const loginCheckFetch = async (credentials) => {
  try {
    const res = await axios.post(`${baseURL}/login`, credentials);
    if (res.data.status === "200") {
      return {
        success: true,
        user: res.data,
        sabeon: credentials.sabeon,
      };
    }
    throw new Error(res.data.message || "로그인에 실패했습니다.");
  } catch (err) {
    if (err.response?.status === 401) {
      throw new Error("사번 또는 비밀번호가 올바르지 않습니다.");
    }
    throw new Error("서버 연결에 실패했습니다.");
  }
};

export const registerFetch = async (userData) => {
  try {
    const res = await axios.post(`${baseURL}/register`, userData);
    if (res.data.status === "200") {
      return res.data;
    }
    throw new Error(res.data.message || "회원가입에 실패했습니다.");
  } catch (err) {
    if (err.response?.status === 409) {
      throw new Error("이미 존재하는 사번입니다.");
    }
    throw new Error("서버 연결에 실패했습니다.");
  }
};

export const getAllUserFetch = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/office_user_all`);
    return res.data;
  } catch (err) {
    return handleErr(err);
  }
};
