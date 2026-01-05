import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Upsail marketplace
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">
          Trusted maritime experts, matched with companies
        </h1>
        <p className="mt-4 text-base text-slate-600">
          Upsail connects maritime companies with vetted freelance experts for
          short-term projects and advisory engagements.
        </p>
        <p className="mt-3 text-base text-slate-600">
          Built for companies seeking specialized talent and freelancers looking
          for meaningful, high-impact work.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
            href="/auth/register"
          >
            Company sign-up
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900"
            href="/auth/register"
          >
            Freelancer sign-up
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Important disclaimers</p>
          <p className="mt-2">
            No payments are processed, and there are no guarantees of engagement
            outcomes.
          </p>
        </div>
      </div>
    </main>
  );
}
