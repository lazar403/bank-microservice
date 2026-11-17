import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAccounts, type Account } from "@/lib/accounts";
import { SESSION_COOKIE } from "@/lib/session";

async function Accounts() {
  const user = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!user) redirect("/auth");

  let accounts: Account[] = [];
  let error = "";
  try {
    accounts = await getAccounts();
  } catch (e) {
    console.error(e);
    error = "Couldn't reach accounts-service. Is the backend even running?";
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Accounts</h1>
          <p className="text-sm text-muted-foreground">Signed in as {user}.</p>
        </div>
        <form action={logout}>
          <Button variant="outline" size="sm" type="submit">
            Sign out
          </Button>
        </form>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {!error && accounts.length === 0 && (
        <p className="text-sm text-muted-foreground">No accounts yet.</p>
      )}

      <div className="grid gap-4">
        {accounts.map((a) => (
          <Card key={a.id}>
            <CardHeader>
              <CardTitle>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: a.currency,
                }).format(a.balance)}
              </CardTitle>
              <CardDescription>
                {a.ownerName} · {a.accountNumber}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </main>
  );
}

export default function AccountsPage() {
  return (
    <Suspense
      fallback={
        <p className="px-6 py-12 text-center text-sm text-muted-foreground">
          Loading accounts…
        </p>
      }
    >
      <Accounts />
    </Suspense>
  );
}
