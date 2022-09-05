import Layout from "@components/common/layout";
import ProfileCard from "@components/profile/profileCard";
import { useCommonContext } from "@contexts/commonContextProvider";
import useABC from "@lib/common/abc";
import { t_users } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

export default function ProfileAddress() {
  const { call } = useABC();
  const [profile, setProfile] = useState<t_users>();
  const router = useRouter();
  const address = useMemo(() => {
    if (router.isReady) {
      return router.query.address;
    }
  }, [router.isReady, router.query.address]);

  useEffect(() => {
    const f = async () => {
      if (router.isReady) {
        const user = await call<t_users>({
          method: "GET",
          path: "/profile/get",
          params: { address: router.query.address },
        });
        setProfile(user);
      }
    };
    f();
  }, [call, router.isReady, router.query.address]);

  return (
    <Layout>
      {profile ? (
        <ProfileCard profile={profile} />
      ) : (
        <div className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16">
            <div className="text-center">
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
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
                  <div className="text-base font-medium text-indigo-600 hover:text-indigo-500">
                    Go back home<span aria-hidden="true"> &rarr;</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
