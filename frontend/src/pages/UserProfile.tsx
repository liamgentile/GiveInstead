import { UserProfile } from "@clerk/clerk-react";
import Layout from "../components/Layout";
export default function Profile() {
  return (
    <Layout>
      <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm">
            <UserProfile
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "border-0 shadow-none p-4 sm:p-6",
                  headerTitle:
                    "text-xl sm:text-2xl font-semibold text-gray-900",
                  headerSubtitle: "text-gray-600",
                  formButtonPrimary:
                    "bg-green-600 hover:bg-green-700 text-white rounded-md",
                  formButtonReset:
                    "border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-md",
                  formFieldInput:
                    "rounded-md border-gray-200 focus:ring-green-500 focus:border-green-500",
                  profileSectionTitleText: "text-lg font-medium text-gray-900",
                  accordionTriggerButton: "hover:bg-green-50",
                },
              }}
            />
          </div>
        </div>
      </main>
    </Layout>
  );
}
