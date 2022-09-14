import Layout from "../components/common/layout";

export default function About() {
  return (
    <Layout>
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-6 prose prose-teal prose-lg text-gray-500 mx-auto">
            <h2 className="text-3xl font-bold leading-tight text-gray-900">
              About
            </h2>
            <p>
              Touch Leaderboard is a community project that aims to promote the
              usage of Toucan&apos;s carbon bridging and retirement functions.{" "}
            </p>
            <p>
              Top retirees will be able to claim NFT badges which will grant
              them various community benefits (such as access to events, limited
              merch). More details are in development.
            </p>
            <h2>Contribute</h2>
            <p>
              This project is being built by a group of Toucan community
              members. It is still a WIP with NFTs on Mumbai Testnet, so any
              feedback or suggestion is more than welcomed.
            </p>
            <p>
              Free feel to join Toucan&apos;s{" "}
              <a
                className="text-teal-600 after:content-['_↗'] ..."
                href="https://discord.com/invite/cDbWuZKWxe"
              >
                Discord
              </a>{" "}
              (and find us in the{" "}
              <span className="italic"> #carbon-analytics</span> channel!) or
              open an issue on our{" "}
              <a
                className="text-teal-600 after:content-['_↗'] ..."
                href="https://github.com/billzhengC/Carbon-Retirement-Leaderboard"
              >
                Github
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
