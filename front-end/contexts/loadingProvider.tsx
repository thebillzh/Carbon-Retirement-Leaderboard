import Loading, { LoadingProps } from "@components/common/loading";
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

export interface LoadingContextState extends LoadingProps {
  setLoading(props: LoadingProps): void; // set attributes in loading, the message will be reset if not passed
}

export const LoadingContext = createContext<LoadingContextState>(
  {} as LoadingContextState
);

export function useLoading(): LoadingContextState {
  return useContext(LoadingContext);
}

export const LoadingProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [props, setProps] = useState<LoadingProps>({ visible: false });
  const setLoading = useCallback(
    ({ visible, message, isNeedBackground }: LoadingProps) => {
      setProps({
        visible,
        message: message ? message : "",
        isNeedBackground: isNeedBackground ?? true,
      });
    },
    []
  );
  return (
    <LoadingContext.Provider
      value={{
        visible: props.visible,
        message: props.message,
        isNeedBackground: props.isNeedBackground,
        setLoading,
      }}
    >
      {children}
      <Loading
        visible={props.visible}
        message={props.message}
        isNeedBackground={props.isNeedBackground}
      />
    </LoadingContext.Provider>
  );
};
