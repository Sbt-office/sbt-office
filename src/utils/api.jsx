import axios from "axios";

axios.defaults.timeout = 3000;

const baseURL = "http://192.168.0.75:3000";

const handleErr = (err) => {
  console.error(err);
  return { message: "Failed Connect API" };
};

export const loginCheckFetch = async (sabeon, password) => {
  try {
    const params = { sabeon, password };
    const res = await axios.post(`${baseURL}/login`, params);
    return res;
  } catch (err) {
    handleErr(err);
    return { message: "Failed Connect API" };
  }
};

export const resgisterFetch = async (sabeon, username, password) => {
  try {
    const params = { sabeon, username, password };
    const res = await axios.post(`${baseURL}/register`, params);
    return res;
  } catch (err) {
    return handleErr(err);
  }
};

export const getAllUserFetch = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/office_user_all`);
    return res;
  } catch (err) {
    return handleErr(err);
  }
};
