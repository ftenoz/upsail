export default function CanaryPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-xl rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-xl shadow-slate-200/50">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Upsail baseline
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">
          Canary page is live
        </h1>
        <p className="mt-4 text-base text-slate-600">
          The platform is online with a deployable web and API foundation. You
          can iterate confidently from here.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Status: OK
        </div>
      </div>
    </main>
  );
}
