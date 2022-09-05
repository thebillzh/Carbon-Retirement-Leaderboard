import Layout from "@components/common/layout";
import ProfileCard from "@components/profile/profileCard";
import { useCommonContext } from "@contexts/commonContextProvider";
import useABC from "@lib/common/abc";
import { t_users } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Profile() {
  const { call } = useABC();
  const [profile, setProfile] = useState<t_users>();
  const router = useRouter();
  const { user } = useCommonContext();
  useEffect(() => {
    const f = async () => {
      if (router.isReady && user) {
        const resp = await call<t_users>({
          method: "GET",
          path: "/profile/get",
          params: { address: user.wallet_pub },
        });
        setProfile(resp);
      }
    };
    f();
  }, [call, router.isReady, user]);
  return (
    <Layout>
      <ProfileCard profile={profile} />
    </Layout>
  );
}
