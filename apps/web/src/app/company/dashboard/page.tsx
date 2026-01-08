"use client";

import { useState } from "react";
import Link from "next/link";

type ApplicationPreview = {
  id: string;
  freelancerId: string;
  freelancerName: string;
  role: string;
};

const applicationPreviews: ApplicationPreview[] = [
  {
    id: "app-001",
    freelancerId: "freelancer-001",
    freelancerName: "Avery Chen",
    role: "Chief Engineer"
  }
];

export default function CompanyDashboardPage() {
  const [freelancerId, setFreelancerId] = useState("");
  const profileHref = freelancerId
    ? `/freelancer/${encodeURIComponent(freelancerId)}`
    : "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            Company dashboard
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Your company workspace will appear here after onboarding.
          </p>
        </div>

        <div className="flex justify-center">
          <Link
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
            href="/company/profile"
          >
            Create or edit company profile
          </Link>
        </div>

        <section className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Freelancer profile lookup
          </p>
          <label
            className="block text-sm font-semibold text-slate-700"
            htmlFor="freelancer-id"
          >
            Freelancer ID from an application
          </label>
          <input
            id="freelancer-id"
            type="text"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
            value={freelancerId}
            onChange={(event) => setFreelancerId(event.target.value)}
            placeholder="e.g. 11a2f6b4-8a31-4c4a-b2e5-3b9a7e4a7c1b"
          />
          {profileHref ? (
            <Link className="text-sm font-semibold text-slate-900 underline" href={profileHref}>
              View freelancer profile
            </Link>
          ) : (
            <p className="text-sm text-slate-500">
              Enter a freelancer ID to view the profile.
            </p>
          )}
        </section>

        <section className="space-y-4 rounded-2xl border border-slate-100 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Recent applications
            </p>
            <span className="text-xs text-slate-400">Sample data</span>
          </div>
          <div className="space-y-3">
            {applicationPreviews.map((application) => (
              <div
                key={application.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {application.freelancerName}
                    </p>
                    <p className="text-xs text-slate-500">{application.role}</p>
                  </div>
                  <Link
                    className="text-sm font-semibold text-slate-900 underline"
                    href={`/freelancer/${encodeURIComponent(application.freelancerId)}`}
                  >
                    Freelancer profile
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
