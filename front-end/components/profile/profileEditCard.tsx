import Input from "@components/common/input";
import { useCommonContext } from "@contexts/commonContextProvider";
import useABC from "@lib/common/abc";
import { t_users } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { UpdateUserReq, UpdateUserResp } from "pages/api/common/update_user";
import { SubmitHandler, useForm } from "react-hook-form";

interface FromProps {
  uname: string;
  face: string;
  twitter: string;
  email: string;
  about: string;
}

export default function ProfileEditCard({ profile }: { profile: t_users }) {
  const router = useRouter();
  const { user } = useCommonContext();
  const { call } = useABC();

  const { register, handleSubmit } = useForm<FromProps>({
    defaultValues: {
      uname: profile.uname,
      face: profile.face,
      twitter: profile.twitter,
      email: profile.email,
      about: profile.about,
    },
  });
  const onSubmit: SubmitHandler<FromProps> = async (data) => {
    const newFields = {} as UpdateUserReq;
    for (const key of Object.keys(data)) {
      if (data[key]) {
        newFields[key] = data[key];
      }
    }
    await call<UpdateUserResp>({
      method: "post",
      path: "/common/update_user",
      data: {
        ...newFields,
      },
    });
    router.reload();
  };
  return (
    <form className="min-h-full py-10" onSubmit={handleSubmit(onSubmit)}>
      {/* Page header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
        <div className="flex items-center space-x-5">
          <div className="flex-shrink-0">
            <div className="relative h-16 w-16">
              {profile?.face ? (
                <Image
                  className="relative rounded-full"
                  src={profile?.face}
                  layout="fill"
                  objectFit="contain"
                  alt=""
                />
              ) : (
                /* placeholder user profile */
                <svg
                  className="w-full h-full rounded-full text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
              <span
                className="absolute inset-0 shadow-inner rounded-full"
                aria-hidden="true"
              />
            </div>
          </div>
          <div>
            <Input id="uname" placeholder="Your Name" register={register} />
            <p className="text-sm font-medium text-gray-500">
              {profile?.wallet_pub}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
          {profile?.wallet_pub === user?.wallet_pub && (
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Save
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense">
        <div className="space-y-6">
          {/* Description list*/}
          <section aria-labelledby="applicant-information-title">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 ">
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Retiring NCT on Toucan since
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">-</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Total NCT retirement
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">-</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Twitter
                    </dt>
                    <div className="mt-1">
                      <Input
                        id="twitter"
                        placeholder="Your Twitter"
                        register={register}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Community NFTs
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">-</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">About</dt>
                    <div className="mt-1">
                      <label htmlFor="about" className="sr-only">
                        about
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <textarea
                          id="about"
                          name="about"
                          rows={3}
                          className="shadow-sm block w-full focus:ring-teal-500 focus:border-teal-500 sm:text-sm border border-gray-300 rounded-md"
                          placeholder="Write a few sentences about yourself."
                          {...register("about")}
                        />
                      </div>
                    </div>
                  </div>
                </dl>
              </div>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
