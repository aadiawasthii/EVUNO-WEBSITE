"use client";

import { useActionState } from "react";

import { buttonStyles } from "@/components/ui/button";
import type { AdminActionState } from "@/lib/actions/admin";
import { loginAdminAction } from "@/lib/actions/admin";

const initialState: AdminActionState = {
  error: null
};

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdminAction, initialState);

  return (
    <form action={formAction} className="glass-panel mx-auto max-w-md p-8">
      <p className="eyebrow">Protected Route</p>
      <h1 className="mt-4 text-3xl uppercase tracking-[0.14em]">Admin access</h1>
      <p className="mt-4 text-sm leading-7 text-steel">
        Use the secure admin secret from your environment configuration to enter the dashboard.
      </p>
      <label className="mt-8 block">
        <span className="text-xs uppercase tracking-[0.24em] text-steel">Admin secret</span>
        <input
          className="input-shell mt-2"
          type="password"
          name="secret"
          autoComplete="current-password"
          required
        />
      </label>
      {state.error ? <p className="mt-4 text-sm text-rose-300">{state.error}</p> : null}
      <button type="submit" className={`${buttonStyles("primary")} mt-8 w-full`} disabled={isPending}>
        {isPending ? "Verifying" : "Enter dashboard"}
      </button>
    </form>
  );
}
