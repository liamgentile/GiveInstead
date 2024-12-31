import { UserProfile } from "@clerk/clerk-react";
import Layout from "../components/Layout";
export default function Profile() {
  return (
    <Layout>
      <UserProfile
        appearance={{
          elements: {
            rootBox: "w-full",
            pageScrollBox: "overflow-y-hidden",
          },
        }}
      />
    </Layout>
  );
}
