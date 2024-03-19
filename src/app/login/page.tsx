"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import Image from "next/image";
import { supabase } from "@/supabase";
import { useContext, useEffect } from "react";
import { UserIdContext } from "@/components/userid-provider";

export default function Login() {
  const { setUserId } = useContext(UserIdContext);
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setUserId(session?.user.id as string);
        window.location.href = "/";
      }
    });
  });
  return (
    <div className="max-w-3xl mx-auto h-screen flex flex-col items-center justify-center text-white">
      <section className="flex flex-col items-center">
        <Image src="/logo.svg" alt="Logo" height={100} width={100} />
        <h1 className="text-3xl lg:text-4xl font-bold">
          <span className="text-primary">Agritalk</span> AI
        </h1>
        <h4>
          Ask your <span className="text-primary">queries</span> and get it{" "}
          <span className="text-primary">answered</span>
        </h4>
      </section>
      <div className="w-full">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          theme="dark"
          redirectTo="/"
        />
      </div>
    </div>
  );
}
