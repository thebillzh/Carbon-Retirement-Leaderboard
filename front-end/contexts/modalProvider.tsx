import Modal, { ModalProps } from "@components/common/modal";
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

export const ModalContext = createContext<ModalProps>({} as ModalProps);

export function useModal(): ModalProps {
  return useContext(ModalContext);
}

export interface ModalProviderProps {
  visible: boolean; // is modal visible or not
  title?: string; // title of modal
  children?: React.ReactNode; // content in modal
  closeable?: boolean; // is closeable or not
}

export const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [props, setProps] = useState<ModalProviderProps>({
    visible: false,
    closeable: true,
  });
  const setModal = useCallback(
    ({ visible, title, closeable, children }: ModalProviderProps) => {
      setProps({
        visible,
        title: title ? title : "",
        closeable: typeof closeable === "undefined" || closeable ? true : false,
        children: children ? children : <></>,
      });
    },
    []
  );

  return (
    <ModalContext.Provider
      value={{
        visible: props.visible,
        title: props.title,
        closeable: props.closeable,
        children: props.children,
        setModal,
      }}
    >
      {children}
      <Modal
        visible={props.visible}
        title={props.title}
        closeable={props.closeable}
        setModal={setModal}
      >
        {props.children}
      </Modal>
    </ModalContext.Provider>
  );
};
