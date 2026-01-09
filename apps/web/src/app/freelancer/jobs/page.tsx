"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createApplication } from "../../../services/applications";
import { listJobs, type ListJobsParams } from "../../../services/jobs";

type FilterDraft = {
  skill: string;
  location: string;
  availability: string;
};

const emptyFilters: FilterDraft = {
  skill: "",
  location: "",
  availability: ""
};

type ApplicationFeedback = {
  tone: "success" | "error";
  message: string;
};

export default function FreelancerJobsPage() {
  const [draftFilters, setDraftFilters] = useState<FilterDraft>(emptyFilters);
  const [filters, setFilters] = useState<ListJobsParams | null>(null);
  const [applicationNotes, setApplicationNotes] = useState<Record<string, string>>(
    {}
  );
  const [feedbackByJob, setFeedbackByJob] = useState<
    Record<string, ApplicationFeedback | undefined>
  >({});
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["jobs", "feed", filters],
    queryFn: () => listJobs(filters ?? undefined)
  });

  const applyMutation = useMutation({
    mutationFn: createApplication,
    onMutate: (variables) => {
      setActiveJobId(variables.jobId);
      setFeedbackByJob((current) => ({
        ...current,
        [variables.jobId]: undefined
      }));
    },
    onSuccess: (_, variables) => {
      setFeedbackByJob((current) => ({
        ...current,
        [variables.jobId]: {
          tone: "success",
          message: "Application sent."
        }
      }));
      setApplicationNotes((current) => ({
        ...current,
        [variables.jobId]: ""
      }));
    },
    onError: (err, variables) => {
      if (!variables) return;
      setFeedbackByJob((current) => ({
        ...current,
        [variables.jobId]: {
          tone: "error",
          message: err instanceof Error ? err.message : "Unable to apply."
        }
      }));
    },
    onSettled: () => {
      setActiveJobId(null);
    }
  });

  const jobs = data ?? [];

  const handleDraftChange = (field: keyof FilterDraft) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setDraftFilters((current) => ({ ...current, [field]: event.target.value }));
    };
  };

  const applyFilters = () => {
    const nextFilters: ListJobsParams = {
      skill: draftFilters.skill.trim() || undefined,
      location: draftFilters.location.trim() || undefined,
      availability: draftFilters.availability.trim() || undefined
    };
    const hasFilters = Object.values(nextFilters).some(Boolean);
    setFilters(hasFilters ? nextFilters : null);
  };

  const clearFilters = () => {
    setDraftFilters(emptyFilters);
    setFilters(null);
  };

  const handleNoteChange = (jobId: string) => {
    return (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = event.target.value;
      setApplicationNotes((current) => ({ ...current, [jobId]: value }));
    };
  };

  const handleApply = (jobId: string) => {
    const note = applicationNotes[jobId]?.trim();
    applyMutation.mutate({
      jobId,
      note: note ? note : undefined
    });
  };

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

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="filter-skill">
                Role or skill
              </label>
              <input
                id="filter-skill"
                type="text"
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                value={draftFilters.skill}
                onChange={handleDraftChange("skill")}
                placeholder="e.g. Offshore ops"
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="filter-location">
                Location
              </label>
              <input
                id="filter-location"
                type="text"
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                value={draftFilters.location}
                onChange={handleDraftChange("location")}
                placeholder="e.g. Oslo"
              />
            </div>
            <div className="flex-1 space-y-2">
              <label
                className="block text-sm font-semibold text-slate-700"
                htmlFor="filter-availability"
              >
                Availability
              </label>
              <input
                id="filter-availability"
                type="text"
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                value={draftFilters.availability}
                onChange={handleDraftChange("availability")}
                placeholder="e.g. Q2 2026"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="flex-1 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              onClick={applyFilters}
            >
              Apply filters
            </button>
            <button
              type="button"
              className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>
        </section>

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
          {jobs.map((job) => {
            const feedback = feedbackByJob[job.id];
            const isApplying = applyMutation.isPending && activeJobId === job.id;
            const noteId = `apply-note-${job.id}`;
            return (
              <div
                key={job.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-slate-900">
                      {job.title}
                    </h2>
                    <p className="text-sm text-slate-600">{job.description}</p>
                    <p className="text-xs text-slate-500">
                      {job.location} - {job.duration} - {job.timing}
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
                <div className="mt-4 space-y-3">
                  <label
                    className="block text-sm font-semibold text-slate-700"
                    htmlFor={noteId}
                  >
                    Add a note (optional)
                  </label>
                  <textarea
                    id={noteId}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                    rows={3}
                    value={applicationNotes[job.id] ?? ""}
                    onChange={handleNoteChange(job.id)}
                    placeholder="Share a quick summary of your experience."
                  />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => handleApply(job.id)}
                      disabled={isApplying}
                    >
                      {isApplying ? "Submitting..." : "Apply to job"}
                    </button>
                    {feedback ? (
                      <p
                        className={`text-sm ${
                          feedback.tone === "success"
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }`}
                      >
                        {feedback.message}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
