import { createClient } from "@/lib/supabase/server";

export default async function UserName() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name = user?.user_metadata?.name || "User";

  return name;
}
