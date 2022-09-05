import { useCommonContext } from "@contexts/commonContextProvider";
import { useLoading } from "@contexts/loadingProvider";
import { useModal } from "@contexts/modalProvider";
import { sign } from "@lib/api/middlewares/verify";
import { getCookie, removeCookie } from "@lib/common/cookie";
import { useMobile } from "@lib/common/hooks";
import logger from "@lib/common/logger";
import { TokenPayload } from "@model/model";
import { useWeb3React } from "@web3-react/core";
import axios, { AxiosResponse } from "axios";
import base58 from "bs58";
import {
  BACKEND_BASE_URL,
  LOGIN_MESSAGE_PREFIX,
  POLYGON_MUMBAI_CHAIN_ID,
  POLYGON_MUMBAI_RPC_URL,
  T_NONCE_HEADER_NAME,
  T_SIGN_HEADER_NAME,
  T_TIMESTAMP_HEADER_NAME,
  T_TOKEN_COOKIE_NAME,
} from "constants/constants";
import { randomBytes } from "crypto";
import { utils } from "ethers";
import jwt from "jsonwebtoken";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { SignInReq } from "pages/api/common/sign_in";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import nacl from "tweetnacl";

// axios config
const instance = axios.create({
  baseURL: BACKEND_BASE_URL,
  // TODO: timeout should not over 20000
  // timeout: 10000,
  timeout: 100000,
  withCredentials: true,
});

// The defination of the param type in useABC
export type ABCCall = <Resp = any>({
  method,
  path,
  params,
  data,
}: {
  method: "get" | "GET" | "post" | "POST";
  path: string;
  params?: {} | URLSearchParams;
  data?: any;
  auth?: boolean;
}) => Promise<Resp>;

/**
 * All the call to the backend should use this hook
 */
export default function useABC() {
  const router = useRouter();
  const [token, setToken] = useState<string>();
  const { setLoading } = useLoading();
  const { setModal } = useModal();
  const isMobile = useMobile();
  const { setUser, resetCommonContext } = useCommonContext();
  const wallet = useWeb3React();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);

  // Connect the wallet
  const login = useCallback(async () => {
    try {
      if (!(window as any).ethereum) {
        return;
      }
      if (!wallet.isActive) {
        await wallet.connector.activate();
      }
      if (!token) {
        setIsSigningIn(true);
      }
    } catch (e) {
      toast.error(`Oops! Something wrong: ${e.message}`);
      logger.error(
        `[useDC] connectWallet error, isMobile: ${isMobile}, err: ${e.message}`
      );
    } finally {
      setLoading({ visible: false });
    }
  }, [isMobile, setLoading, token, wallet.connector, wallet.isActive]);

  // Disconnect the wallet and logout
  const logout = useCallback(async () => {
    if (wallet.isActive) {
      if (wallet.connector.deactivate) {
        wallet.connector.deactivate();
      } else {
        wallet.connector.resetState();
      }
    }
    resetCommonContext();
    removeCookie(T_TOKEN_COOKIE_NAME);
    setToken(null);
    if (router.isReady && router.pathname === "/") {
      return;
    }
    await router.replace("/");
  }, [resetCommonContext, router, wallet.connector, wallet.isActive]);

  /**
   * All the call to the backend should use this method
   * @param method
   * @param url
   * @param params query
   * @param data body
   */
  const call = useCallback<ABCCall>(
    async ({ method, path, params, data }) => {
      let response: AxiosResponse<any>;
      try {
        const headers = {} as any;
        const timestamp = DateTime.now().toSeconds().toString();
        const nonce = base58.encode(nacl.randomBytes(24));
        headers[T_TIMESTAMP_HEADER_NAME] = timestamp;
        headers[T_NONCE_HEADER_NAME] = nonce;
        headers[T_SIGN_HEADER_NAME] = sign(
          timestamp,
          nonce,
          method,
          path,
          params,
          data
        ); // sign the signature
        response = await instance({
          method: method,
          url: path,
          params: params,
          data: data,
          headers: headers,
          validateStatus: (status) => {
            return (
              (status >= 200 && status < 300) ||
              status === 400 ||
              status === 401 ||
              status === 403
            );
          },
        });

        if (response.status === 401 || response.status === 403) {
          logout();
          return;
        }
        if (response.status === 400) {
          toast.error(`Error: ${response.data.msg}`);
          return;
        }
        return response.data;
      } catch (e) {
        console.trace(e);
        toast.error("Something wrong, please try again later");
        logger.error(
          `[useDC] bad call, method: ${method}, path: ${path}, params: ${JSON.stringify(
            params
          )}, data: ${JSON.stringify(data)}, error: ${e.message}`
        );
        return;
      } finally {
        // Determine whether the token should be updated
        const newToken = getCookie(T_TOKEN_COOKIE_NAME);
        if (token !== newToken) {
          setToken(newToken);
          const user = jwt.decode(newToken) as TokenPayload;
          setUser(user);
        }
      }
    },
    [logout, setUser, token]
  );

  // If token is in the cache, connect to it eagerly.
  useEffect(() => {
    if (token) {
      void wallet.connector.connectEagerly();
    }
  }, [token, wallet.connector]);

  // set token
  useEffect(() => {
    const t = getCookie(T_TOKEN_COOKIE_NAME);
    if (t) {
      setToken(t);
    }
  }, []);

  // login
  // since there is a isActivating status, the login procedure should be done in a useEffect
  useEffect(() => {
    const f = async () => {
      if (
        !(window as any).ethereum ||
        !wallet.isActive ||
        !isSigningIn ||
        isSwitchingNetwork ||
        token
      ) {
        return;
      }

      try {
        if (!wallet.account) throw new Error("Wallet not connected!");

        if (wallet.chainId !== POLYGON_MUMBAI_CHAIN_ID) {
          setIsSwitchingNetwork(true);
          try {
            setLoading({
              visible: true,
              message: `Switching to network: Polygon Mumbai`,
            });
            await wallet.provider.send("wallet_switchEthereumChain", [
              { chainId: utils.hexValue(POLYGON_MUMBAI_CHAIN_ID) },
            ]);
          } catch (err) {
            if (err.code === 4902) {
              setLoading({
                visible: true,
                message: `Adding and switching to network: Polygon Mumbai`,
              });
              await wallet.provider.send("wallet_addEthereumChain", [
                {
                  chainName: "Polygon Munbai",
                  chainId: utils.hexValue(POLYGON_MUMBAI_CHAIN_ID),
                  nativeCurrency: {
                    name: "MATIC",
                    decimals: 18,
                    symbol: "MATIC",
                  },
                  rpcUrls: [POLYGON_MUMBAI_RPC_URL],
                },
              ]);
            }
          }
        }

        // Sign a message to check whether the user has the control of the private key
        const message = randomBytes(32).toString("hex");
        setLoading({
          visible: true,
          message: `Signing message in your wallet: ${message}`,
        });
        const signer = wallet.provider.getSigner();
        const signature = await signer.signMessage(
          `${LOGIN_MESSAGE_PREFIX}${message}`
        );

        setLoading({ visible: true, message: "Signing in..." });
        await call({
          method: "post",
          path: "/common/sign_in",
          data: {
            wallet_pub: wallet.account,
            message,
            signature: signature,
          } as SignInReq,
        });
        const newToken = getCookie(T_TOKEN_COOKIE_NAME);
        setToken(newToken);
        if (!newToken) {
          throw new Error("Something wrong, Please try again...");
        }
        const user = jwt.decode(newToken) as TokenPayload;
        setUser(user);
      } catch (e) {
        setModal({
          visible: true,
          title: "Oops!",
          children: <div className="text-sm sm:text-base">{e.message}</div>,
        });
        logger.error(`[useDC] when pc login: ${e.message}`);
      } finally {
        setIsSigningIn(false);
        setIsSwitchingNetwork(false);
        setLoading({ visible: false });
      }
    };
    f();
  }, [
    call,
    isSigningIn,
    isSwitchingNetwork,
    setLoading,
    setModal,
    setUser,
    token,
    wallet.account,
    wallet.chainId,
    wallet.isActive,
    wallet.provider,
  ]);

  return { token, call, login, logout };
}
