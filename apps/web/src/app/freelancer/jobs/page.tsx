"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { listJobs } from "../../../services/jobs";

export default function FreelancerJobsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["jobs", "feed"],
    queryFn: () => listJobs()
  });

  const jobs = data ?? [];

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            Freelancer jobs
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Browse open roles and connect with verified companies.
          </p>
        </div>

        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error instanceof Error ? error.message : "Unable to load jobs."}
          </p>
        ) : null}

        {isLoading ? (
          <p className="text-center text-sm text-slate-500">Loading jobs...</p>
        ) : null}

        {!isLoading && jobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            No open jobs yet. Check back soon.
          </div>
        ) : null}

        <section className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <h2 className="text-base font-semibold text-slate-900">{job.title}</h2>
                  <p className="text-sm text-slate-600">{job.description}</p>
                  <p className="text-xs text-slate-500">
                    {job.location} · {job.duration} · {job.timing}
                  </p>
                  {job.requirements.length > 0 ? (
                    <ul className="flex flex-wrap gap-2 text-xs text-slate-500">
                      {job.requirements.map((req) => (
                        <li
                          key={req}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1"
                        >
                          {req}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <Link
                  className="text-sm font-semibold text-slate-900 underline"
                  href={`/company/${encodeURIComponent(job.companyId)}`}
                >
                  Company profile
                </Link>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
