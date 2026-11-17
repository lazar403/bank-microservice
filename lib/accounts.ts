import { z } from "zod";

const ACCOUNTS_SERVICE_URL =
  process.env.ACCOUNTS_SERVICE_URL ?? "http://localhost:8081";

// AccountDto
export const accountSchema = z.object({
  id: z.union([z.string(), z.number()]),
  accountNumber: z.string(),
  ownerName: z.string(),
  balance: z.number(),
  currency: z.string(),
});

export type Account = z.infer<typeof accountSchema>;

export const getAccounts = async (): Promise<Account[]> => {
  const res = await fetch(`${ACCOUNTS_SERVICE_URL}/api/accounts`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`accounts-service responded ${res.status}`);
  return z.array(accountSchema).parse(await res.json());
};
