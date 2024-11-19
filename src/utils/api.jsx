import axios from "axios";

axios.defaults.timeout = 3000;

const baseURL = "http://192.168.0.75:3000";

export const loginCheckFetch = async (sabeon, password) => {
  try {
    const params = { sabeon, password };
    const res = await axios.post(`${baseURL}/login`, params);
    return res;
  } catch (err) {
    return err;
  }
};

export const resgisterFetch = async (sabeon, username, password) => {
  try {
    const params = { sabeon, username, password };
    const res = await axios.post(`${baseURL}/register`, params);
    return res;
  } catch (err) {
    return err;
  }
};

export const getUserListFetch = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/office_user_all`);
    return res;
  } catch (err) {
    return err;
  }
};

export const getDailyListFetch = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/office_daily_list`);
    return res;
  } catch (err) {
    return err;
  }
};
