"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { listJobApplications } from "../../../../services/applications";
import { getJob } from "../../../../services/jobs";

type PageProps = {
  params: {
    jobId: string;
  };
};

const formatTimestamp = (value: string) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
};

export default function CompanyJobApplicationsPage({ params }: PageProps) {
  const jobId = params.jobId;

  const jobQuery = useQuery({
    queryKey: ["jobs", "detail", jobId],
    queryFn: () => getJob(jobId)
  });

  const applicationsQuery = useQuery({
    queryKey: ["applications", jobId],
    queryFn: () => listJobApplications(jobId)
  });

  const isLoading = jobQuery.isLoading || applicationsQuery.isLoading;
  const error = jobQuery.error ?? applicationsQuery.error;
  const job = jobQuery.data;
  const applications = applicationsQuery.data ?? [];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Applications
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Review applicants
          </h1>
          <p className="text-sm text-slate-600">
            Track interest and follow up with freelancers for this role.
          </p>
          <Link
            className="text-sm font-semibold text-slate-900 underline"
            href="/company/jobs"
          >
            Back to job posts
          </Link>
        </header>

        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error instanceof Error ? error.message : "Unable to load data."}
          </p>
        ) : null}

        {isLoading ? (
          <p className="text-center text-sm text-slate-500">Loading job...</p>
        ) : null}

        {job ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-slate-900">
                  {job.title}
                </h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-500">
                  {job.status}
                </span>
              </div>
              <p className="text-sm text-slate-600">{job.description}</p>
              <p className="text-xs text-slate-500">
                {job.location} - {job.duration} - {job.timing}
              </p>
            </div>
          </section>
        ) : null}

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Applications
            </h2>
            {isLoading ? <span className="text-xs text-slate-400">Loading...</span> : null}
          </div>
          {!isLoading && applications.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
              No applications yet. Check back soon.
            </p>
          ) : null}
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-semibold text-slate-900">
                        Freelancer {application.freelancerId}
                      </h3>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-500">
                        {application.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {application.note || "No note provided."}
                    </p>
                    <p className="text-xs text-slate-500">
                      Applied {formatTimestamp(application.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
