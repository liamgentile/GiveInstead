import { UserProfile } from "@clerk/clerk-react";
import Layout from "../components/Layout";
export default function Profile() {
  return (
    <Layout>
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
            <UserProfile
              appearance={{
                elements: {
                  rootBox: "w-full",
                  pageScrollBox: "overflow-y-hidden"
                },
              }}
            />
        </div>
      </main>
    </Layout>
  );
}
