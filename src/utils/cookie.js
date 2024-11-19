import Cookies from "js-cookie";

export const setCookie = (name, value, expires = 1) => {
  Cookies.set(name, value, { expires: expires }); // expires는 일 단위
};

export const getCookie = (name) => {
  return Cookies.get(name);
};

export const removeCookie = (name) => {
  Cookies.remove(name);
};
