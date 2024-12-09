import axios from "axios";

axios.defaults.timeout = 3000;

// VITE_BASE_URL = http://192.168.0.75:3000
const baseURL = import.meta.env.VITE_BASE_URL;

/**
 * 로그인
 */
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
    console.log("err.response", err.response);
    if (err.response?.status === 404 || err.response?.data?.status === "401") {
      throw new Error("사번 또는 비밀번호가 올바르지 않습니다.");
    }
    if (err.response?.status === 401) {
      throw new Error("비밀번호가 올바르지 않습니다.");
    }
    if (err.response?.status === 500) {
      throw new Error("서버 오류가 발생했습니다.");
    }
    throw new Error("서버 연결에 실패했습니다.");
  }
};

/**
 * 회원가입
 */
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

/**
 * 회사멤버 전체 리스트
 */
export const getUserListFetch = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/office_user_all`);
    if (res.status === 200) return res.data;
    throw new Error(res.data.message);
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * 출퇴근 리스트
 */
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

/**
 * 개인별 출퇴근 체크
 * status => 1: 출근 2: 퇴근
 */
export const setDailyFetch = async (data) => {
  try {
    const res = await axios.post(`${baseURL}/api/office_daily_checkIn`, data);
    if (res.status === 200) {
      if (res.data.status === "200") {
        if (res.data.message === "출근정보 존재") {
          return { userStatus: 1 };
        } else return { userStatus: data.status };
      }
      throw new Error(res.data.message);
    }
    throw new Error(res.message);
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * 개인별 출퇴근 상태
 */
export const getDailyFetch = async (sabeon) => {
  try {
    const res = await axios.get(`${baseURL}/api/office_daily/${sabeon}`);
    if (res.status === 200) {
      if (res.data.status === "200") {
        // 데이터가 있는 경우 전체 응답 반환
        return res.data;
      }
      // 미출근 상태인 경우
      return { message: "미출근" };
    }
    throw new Error("서버 응답 오류");
  } catch (err) {
    throw new Error(err.message || "출퇴근 상태 조회 실패");
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
    console.log(err);
  }
};

/**
 * 인사정보 수정
 */
export const updateUserInfoFetch = async (updateData) => {
  try {
    const res = await axios.post(`${baseURL}/api/office_user_save`, {
      ...updateData,
      insa_info: typeof updateData.insa_info === "string" ? JSON.parse(updateData.insa_info) : updateData.insa_info,
    });

    if (res.status !== 200) {
      throw new Error(res.data.message || "예상치 못한 오류가 발생했습니다");
    }
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 413) {
      throw new Error("잘못된 이미지 파일 또는 사이즈가 큰 사진입니다.");
    }
    console.error("사용자 정보 업데이트 중 오류 발생:", err.message);
    throw new Error(err.message);
  }
};
