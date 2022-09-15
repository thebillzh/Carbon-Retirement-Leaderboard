import { ToucanAddressMapping } from "@constants/addressMapping";
import {
  RANKING_API_BASE_URL,
  RANKING_API_BASE_URL_PROXY,
} from "@constants/constants";
import { useCommonContext } from "@contexts/commonContextProvider";
import { useLoading } from "@contexts/loadingProvider";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/outline";
import useABC from "@lib/common/abc";
import { HoverCard } from "@mantine/core";
import { LeaderboardReturnItem } from "@model/model";
import axios from "axios";
import _ from "lodash";
import moment, { Moment } from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { HomeProps } from "pages";
import { GetAvailableNFTListResp, NFTMintResp } from "pages/api/nft/mint";
import {
  Fragment,
  MutableRefObject,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const tabs = [
  {
    name: "All Time",
    href: "#",
    showYear: false,
    showQuarter: false,
    showMonth: false,
    api: "",
  },
  {
    name: "Quarter",
    href: "#",
    showYear: true,
    showQuarter: true,
    showMonth: false,
    api: "",
  },
  {
    name: "Month",
    href: "#",
    showYear: true,
    showQuarter: false,
    showMonth: true,
    api: "",
  },
];

export const JSONToLeaderboardData = (data) => {
  const r = new Array<LeaderboardReturnItem>();
  const dataList = data.list;
  for (const key in dataList) {
    r.push({
      address: dataList[key].wallet_pub,
      uname: dataList[key].uname,
      ens: dataList[key].ens,
      total_retirement: dataList[key].retired_amount,
      is_contract: dataList[key].is_contract,
      twitter: dataList[key].twitter,
    });
  }
  r.sort((a, b) => b.total_retirement - a.total_retirement);
  return r;
};

const fetchAndCache = async (
  url: string,
  cache: MutableRefObject<{
    string: LeaderboardReturnItem[];
  }>
) => {
  const resp = await fetch(url);
  const JSONdata = await resp.json();

  const r = JSONToLeaderboardData(JSONdata);
  cache.current[url] = r;
  return r;
};

const useFetch = (
  url: string,
  cache: MutableRefObject<{
    string: LeaderboardReturnItem[];
  }>
) => {
  const initialState = {
    status: "idle",
    error: null,
    data: [],
  };

  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "FETCHING":
        return { ...initialState, status: "fetching" };
      case "FETCHED":
        return { ...initialState, status: "fetched", data: action.payload };
      case "FETCH_ERROR":
        return { ...initialState, status: "error", error: action.payload };
      default:
        return state;
    }
  }, initialState);

  useEffect(() => {
    let cancelRequest = false;
    if (!url || !url.trim()) return;

    const fetchData = async () => {
      dispatch({ type: "FETCHING" });
      if (cache.current[url]) {
        dispatch({ type: "FETCHED", payload: cache.current[url] });
      } else {
        try {
          const r = await fetchAndCache(url, cache);
          if (cancelRequest) return;
          dispatch({ type: "FETCHED", payload: r });
        } catch (e) {
          if (cancelRequest) return;
          dispatch({ type: "FETCH_ERROR", payload: e.message });
        }
      }
    };

    fetchData();

    return () => {
      cancelRequest = true;
    };
  }, [url, cache]);

  return state;
};

const paramsToURL = (
  first: number,
  type: string,
  start_time: moment.Moment,
  end_time: moment.Moment,
  proxy: boolean = true
) => {
  const params = new URLSearchParams({
    first: Math.floor(first).toString(),
    type: type,
    start_time: start_time.format("yyyy-MM-DD HH:mm:ss"),
    end_time: end_time.format("yyyy-MM-DD HH:mm:ss"),
  });

  if (proxy) {
    return RANKING_API_BASE_URL_PROXY + "?" + params.toString();
  } else {
    return RANKING_API_BASE_URL + "?" + params.toString();
  }
};

const getUserNameLink = (user: LeaderboardReturnItem) => {
  if (user?.uname || user.twitter) {
    return `/profile/${user?.address}`;
  } else {
    return `https://polygonscan.com/address/${user?.address}`;
  }
};

const getUserDisplayName = (user: LeaderboardReturnItem) => {
  return (
    user?.uname ||
    user?.ens ||
    ToucanAddressMapping[user?.address] ||
    user?.address
  );
};

export default function Leaderboard({
  firstAllTimeRankData,
  firstAllTimeAPIURL,
}: HomeProps) {
  const { call } = useABC();
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // getMonth is 0-based
  const currentQuarter = Math.floor(today.getMonth() / 3 + 1);
  const currentYear = today.getFullYear();

  const monthRange = _.range(1, 12 + 1);
  const quarterRange = _.range(1, 4 + 1);
  const yearRange = _.range(2022, currentYear + 1);

  const [tabSelected, setTabSelected] = useState(0); // 2=Month, 1=Quarter, 0=All time

  const [monthSelected, setMonthSelected] = useState(currentMonth);
  const [quarterSelected, setQuarterSelected] = useState(currentQuarter);
  const [yearSelected, setyearSelected] = useState(currentYear);

  const { setLoading } = useLoading();

  const router = useRouter();

  const cacheRankingdata = useRef<{ string: LeaderboardReturnItem[] }>(
    {} as { string: LeaderboardReturnItem[] }
  );

  useEffect(() => {
    cacheRankingdata.current[firstAllTimeAPIURL] = firstAllTimeRankData;

    // current quarter
    let start_time = moment.utc(currentQuarter + "-" + currentYear, "Q-YYYY");
    let end_time = moment(start_time).endOf("quarter");
    paramsToURL(1000, "nct", start_time, end_time);
    const quarterURL = paramsToURL(1000, "nct", start_time, end_time);
    fetchAndCache(quarterURL, cacheRankingdata);

    // current month
    start_time = moment.utc(currentMonth + "-" + currentYear, "M-YYYY");
    end_time = moment(start_time).endOf("month");
    const monthURL = paramsToURL(1000, "nct", start_time, end_time);
    fetchAndCache(monthURL, cacheRankingdata);
  }, [
    currentMonth,
    currentQuarter,
    currentYear,
    firstAllTimeAPIURL,
    firstAllTimeRankData,
  ]);

  const apiURL = useRef("");
  const start_time = useRef<moment.Moment>();
  const end_time = useRef<moment.Moment>();
  if (tabSelected === 0) {
    // all time ranking
    const params = new URLSearchParams({
      first: "1000",
      type: "nct",
    });
    apiURL.current = RANKING_API_BASE_URL + "?" + params.toString();
  } else if (tabSelected === 1) {
    // quarterly ranking
    start_time.current = moment.utc(
      quarterSelected + "-" + yearSelected,
      "Q-YYYY"
    );
    end_time.current = moment(start_time.current).endOf("quarter");

    apiURL.current = paramsToURL(
      1000,
      "nct",
      start_time.current,
      end_time.current
    );
  } else if (tabSelected === 2) {
    // monthly ranking
    start_time.current = moment.utc(
      monthSelected + "-" + yearSelected,
      "M-YYYY"
    );
    end_time.current = moment(start_time.current).endOf("month");

    apiURL.current = paramsToURL(
      1000,
      "nct",
      start_time.current,
      end_time.current
    );
  } else {
    console.error("Invalid selection");
  }
  const {
    status,
    data: rankingData,
    error,
  } = useFetch(apiURL.current, cacheRankingdata);

  useEffect(() => {
    setLoading({ visible: status === "fetching", isNeedBackground: true });
  }, [setLoading, status]);

  const [openNFTNotice, setOpenNFTNotice] = useState(false);

  const [mintEligible, setMintEligible] = useState(false);

  const { user } = useCommonContext();

  useEffect(() => {
    const checkEligibility = async () => {
      const r = await axios.get<GetAvailableNFTListResp>(
        `/proxy/service/main/v1/getAvailableNFTList?wallet_pub=${user.wallet_pub}`
      );
      setMintEligible(r.data.list.length > 0);
      console.log(r.data, r.data.list.length > 0);
    };
    if (user) checkEligibility();
  }, [user]);

  const callMint = async () => {
    const resp = await call<NFTMintResp>({
      method: "post",
      path: "/nft/mint",
    });
    if (resp == null || resp.hash === "") {
      alert("Error when minting");
    } else {
      alert(`Success. Here is tx hash: ${resp.hash}`);
    }
    console.log(resp);
  };

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            NCT Retirement Leaderboard
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Ranking of Nature Carbon Tonne (NCT) Retirement on Toucan
          </p>
        </div>
        <div>
          {user &&
            (mintEligible ? (
              <span className="mr-4 sm:mr-6 lg:mr-8 ml-3 inline-flex items-center space-x-2">
                <button
                  type="button"
                  onClick={async () => {
                    setOpenNFTNotice(true);
                  }}
                  className="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Claim NFT Badges
                </button>
              </span>
            ) : (
              <span className="mr-4 sm:mr-6 lg:mr-8 ml-3  inline-flex items-center space-x-2">
                <button
                  disabled
                  className="inline-flex justify-center py-2 px-4 
            shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 opacity-50 cursor-not-allowed"
                >
                  No NFT available to claim at the moment
                </button>
                <HoverCard width={320} shadow="md">
                  <HoverCard.Target>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-teal-300 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <p className="text-sm sm:text-base">
                      This minting event is only available to those who had made NCT retirement by Aug 31,
                      2022. More will be announced in the future.
                    </p>
                  </HoverCard.Dropdown>
                </HoverCard>
              </span>
            ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="mt-4">
            <div className="block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex" aria-label="Tabs">
                  {tabs.map((tab, index) => (
                    <a
                      key={tab.name}
                      href={tab.href}
                      onClick={() => {
                        setTabSelected(index);
                      }}
                      className={classNames(
                        index == tabSelected
                          ? "border-teal-500 text-teal-600 bg-white"
                          : "border-transparent text-gray-400 opacity-50 hover:text-gray-700 hover:border-gray-300",
                        `w-1/3`,
                        "py-4 px-1 text-center border-b-2 font-medium text-sm"
                      )}
                      aria-current={index == tabSelected ? "page" : undefined}
                    >
                      {tab.name}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          <div className="mt-2 flex flex-row gap-x-8 sm:gap-x-10 lg:gap-x-12">
            {tabs[tabSelected].showYear && (
              <select
                id="year"
                name="year"
                className="mt-1 block w-1/2 pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                onChange={(e) => setyearSelected(parseInt(e.target.value))}
                value={yearSelected}
              >
                {yearRange.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            )}
            {tabs[tabSelected].showQuarter && (
              <select
                id="quarter"
                name="quarter"
                className="mt-1 block w-1/2 pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                onChange={(e) => setQuarterSelected(parseInt(e.target.value))}
                value={quarterSelected}
              >
                {quarterRange.map((item) => (
                  <option key={item} value={item}>
                    Q{item}
                  </option>
                ))}
              </select>
            )}
            {tabs[tabSelected].showMonth && (
              <select
                id="month"
                name="month"
                className="mt-1 block w-1/2 pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                onChange={(e) => setMonthSelected(parseInt(e.target.value))}
                value={monthSelected}
              >
                {monthRange.map((item) => (
                  <option key={item} value={item}>
                    {/* Date takes 0-based month */}
                    {new Date(2009, item - 1, 1).toLocaleString("en-US", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
            )}
          </div>
          {/* Ranking table */}
          <div className="mt-4 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Rank
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Name / ENS / Address
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Account type
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Retirement
                        </th>
                        {/* <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th> */}
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {status === "fetched" &&
                        rankingData?.map(
                          (user: LeaderboardReturnItem, index) => (
                            <tr
                              key={user.address}
                              className={
                                index % 2 === 0 ? undefined : "bg-gray-50"
                              }
                            >
                              {index === 0 && (
                                <td className="whitespace-nowrap w-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                  <div className="w-8 h-8 rounded-full bg-[#F3C23C] text-white flex justify-center items-center">
                                    {index + 1}
                                  </div>
                                </td>
                              )}
                              {index === 1 && (
                                <td className="whitespace-nowrap w-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                  <div className="w-8 h-8 rounded-full bg-[#BDCBD8] text-white flex justify-center items-center">
                                    {index + 1}
                                  </div>
                                </td>
                              )}
                              {index === 2 && (
                                <td className="whitespace-nowrap w-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                  <div className="w-8 h-8 rounded-full bg-[#D7A778] text-white flex justify-center items-center">
                                    {index + 1}
                                  </div>
                                </td>
                              )}
                              {index > 2 && (
                                <td className="whitespace-nowrap w-4 py-4 pl-4 pr-3 text-sm font-medium text-center text-gray-900 sm:pl-6">
                                  {index + 1}
                                </td>
                              )}
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {/* Link to profile page. If no profile, link to polygonscan */}
                                {
                                  <span className="flex flex-row items-center space-x-1">
                                    <a
                                      href={getUserNameLink(user)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {getUserDisplayName(user)}
                                    </a>
                                    {user?.twitter && (
                                      <a
                                        href={
                                          "https://twitter.com/" + user?.twitter
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <svg
                                          className="text-[#1D9BF0] fill-current h-4 w-4"
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            opacity="0"
                                            d="M0 0h24v24H0z"
                                          ></path>
                                          <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
                                        </svg>
                                      </a>
                                    )}
                                  </span>
                                  // )
                                }
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {user.is_contract ? "Contract" : "Address"}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {(
                                  Math.round(user?.total_retirement * 100) / 100
                                ).toFixed(2)}
                              </td>
                              {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{.role}</td> */}
                            </tr>
                          )
                        )}
                      {status === "error" && <div>{error}</div>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Transition.Root show={openNFTNotice} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setOpenNFTNotice}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      This is a Testnet mint
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-left text-gray-500">
                        Since you had made NCT retirement before Aug 31, 2022,
                        you are eligible to receive NFT badages that will
                        display your monthly and/or quarterly ranks. <br />
                        <br />
                        NFTs are currently on Mumbai TestNet. We will collect
                        community feedbacks on this iteration and roll out on
                        MATIC later (which likely includes airdrops to those who
                        have minted on Mumbai).
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:text-sm"
                    onClick={async () => {
                      setOpenNFTNotice(false);
                      await callMint();
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
