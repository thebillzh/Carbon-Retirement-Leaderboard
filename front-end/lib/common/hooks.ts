import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { addCookie, editCookie, getCookie } from "./cookie";

/**
 * Get a param from the url query
 * @name name param name
 * @returns {string || undefined} value of undefined when the param not exist
 */
export function useParam(name: string): string | undefined {
  const router = useRouter();
  const [param, setParam] = useState(null);
  useEffect(() => {
    if (!router.isReady || !router.query[name]) {
      setParam(undefined);
      return;
    }
    let pathName: string;
    if (typeof router.query[name] === "string") {
      pathName = router.query[name] as string;
    }
    // Get the first one when multi exist
    if (Array.isArray(router.query[name])) {
      pathName = router.query[name][0];
    }
    setParam(pathName);
  }, [name, router.isReady, router.query]);
  return param;
}

/**
 * Counting down hook
 * @returns
 */
export const useCountdown = (name: string, initial: number = 60) => {
  const [count, setCount] = useState<number>(); // time left
  const timerRef = useRef<NodeJS.Timer>(); // time counter
  useEffect(() => {
    const originCountdown = getCookie(name);
    if (originCountdown) {
      let countdown = parseInt(originCountdown);
      if (isNaN(countdown)) {
        countdown = initial;
      }
      setCount(countdown);
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          if (countdown <= 0) {
            clearInterval(timerRef.current);
          } else {
            countdown--;
          }
          if (setCount) {
            setCount(countdown);
          }
          editCookie(name, countdown, countdown + 1);
        }, 1000);
      }
    }
  }, [initial, name]);

  /**
   * Start counting down
   * @returns current time
   */
  const startCounting = (): number | undefined => {
    const originCountdown = getCookie(name);
    let countdown = initial;
    // add a new countdown or get the one in the cookie
    if (typeof originCountdown === "undefined") {
      addCookie(name, initial, initial);
    } else {
      countdown = parseInt(originCountdown);
    }
    const timer = setInterval(() => {
      if (countdown <= 0) {
        clearInterval(timer);
      } else {
        countdown--;
      }
      if (setCount) {
        setCount(countdown);
      }
      editCookie(name, countdown, countdown + 1);
    }, 1000);
    // return undefined when not exist in the cookie or the real time left to know whether is already counting
    return typeof originCountdown === "undefined" ? undefined : countdown;
  };

  return { count, startCounting };
};

/**
 * Determine whether is mobile
 * @returns is mobile or not
 */
export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isMobileMatched = userAgent.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
    );
    if (isMobileMatched) {
      setIsMobile(true);
    }
  }, []);
  return isMobile;
};
