"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Job } from "@upsail/shared";
import { JobForm } from "../../../features/jobs/job-form";
import { closeJob, createJob, listJobs, updateJob } from "../../../services/jobs";

export default function CompanyJobsPage() {
  const queryClient = useQueryClient();
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["jobs", "mine"],
    queryFn: () => listJobs({ mine: true })
  });

  const jobs = data ?? [];
  const editingJob = useMemo(() => {
    return (data ?? []).find((job) => job.id === editingJobId);
  }, [data, editingJobId]);

  const createMutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      setMessage("Job created.");
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Unable to create job.");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({
      jobId,
      payload
    }: {
      jobId: string;
      payload: Parameters<typeof updateJob>[1];
    }) => updateJob(jobId, payload),
    onSuccess: () => {
      setMessage("Job updated.");
      setError(null);
      setEditingJobId(null);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Unable to update job.");
    }
  });

  const closeMutation = useMutation({
    mutationFn: (jobId: string) => closeJob(jobId),
    onSuccess: () => {
      setMessage("Job closed.");
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Unable to close job.");
    }
  });

  const handleSubmit = (payload: Parameters<typeof createJob>[0]) => {
    setMessage(null);
    setError(null);
    if (editingJob) {
      updateMutation.mutate({ jobId: editingJob.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleCancel = () => {
    setEditingJobId(null);
  };

  const handleEdit = (job: Job) => {
    setMessage(null);
    setError(null);
    setEditingJobId(job.id);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Company jobs
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Create and manage job postings
          </h1>
          <p className="text-sm text-slate-600">
            Publish short-term roles, update details, and close filled positions.
          </p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {editingJob ? "Edit job" : "New job"}
              </p>
              <h2 className="text-lg font-semibold text-slate-900">
                {editingJob ? "Update this role" : "Post a new opportunity"}
              </h2>
            </div>
          </div>
          <JobForm
            job={editingJob}
            onSubmit={handleSubmit}
            onCancel={editingJob ? handleCancel : undefined}
            submitLabel={editingJob ? "Save changes" : "Create job"}
            disabled={createMutation.isPending || updateMutation.isPending}
          />
        </section>

        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            {message}
          </p>
        ) : null}

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Your job posts</h2>
            {isLoading ? <span className="text-xs text-slate-400">Loading...</span> : null}
          </div>
          {jobs.length === 0 && !isLoading ? (
            <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
              No job posts yet. Create your first role above.
            </p>
          ) : null}
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-semibold text-slate-900">
                        {job.title}
                      </h3>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-500">
                        {job.status}
                      </span>
                    </div>
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
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Link
                      className="rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-700"
                      href={`/company/jobs/${encodeURIComponent(job.id)}`}
                    >
                      View applications
                    </Link>
                    <button
                      type="button"
                      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                      onClick={() => handleEdit(job)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => closeMutation.mutate(job.id)}
                      disabled={job.status === "closed" || closeMutation.isPending}
                    >
                      Close
                    </button>
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
