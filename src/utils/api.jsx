import axios from "axios";

axios.defaults.timeout = 3000;

const baseURL = window.location.origin;

const handleErr = (err) => {
  console.error(err);
};

export const loginCheckFetch = async (name, pw) => {
  try {
    const params = {
      username: name,
      password: pw,
    };
    const res = await axios.post(`${baseURL}/login`, params);
    console.log(res);
  } catch (err) {
    handleErr(err);
    return false;
  }
};

export const resgisterFetch = async (sabeon, name, password) => {
  try {
    const params = {
      ou_sabeon: sabeon,
      ou_nm: name,
      password,
    };
    const res = await axios.post(`${baseURL}/register`, params);
    console.log(res);
  } catch (err) {
    handleErr(err);
    return false;
  }
};
