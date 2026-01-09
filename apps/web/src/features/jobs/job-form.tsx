"use client";

import { useEffect, useState } from "react";
import type { Job } from "@upsail/shared";
import type { JobPayload } from "../../services/jobs";

type JobFormState = {
  title: string;
  description: string;
  requirements: string;
  location: string;
  duration: string;
  timing: string;
};

type JobFormProps = {
  job?: Job;
  onSubmit: (payload: JobPayload) => void;
  onCancel?: () => void;
  submitLabel: string;
  disabled?: boolean;
};

const emptyForm: JobFormState = {
  title: "",
  description: "",
  requirements: "",
  location: "",
  duration: "",
  timing: ""
};

const toFormState = (job?: Job): JobFormState => {
  if (!job) return emptyForm;
  return {
    title: job.title,
    description: job.description,
    requirements: job.requirements.join(", "),
    location: job.location ?? "",
    duration: job.duration ?? "",
    timing: job.timing ?? ""
  };
};

const parseList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export function JobForm({
  job,
  onSubmit,
  onCancel,
  submitLabel,
  disabled
}: JobFormProps) {
  const [formState, setFormState] = useState<JobFormState>(() => toFormState(job));

  useEffect(() => {
    setFormState(toFormState(job));
  }, [job]);

  const handleChange = (field: keyof JobFormState) => {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState((current) => ({ ...current, [field]: event.target.value }));
    };
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      title: formState.title.trim(),
      description: formState.description.trim(),
      requirements: parseList(formState.requirements),
      location: formState.location.trim(),
      duration: formState.duration.trim(),
      timing: formState.timing.trim()
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700" htmlFor="job-title">
          Job title
        </label>
        <input
          id="job-title"
          type="text"
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
          value={formState.title}
          onChange={handleChange("title")}
          required
        />
      </div>

      <div className="space-y-2">
        <label
          className="block text-sm font-semibold text-slate-700"
          htmlFor="job-description"
        >
          Description
        </label>
        <textarea
          id="job-description"
          className="min-h-[120px] w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
          value={formState.description}
          onChange={handleChange("description")}
          required
        />
      </div>

      <div className="space-y-2">
        <label
          className="block text-sm font-semibold text-slate-700"
          htmlFor="job-requirements"
        >
          Requirements (comma separated)
        </label>
        <input
          id="job-requirements"
          type="text"
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
          value={formState.requirements}
          onChange={handleChange("requirements")}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label
            className="block text-sm font-semibold text-slate-700"
            htmlFor="job-location"
          >
            Location
          </label>
          <input
            id="job-location"
            type="text"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
            value={formState.location}
            onChange={handleChange("location")}
            required
          />
        </div>
        <div className="space-y-2">
          <label
            className="block text-sm font-semibold text-slate-700"
            htmlFor="job-duration"
          >
            Duration
          </label>
          <input
            id="job-duration"
            type="text"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
            value={formState.duration}
            onChange={handleChange("duration")}
            required
          />
        </div>
        <div className="space-y-2">
          <label
            className="block text-sm font-semibold text-slate-700"
            htmlFor="job-timing"
          >
            Timing
          </label>
          <input
            id="job-timing"
            type="text"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
            value={formState.timing}
            onChange={handleChange("timing")}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="flex-1 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={disabled}
        >
          {submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            className="flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600"
            onClick={onCancel}
            disabled={disabled}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
