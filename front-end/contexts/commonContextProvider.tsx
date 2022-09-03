import { COMMON_CONTEXT_LOCAL_STORATE_KEY } from "@constants/constants";
import { TokenPayload } from "@model/model";
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface CommonContextState {
  user: TokenPayload;
  setUser: Dispatch<SetStateAction<TokenPayload>>;

  resetCommonContext: () => void; // reset CommonContext
}

export const CommonContext = createContext<CommonContextState>(
  {} as CommonContextState
);

export function useCommonContext(): CommonContextState {
  return useContext(CommonContext);
}

export const CommonContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<TokenPayload>();
  const resetCommonContext = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    const rawCommonContextJson = localStorage.getItem(
      COMMON_CONTEXT_LOCAL_STORATE_KEY
    );
    if (rawCommonContextJson) {
      const rawCommonContext = JSON.parse(rawCommonContextJson);
      setUser(rawCommonContext.user);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      COMMON_CONTEXT_LOCAL_STORATE_KEY,
      JSON.stringify({ user: user })
    );
  }, [user]);

  return (
    <CommonContext.Provider
      value={{
        user,
        setUser,
        resetCommonContext,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};
