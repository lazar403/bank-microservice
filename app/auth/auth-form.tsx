"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { login, register } from "@/app/actions/auth";
import { LoadingButton } from "@/components/interior/loading-button";
import { SegmentedControl } from "@/components/interior/segmented-control";
import SplitText from "@/components/SplitText";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type Mode = "login" | "register";

const MODES = [
  { value: "login", label: "Sign in" },
  { value: "register", label: "Create account" },
];

export function AuthForm({ initialMode }: { initialMode: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const reduced = useReducedMotion();

  // login slides in from the left, register from the right
  const dir = mode === "login" ? -1 : 1;
  const shift = reduced ? 0 : 32;

  async function submit() {
    setError("");
    const action = mode === "login" ? login : register;
    const result = await action(new FormData(formRef.current!));
    if (result.error) {
      setError(result.error);
      throw new Error(result.error); // puts LoadingButton into its error state
    }
    router.push("/accounts");
  }

  return (
    <div className="relative w-full max-w-sm rounded-2xl bg-card px-6 pt-12 pb-6 ring-1 ring-foreground/10">
      {/* The switch sits on the card's top edge, half outside it */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background">
        <SegmentedControl
          label="Sign in or create an account"
          options={MODES}
          value={mode}
          onValueChange={(v) => {
            setMode(v as Mode);
            setError("");
          }}
        />
      </div>

      <SplitText
        key={mode}
        tag="h1"
        text={mode === "login" ? "Welcome back" : "Open your account"}
        className="text-2xl font-semibold tracking-tight"
        trigger="load"
        delay={25}
        duration={0.6}
      />

      <AnimatePresence mode="wait" initial={false} custom={dir}>
        <motion.form
          key={mode}
          ref={formRef}
          custom={dir}
          variants={{
            enter: (d: number) => ({ x: d * shift, opacity: 0, filter: "blur(4px)" }),
            center: { x: 0, opacity: 1, filter: "blur(0px)" },
            exit: (d: number) => ({ x: -d * shift, opacity: 0, filter: "blur(4px)" }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 400, damping: 36 }}
          onSubmit={(e) => {
            e.preventDefault();
            // Enter key goes through the same animated button
            e.currentTarget.querySelector<HTMLButtonElement>("[data-submit] button")?.click();
          }}
          className="mt-6 flex flex-col gap-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" autoComplete="username" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
            />
          </div>
          {mode === "register" && (
            <div className="grid gap-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                required
              />
            </div>
          )}

          <p role="alert" className="min-h-5 text-sm text-destructive">
            {error}
          </p>

          <span data-submit className="contents">
            <LoadingButton
              onAction={submit}
              pendingLabel={mode === "login" ? "Signing in" : "Creating account"}
              successLabel="Welcome"
              errorLabel="Try again"
              className="w-full"
            >
              {mode === "login" ? "Sign in" : "Create account"}
            </LoadingButton>
          </span>
          {/* Lets the browser submit on Enter, the click is forwarded above */}
          <button type="submit" hidden aria-hidden tabIndex={-1} />
        </motion.form>
      </AnimatePresence>
    </div>
  );
}
