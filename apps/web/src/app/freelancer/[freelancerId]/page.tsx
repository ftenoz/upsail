"use client";

import { useEffect, useState } from "react";
import type { FreelancerProfile } from "@upsail/shared";
import { getPublicFreelancerProfile } from "../../../services/freelancer";

type PageProps = {
  params: {
    freelancerId: string;
  };
};

const formatList = (items: string[]) => {
  if (items.length === 0) return "Not specified";
  return items.join(", ");
};

export default function FreelancerPublicProfilePage({ params }: PageProps) {
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      setError(null);
      try {
        const data = await getPublicFreelancerProfile(params.freelancerId);
        if (isMounted) {
          setProfile(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Unable to load freelancer profile."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadProfile();
    return () => {
      isMounted = false;
    };
  }, [params.freelancerId]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Freelancer profile
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            {profile ? "Freelancer details" : "Freelancer profile"}
          </h1>
        </header>

        {loading ? (
          <p className="text-sm text-slate-500">Loading profile...</p>
        ) : null}

        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        {profile ? (
          <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Skills
              </h2>
              <p className="mt-3 text-base text-slate-700">
                {formatList(profile.skills)}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Certifications
              </h2>
              <p className="mt-3 text-base text-slate-700">
                {formatList(profile.certifications)}
              </p>
            </div>
            <div className="grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Location
                </p>
                <p className="mt-2 text-slate-900">
                  {profile.location || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Availability
                </p>
                <p className="mt-2 text-slate-900">
                  {profile.availability || "Not specified"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                LinkedIn
              </p>
              <p className="mt-2">
                {profile.linkedInUrl ? (
                  <a
                    className="text-slate-900 underline"
                    href={profile.linkedInUrl}
                  >
                    View LinkedIn profile
                  </a>
                ) : (
                  <span className="text-slate-500">Not provided</span>
                )}
              </p>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
