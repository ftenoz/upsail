"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, type AuthRole } from "../../../services/auth";

const roleRoutes: Record<AuthRole, string> = {
  company: "/company/profile",
  freelancer: "/freelancer/profile"
};

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AuthRole>("company");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      const result = await registerUser({ email, password, role });
      router.push(roleRoutes[result.role]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to register.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
      <form
        className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50"
        onSubmit={handleSubmit}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Create your Upsail account
          </p>
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">
            Register as a company or freelancer
          </h1>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-slate-700">
            Select your role
          </legend>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              name="role"
              value="company"
              checked={role === "company"}
              onChange={() => setRole("company")}
            />
            Company
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              name="role"
              value="freelancer"
              checked={role === "freelancer"}
              onChange={() => setRole("freelancer")}
            />
            Freelancer
          </label>
        </fieldset>

        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
        >
          Create account
        </button>
      </form>
    </main>
  );
}
