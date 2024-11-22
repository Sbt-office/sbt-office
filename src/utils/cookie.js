import Cookies from "js-cookie";

export const setCookie = (name, value, expires = 0.5) => {
  Cookies.set(name, value, { expires: expires });
};

export const getCookie = (name) => {
  return Cookies.get(name);
};
