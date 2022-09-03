import { ModalProviderProps } from "@contexts/modalProvider";

export interface ModalProps {
  visible: boolean; // is show modal or not
  title?: string; // title of modal
  children?: React.ReactNode; // content in modal
  closeable?: boolean; // is closeable or not
  setModal: (props: ModalProviderProps) => void; // set attributes in modal, the title and children will be reset if not passed
}

export default function Modal({
  visible,
  title,
  children,
  closeable = true,
  setModal,
}: ModalProps) {
  return (
    visible && (
      <div className="overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-0 h-full z-50 flex justify-center items-center bg-gray-900 bg-opacity-80 animate-in fade-in duration-500">
        <div
          className="overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-0 h-full z-50"
          onClick={() => {
            if (closeable) {
              setModal({ visible: false });
            }
          }}
        />
        <div className="relative max-w-3xl px-8">
          <div className="relative w-full p-4 bg-[#f9fafb] rounded-lg z-50 space-y-2">
            <div className="relative flex justify-between items-center space-x-4">
              <div className="relative flex-1 text-lg sm:text-xl text-gray-900 font-semibold">
                {title}
              </div>
              {closeable && (
                <button
                  type="button"
                  className="relative text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => {
                    if (closeable) {
                      setModal({ visible: false });
                    }
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              )}
            </div>
            <div>{children}</div>
          </div>
        </div>
      </div>
    )
  );
}
