import Layout from "../components/layout";
import Leaderboard from "../components/leaderboard";
import SimpleFooter from "../components/simpleFooter";
import SimpleHeader from "../components/simpleHeader";

export const getServerSideProps = async () => {
  const resp = await fetch(
    "http://toucan-leaderboard.herokuapp.com/leaderboard"
  );
  const data = await resp.json();
  const rankData = new Array<User>();
  let index = 0;
  for (const user of data.users) {
    rankData.push({ address: user, retired_nct: data.retired_nct[index++] });
  }
  return { props: { rankData } };
};

interface HomeProps {
  rankData: User[];
}

export interface User {
  address: string;
  retired_nct: string;
}

const Home = ({ rankData }: HomeProps) => {
  return (
    <Layout>
      <Leaderboard rankData={rankData} />
    </Layout>
  );
};

export default Home;
