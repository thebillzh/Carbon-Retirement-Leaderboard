import Layout from "@components/common/layout";
import { useCommonContext } from "@contexts/commonContextProvider";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function ProfileAddress() {
  const { user } = useCommonContext();
  const router = useRouter();
  const address = useMemo(() => {
    if (router.isReady) {
      return router.query.address;
    }
  }, [router.isReady, router.query.address]);
  return (
    <Layout>
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
    </Layout>
  );
}
