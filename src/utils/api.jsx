import axios from "axios";

axios.defaults.timeout = 3000;

const baseURL = import.meta.env.VITE_BASE_URL;

export const loginCheckFetch = async (credentials) => {
  try {
    const res = await axios.post(`${baseURL}/login`, credentials);
    if (res.data.status === "200") {
      return {
        success: true,
        user: res.data,
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

export const getUserListFetch = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/office_user_all`);
    if (res.status === 200) return res.data;
    throw new Error(res.data.message);
  } catch (err) {
    return err;
  }
};

export const getDailyListFetch = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/office_daily_list`);
    if (res.status === 200 && res.data.status === "200") return res.data.data;
    throw new Error(res.data.message);
  } catch (err) {
    return err;
  }
};
