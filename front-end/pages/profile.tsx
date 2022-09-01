import { PaperClipIcon } from "@heroicons/react/solid";

const attachments = [
  { name: "resume_front_end_developer.pdf", href: "#" },
  { name: "coverletter_front_end_developer.pdf", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  return (
    <>
      <div className="min-h-full">
        <main className="py-10">
          {/* Page header */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
            <div className="flex items-center space-x-5">
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    className="h-16 w-16 rounded-full"
                    src="https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
                    alt=""
                  />
                  <span
                    className="absolute inset-0 shadow-inner rounded-full"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Anon User</h1>
                <p className="text-sm font-medium text-gray-500">0x11111111</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
              >
                Contact
              </button>
            </div>
          </div>

          <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense">
            <div className="space-y-6">
              {/* Description list*/}
              <section aria-labelledby="applicant-information-title">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 ">
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">
                          On Toucan since
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          December 2021
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">
                          Total retirement
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          500 tonnes
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">
                          Twitter
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">@elonmusk</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">
                          Community NFTs
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900"></dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">
                          About
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          Fugiat ipsum ipsum deserunt culpa aute sint do nostrud
                          anim incididunt cillum culpa consequat. Excepteur qui
                          ipsum aliquip consequat sint. Sit id mollit nulla
                          mollit nostrud in ea officia proident. Irure nostrud
                          pariatur mollit ad adipisicing reprehenderit deserunt
                          qui eu.
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
