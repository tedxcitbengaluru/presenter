import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { AuthCard } from "@/components/auth/card";
import { LoaderAtomic } from "@/components/utils/loader";

export default async function LoginPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  });

  const sessionResponse = await supabase.auth.getSession();

  const currentSession = sessionResponse.data.session;

  if (!currentSession) {
    return (
      <>
        <AuthCard />
      </>
    );
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <LoaderAtomic className="w-8 h-8" />
    </div>
  );
}
