import { useLoading } from "@contexts/loadingProvider";
import _ from "lodash";
import { initScriptLoader } from "next/script";
import { useEffect, useReducer, useRef, useState } from "react";
import { User } from "../../pages";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const tabs = [
  {
    name: "Month",
    href: "#",
    showYear: true,
    showQuarter: false,
    showMonth: true,
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
  // {
  //   name: "All Time",
  //   href: "#",
  //   showYear: false,
  //   showQuarter: false,
  //   showMonth: false,
  //   api: "",
  // },
];

const baseURL = "https://toucan-leaderboard.herokuapp.com/";

const useFetch = (url: string) => {
  const cache = useRef({});

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
          const resp = await fetch(url);
          const data = await resp.json();
          const r = new Array<User>();
          let index = 0;
          for (const key in data) {
            r.push({
              address: data[key].beneficiary,
              retired_nct: data[key].retired_nct,
            });
          }
          cache.current[url] = r;

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
  }, [url]);

  return state;
};

export default function Leaderboard() {
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // getMonth is 0-based
  const currentQuarter = Math.floor(today.getMonth() / 3 + 1);
  const currentYear = today.getFullYear();

  const monthRange = _.range(1, 12 + 1);
  const quarterRange = _.range(1, 4 + 1);
  const yearRange = _.range(2022, currentYear + 1);

  const [tabSelected, setTabSelected] = useState(0); // 0=Month, 1=Quarter, 2=All time

  const [monthSelected, setMonthSelected] = useState(currentMonth);
  const [quarterSelected, setQuarterSelected] = useState(currentQuarter);
  const [yearSelected, setyearSelected] = useState(currentYear);

  const { setLoading } = useLoading();

  const apiURL = useRef("");
  if (tabSelected == 2) {
    apiURL.current = baseURL + "leaderboard";
  } else if (tabSelected == 1) {
    apiURL.current = baseURL + `quarterly/${yearSelected}/${quarterSelected}`;
  } else if (tabSelected == 0) {
    apiURL.current = baseURL + `monthly/${yearSelected}/${monthSelected}`;
  } else {
    console.error("Invalid selection");
  }
  const { status, data: rankingData, error } = useFetch(apiURL.current);

  useEffect(() => {
    setLoading({ visible: status === "fetching", isNeedBackground: true });
  }, [status])
  

  // setLoading({ visible: status === "fetching", isNeedBackground: true });

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">
          NCT Retirement Leaderboard
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Ranking of Nature Carbon Tonne (NCT) Retirement on Toucan
        </p>
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
                        `w-1/${tabs.length}`,
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
                          Username / ENS / Address
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
                      {status === "fetched" && rankingData?.map((user, index) => (
                        <tr
                          key={user.address}
                          className={index % 2 === 0 ? undefined : "bg-gray-50"}
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
                            {user.address}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {user.retired_nct.toLocaleString("en-US", {
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{.role}</td> */}
                        </tr>
                      ))}
                      {status === "error" && <div>{error}</div>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
