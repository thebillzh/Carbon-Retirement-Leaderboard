/* This example requires Tailwind CSS v2.0+ */
import { useCommonContext } from "@contexts/commonContextProvider";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import useABC from "@lib/common/abc";
import { useWeb3React } from "@web3-react/core";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useMemo } from "react";

const navigation = [
  { name: "Leaderboard", href: "/" },
  { name: "About", href: "/about" },
];
const userNavigation = [
  { name: "Your Profile", href: "/profile" },
  // { name: "Settings", href: "#" },
  { name: "Disconnect", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SimpleHeader() {
  const router = useRouter();
  const path = useMemo(() => router.pathname, [router.pathname]);
  const { login, logout } = useABC();
  const { user } = useCommonContext();

  return (
    <Disclosure as="nav" className="bg-white shadow-sm z-10">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex justify-between h-16">
              <div className="relative flex items-center">
                <div className="relative block lg:hidden w-8 h-8">
                  <Image
                    src="/images/toucan-only-logo.svg"
                    layout="fill"
                    objectFit="contain"
                    alt="Workflow"
                  />
                </div>
                <div className="relative hidden lg:block w-28 h-8">
                  <Image
                    src="/images/toucan-logo.svg"
                    layout="fill"
                    objectFit="contain"
                    alt="Workflow"
                  />
                </div>
              </div>
              <div className="relative flex-1 hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.href === path
                          ? "border-indigo-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                        "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                      )}
                      aria-current={item.href === path ? "page" : undefined}
                    >
                      {item.name}
                    </a>
                  );
                })}
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {/* Profile dropdown */}
                {user ? (
                  <Menu as="div" className="ml-3 relative">
                    <div>
                      <Menu.Button className="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <span className="sr-only">Open user menu</span>
                        <span className="h-8 w-8 rounded-full overflow-hidden">
                          {user.face ? (
                            <Image
                              className="rounded-full"
                              src={user.face}
                              layout="fill"
                              objectFit="contain"
                              alt=""
                            />
                          ) : (
                            /* placeholder user profile */
                            <svg
                              className="h-full w-full text-gray-300"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          )}
                        </span>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => {
                          if (item.name === "Disconnect") {
                            return (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <button
                                    type="button"
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block w-full px-4 py-2 text-left text-sm text-gray-700"
                                    )}
                                    onClick={() => {
                                      logout();
                                    }}
                                  >
                                    {item.name}
                                  </button>
                                )}
                              </Menu.Item>
                            );
                          } else {
                            return (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            );
                          }
                        })}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        login();
                      }}
                      type="button"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                    >
                      Connect Wallet
                    </button>
                  </>
                )}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.href === path
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
                    "block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                  )}
                  aria-current={item.href === path ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  {/* <img
                        className="h-10 w-10 rounded-full"
                        src={user.imageUrl}
                        alt=""
                      /> */}
                  <div className="h-10 w-10 rounded-full text-sm">
                    <svg
                      className="h-full w-full text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {user?.uname}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {user?.twitter}
                  </div>
                </div>
                {/* <button
                      type="button"
                      className="ml-auto bg-white flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button> */}
              </div>
              <div className="mt-3 space-y-1">
                {userNavigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
