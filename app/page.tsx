import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SplitText from "@/components/SplitText";

import { ArrowLeftRight, BookOpen, Landmark, ShieldCheck } from "lucide-react";
const features = [
  {
    icon: Landmark,
    title: "Accounts",
    description: "Open and manage customer accounts with real-time balances.",
  },
  {
    icon: ArrowLeftRight,
    title: "Transfers",
    description: "Move money between accounts with safe, atomic transactions.",
  },
  {
    icon: BookOpen,
    title: "Ledger",
    description: "Account a customer balance changes, penny by penny.",
  },
  {
    icon: ShieldCheck,
    title: "Audit trail",
    description: "Every operation is recorded and traceable.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          VeloxBank
        </Link>
        <nav className="flex gap-1">
          <Link
            href="#features"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Features
          </Link>
          <Link href="/auth" className={buttonVariants({ size: "sm" })}>
            Sign in
          </Link>
        </nav>
      </header>

      <Separator />

      <main className="flex-1">
        <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
          <SplitText
            tag="h1"
            text="Simple core banking"
            className="text-4xl font-semibold tracking-tight sm:text-5xl"
            splitType="words"
            trigger="load"
            delay={80}
            duration={0.8}
          />
          <p className="mt-4 max-w-xl text-muted-foreground">
            VeloxBank is a mini core-banking platform for accounts, transfers,
            and ledgers — fast, reliable, and built to grow.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              href="/auth?mode=register"
              className={buttonVariants({ size: "lg" })}
            >
              Get started
            </Link>
            <Link
              href="#features"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Explore features
            </Link>
          </div>
        </section>

        <section
          id="features"
          className="mx-auto grid max-w-5xl gap-4 px-6 pb-24 sm:grid-cols-2"
        >
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader>
                <Icon className="mb-2 size-5 text-muted-foreground" />
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>
      </main>

      <Separator />

      <footer className="mx-auto w-full max-w-5xl px-6 py-6 text-sm text-muted-foreground">
        © 2026 VeloxBank
      </footer>
    </div>
  );
}
