import { RANKING_API_BASE_URL } from "@constants/constants";
import { LeaderboardReturnItem } from "@model/model";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Layout from "../components/common/layout";
import Leaderboard, {
  JSONToLeaderboardData,
} from "../components/leaderboard/leaderboard";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const params = new URLSearchParams({
    first: "1000",
    type: "nct",
  });
  const firstAllTimeAPIURL = RANKING_API_BASE_URL + "?" + params.toString();

  const resp = await fetch(firstAllTimeAPIURL);
  const JSONdata = await resp.json();

  const firstAllTimeRankData = JSONToLeaderboardData(JSONdata);

  return { props: {firstAllTimeRankData,firstAllTimeAPIURL } };
};

export interface HomeProps {
  firstAllTimeRankData: LeaderboardReturnItem[];
  firstAllTimeAPIURL: string;
}

const Index = ({ firstAllTimeRankData, firstAllTimeAPIURL }: HomeProps) => {
    return (
    <Layout>
      <Leaderboard
        firstAllTimeRankData={firstAllTimeRankData}
        firstAllTimeAPIURL={firstAllTimeAPIURL}
      />
    </Layout>
  );
};

export default Index;
