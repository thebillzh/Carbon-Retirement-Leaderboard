import Image from "next/image";
import Link from "next/link";

export const getServerSideProps = async () => {
  const resp = await fetch(
    "http://toucan-leaderboard.herokuapp.com/leaderboard"
  );
  const data = await resp.json();
  const userList = new Array<User>();
  let index = 0;
  for (const user of data.users) {
    userList.push({ address: user, retired_nct: data.retired_nct[index++] });
    console.log(user);
  }
  return { props: { userList } };
};

interface HomeProps {
  userList: Array<User>;
}

interface User {
  address: string;
  retired_nct: string;
}

const Home = ({ userList }: HomeProps) => {
  return (
    <div className="font-sans text-tc-dark text-base antialiased">
      <div className="h-[500px] sm:h-[600px] relative overflow-hidden bg-gradient-to-b from-[#0C111D] via-[#0C111D] to-[#2D4165]">
        <div className="absolute z-20 left-0 right-0 h-20 px-4 sm:px-8 max-w-screen-xl mx-auto text-white flex items-center justify-between">
          <div className="w-28">
            <Link href="/">
              <div className="block overflow-hidden relative box-border m-0">
                <div className="block box-border pt-[353.125%]"></div>
                <Image
                  src="/images/tc_full_OnDark_color.svg"
                  layout="fill"
                  objectFit="contain"
                  alt=""
                />
              </div>
            </Link>
          </div>
          <div className="hidden lg:flex space-x-10">
            <a
              className="text-base font-medium text-white hover:text-gray-400"
              href="https://docs.toucan.earth"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
            <a
              className="text-base font-medium text-white hover:text-gray-400"
              href="https://toucan-protocol.notion.site/About-68694adef18f4613a5f5b594a2d4a407"
              target="_blank"
              rel="noopener noreferrer"
            >
              About
            </a>
            <a
              className="text-base font-medium text-white hover:text-gray-400"
              href="https://boards.eu.greenhouse.io/toucanearth"
              target="_blank"
              rel="noopener noreferrer"
            >
              Jobs
            </a>
            <a
              className="text-base font-medium text-white hover:text-gray-400"
              href="https://blog.toucan.earth"
              target="_blank"
              rel="noopener noreferrer"
            >
              Blog
            </a>
          </div>
          <div className="flex items-center space-x-6 -mr-6 lg:mr-0">
            <a
              className="cursor-pointer hover:opacity-75 transition-opacity duration-300 inline-flex items-center px-4 py-2.5 font-semibold rounded-lg shadow-sm ring-2 ring-white text-white hover:text-white"
              href="https://toucan.earth/overview"
              target="_blank"
              rel="noopener noreferrer"
            >
              Launch App
            </a>
            <button className="lg:hidden p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="relative w-full h-5/6 flex justify-center items-center px-4 sm:px-8">
          <span className="text-white text-4xl sm:text-6xl">
            Carbon Retirement Leaderboard
          </span>
        </div>
      </div>
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 -mt-52">
          <div className="max-w-screen-xl overflow-x-auto lg:overflow-visible p-8 mx-auto">
            <div className="p-8 lg:px-16 space-y-4 bg-white rounded-2xl flex flex-col min-w-[300px] min-h-[1000px]">
              <div className="lg:mt-8 overflow-x-scroll shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                      >
                        Rank
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Address / ENS Username
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                      >
                        Retired NCT
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {userList.map((user, index) => (
                      <tr key={user.address}>
                        <th
                          scope="col"
                          className={`px-3 py-3.5 text-left text-sm sm:table-cell ${
                            index <= 2
                              ? "font-bold text-red-600"
                              : "font-normal text-gray-900"
                          }`}
                        >
                          {index + 1}
                        </th>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {user.address}
                        </td>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                        >
                          {user.retired_nct}
                        </th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div
          className="pt-80"
          style={{
            background:
              "linear-gradient(0deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)), linear-gradient(179.44deg, rgba(255, 255, 255, 0) 16.41%, #FFFFFF 74.5%), conic-gradient(from -46.49deg at 50% 12.09%, #FFE9F6 0deg, #FFDBE6 59.85deg, #E9F4FF 120deg, #FFE9F6 360deg)",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Home;
