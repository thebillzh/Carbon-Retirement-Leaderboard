import Layout from "@components/common/layout";

const attachments = [
  { name: "resume_front_end_developer.pdf", href: "#" },
  { name: "coverletter_front_end_developer.pdf", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProfileEdit() {
  return (
    <Layout>
      Profile Edit
    </Layout>
  );
}
