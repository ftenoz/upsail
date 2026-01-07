import Link from "next/link";

export default function CompanyDashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
      <div className="max-w-xl space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Company dashboard
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Your company workspace will appear here after onboarding.
          </p>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
          href="/company/profile"
        >
          Create or edit company profile
        </Link>
      </div>
    </main>
  );
}
