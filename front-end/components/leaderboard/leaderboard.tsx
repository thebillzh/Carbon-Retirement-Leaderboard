import { User } from "../../pages";

export default function Leaderboard({ rankData }: { rankData: User[] }) {
  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">
          Leaderboard
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Ranking of Carbon Retirement on Toucan
        </p>
      </div>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              {/* <h1 className="text-xl font-semibold text-gray-900">Users</h1> */}
              {/* <p className="mt-2 text-sm text-gray-700">
                  Ranking of Carbon Retirement on Toucan
                </p> */}
            </div>
            {/* <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add user
          </button>
        </div> */}
          </div>
          <div className="mt-8 flex flex-col">
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
                          ENS / Address
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Retirement amount
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
                      {rankData?.map((user, index) => (
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
                            {user.retired_nct}
                          </td>
                          {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{.role}</td> */}
                        </tr>
                      ))}
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
