import { Suspense } from "react";
import Link from "next/link";

import { AuthForm } from "./auth-form";

async function Form({ searchParams }: PageProps<"/auth">) {
  const { mode } = await searchParams;
  return <AuthForm initialMode={mode === "register" ? "register" : "login"} />;
}

export default function AuthPage(props: PageProps<"/auth">) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 px-4">
      <Link href="/" className="text-lg font-semibold tracking-tight">
        VeloxBank
      </Link>
      <Suspense>
        <Form {...props} />
      </Suspense>
      <p className="text-xs text-muted-foreground">
        Demo login: <code>demo</code> / <code>velox123</code>
      </p>
    </main>
  );
}
