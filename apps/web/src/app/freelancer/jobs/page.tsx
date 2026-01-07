"use client";

import { useState } from "react";
import Link from "next/link";

type JobPreview = {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  location: string;
};

const jobPreviews: JobPreview[] = [
  {
    id: "job-001",
    title: "Offshore maintenance planner",
    companyId: "company-001",
    companyName: "Seaworthy Co.",
    location: "Oslo"
  }
];

export default function FreelancerJobsPage() {
  const [companyId, setCompanyId] = useState("");
  const profileHref = companyId ? `/company/${encodeURIComponent(companyId)}` : "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
      <div className="w-full max-w-2xl space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            Freelancer jobs
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Job opportunities will be listed here after onboarding.
          </p>
        </div>

        <section className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Company profile
          </p>
          <label className="block text-sm font-semibold text-slate-700" htmlFor="company-id">
            Company ID from a job posting
          </label>
          <input
            id="company-id"
            type="text"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
            value={companyId}
            onChange={(event) => setCompanyId(event.target.value)}
            placeholder="e.g. 0d8b9c74-3c6f-4a3f-9e3f-9c2d4a9b7f4a"
          />
          {profileHref ? (
            <Link className="text-sm font-semibold text-slate-900 underline" href={profileHref}>
              View company profile
            </Link>
          ) : (
            <p className="text-sm text-slate-500">
              Enter a company ID to view the profile.
            </p>
          )}
        </section>

        <section className="space-y-4 rounded-2xl border border-slate-100 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Job previews
            </p>
            <span className="text-xs text-slate-400">Sample data</span>
          </div>
          <div className="space-y-3">
            {jobPreviews.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{job.title}</p>
                    <p className="text-xs text-slate-500">
                      {job.companyName} · {job.location}
                    </p>
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
          </div>
        </section>
      </div>
    </main>
  );
}
