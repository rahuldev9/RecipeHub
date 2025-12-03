import Sidebar from "../components/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import UserName from "../components/UserName";

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gradient-to-b from-orange-50 to-white min-h-screen sm:pt-10 pt-20">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-orange-200 animate-fadeIn max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-orange-600">
            Welcome, <UserName /> 👋
          </h1>

          <p className="text-gray-600 mt-2">
            Here is your personalized RecipeHub dashboard.
          </p>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}
