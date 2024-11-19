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

export const getUserListFetch = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/office_user_all`);
    if (res.status === 200) return res.data;
    throw new Error(res.data.message);
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getDailyListFetch = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/office_daily_list`);
    if (res.status === 200) {
      if (res.data.status === "200") return res.data.data;
      throw new Error(res.data.message);
    }
    throw new Error(res.message);
  } catch (err) {
    throw new Error(err.message);
  }
};

// status => 1: 출근 2: 퇴근
export const setDailyFetch = async (data) => {
  try {
    const res = await axios.post(`${baseURL}/api/office_daily_checkIn`, data);
    if (res.status === 200) {
      if (res.data.status === "200") {
        if (res.data.message === "출근정보 존재") {
        } else return { userStatus: data.status };
      }
      throw new Error(res.data.message);
    }
    throw new Error(res.message);
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getDailyFetch = async (sabeon) => {
  try {
    const res = await axios.get(`${baseURL}/api/office_daily/${sabeon}`);
    if (res.status === 200) {
      console.log(res.data.data);
      if (res.data.status === "200") return res.data;
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * 개인 별 인사정보
 */
export const getUserInfoFetch = async (sabeon) => {
  try {
    const res = await axios.get(`${baseURL}/api/office_user/${sabeon}`);
    return res.data;
  } catch (err) {
    return handleErr(err);
  }
};
