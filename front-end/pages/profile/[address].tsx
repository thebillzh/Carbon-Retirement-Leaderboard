import Layout from "@components/common/layout";
import ProfileCard from "@components/profile/profileCard";
import { useLoading } from "@contexts/loadingProvider";
import useABC from "@lib/common/abc";
import { t_users } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

export default function ProfileAddress() {
  const { call } = useABC();
  const [profile, setProfile] = useState<t_users>();
  const [isLoading, setIsLoading] = useState(true);
  const { setLoading } = useLoading();
  const router = useRouter();
  const address = useMemo(() => {
    if (router.isReady) {
      return router.query.address;
    }
  }, [router.isReady, router.query.address]);

  useEffect(() => {
    const f = async () => {
      try {
        if (router.isReady && isLoading) {
          setLoading({ visible: true, isNeedBackground: false });
          const user = await call<t_users>({
            method: "GET",
            path: "/profile/get",
            params: { address: router.query.address },
          });
          setProfile(user);
          setLoading({ visible: false });
          setIsLoading(false);
        }
      } catch (err) {
        setLoading({ visible: false });
        setIsLoading(false);
      }
    };
    f();
  }, [call, isLoading, router.isReady, router.query.address, setLoading]);

  return (
    <Layout>
      {profile ? (
        <ProfileCard profile={profile} />
      ) : !isLoading ? (
        <div className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16">
            <div className="text-center">
              <p className="text-sm font-semibold text-teal-600 uppercase tracking-wide">
                404 error
              </p>
              <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                Address not found.
              </h1>
              <p className="mt-2 text-base text-gray-500">
                Sorry, we couldn&apos;t find the address: {address} you&apos;re
                looking for.
              </p>
              <div className="mt-6">
                <Link href="/">
                  <div className="text-base font-medium text-teal-600 hover:text-teal-500">
                    Go back home<span aria-hidden="true"> &rarr;</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </Layout>
  );
}
