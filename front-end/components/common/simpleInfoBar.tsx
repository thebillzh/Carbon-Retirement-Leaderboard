import { InformationCircleIcon, XIcon } from "@heroicons/react/outline";
import { useState } from "react";

export default function SimpleInfoBar() {
  const [isDisplay, setIsDisplay] = useState(true);
  return (
    <div>
      {isDisplay && (
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <InformationCircleIcon
                className="h-5 w-5 text-blue-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-700">
              If you have NCT retirement made on or before Aug 31, 2022, log in NOW to claim your exlucisve NFT badges!
              </p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  className="inline-flex bg-green-50 rounded-md p-1.5 text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-50 focus:ring-blue-600"
                  onClick={() => setIsDisplay(false)}
                >
                  <span className="sr-only">Dismiss</span>
                  <XIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
