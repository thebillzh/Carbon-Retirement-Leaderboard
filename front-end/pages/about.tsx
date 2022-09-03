import Layout from "../components/common/layout";

export default function About() {
  return (
    <Layout>
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            About
          </h1>
          <p className="mt-2 text-xl text-gray-700">
            Touch Leaderboard is a community project that aims to promote usage
            of Toucan&apos;s carbon bridging and retirement functions. Top
            retirement addresses will be able to claim NFTs and receive various
            community benefits, such as access to events, limited merch etc.
          </p>
        </div>
      </div>
    </Layout>
  );
}
