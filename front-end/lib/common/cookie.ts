import { serialize, CookieSerializeOptions } from "cookie";
import { NextApiResponse } from "next";

/**
 * add cookie
 * @param name
 * @param value
 * @param ttl expire time (second)
 */
export function addCookie(name, value, ttl) {
  let cookieString = `${name}=${encodeURI(value)}`;
  // set a expire time, and set a 0 time will expire when closing the browser
  if (ttl > 0) {
    const date = new Date();
    date.setTime(date.getTime() + ttl * 1000);
    cookieString = `${cookieString};expires=${date.toUTCString()}`;
  }
  document.cookie = cookieString;
}

/**
 * edit cookie
 * @param name
 * @param value
 * @param ttl expire time (second)
 */
export function editCookie(name, value, ttl) {
  let cookieString = `${name}=${encodeURI(value)}`;
  if (ttl > 0) {
    const date = new Date();
    date.setTime(date.getTime() + ttl * 1000); // milli second
    cookieString = `${cookieString};expires=${date.toUTCString()}`;
  }
  document.cookie = cookieString;
}

/**
 * Get a cookie with the given name
 * @param name
 */
export function getCookie(name: string) {
  const strCookie = document.cookie;
  const arrCookie = strCookie.split("; ");
  for (const cookie of arrCookie) {
    const arr = cookie.split("=");
    if (arr[0] === name) {
      return decodeURI(arr[1]);
    }
  }
}

/**
 * Set cookie of api response
 */
export const setCookie = (
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {}
) => {
  const stringValue =
    typeof value === "object" ? "j:" + JSON.stringify(value) : String(value);

  if ("maxAge" in options) {
    options.expires = new Date(Date.now() + options.maxAge);
    options.maxAge /= 1000;
  }

  res.setHeader("Set-Cookie", serialize(name, stringValue, options));
};

/**
 * Delete a cookie
 * @param name
 * @param param path domain
 */
export const removeCookie = (
  name: string,
  { path, domain }: { path?: string; domain?: string } = {}
) => {
  if (getCookie(name)) {
    document.cookie =
      name +
      "=" +
      (path ? ";path=" + path : "") +
      (domain ? ";domain=" + domain : "") +
      ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
};
