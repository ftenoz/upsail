"use client";

import { useEffect, useState } from "react";
import type { FreelancerProfile } from "@upsail/shared";
import {
  createFreelancerProfile,
  getFreelancerProfile,
  updateFreelancerProfile
} from "../../../services/freelancer";

type FreelancerProfileForm = {
  skills: string;
  certifications: string;
  location: string;
  availability: string;
  linkedInUrl: string;
};

const emptyForm: FreelancerProfileForm = {
  skills: "",
  certifications: "",
  location: "",
  availability: "",
  linkedInUrl: ""
};

const toFormState = (profile: FreelancerProfile): FreelancerProfileForm => ({
  skills: profile.skills.join(", "),
  certifications: profile.certifications.join(", "),
  location: profile.location ?? "",
  availability: profile.availability ?? "",
  linkedInUrl: profile.linkedInUrl ?? ""
});

const parseList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function FreelancerProfilePage() {
  const [formState, setFormState] = useState<FreelancerProfileForm>(emptyForm);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      setError(null);
      try {
        const result = await getFreelancerProfile();
        if (!isMounted) return;
        if (result.profile) {
          setFormState(toFormState(result.profile));
          setHasProfile(true);
        } else {
          setFormState(emptyForm);
          setHasProfile(false);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Unable to load profile.");
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
  }, []);

  const handleChange = (field: keyof FreelancerProfileForm) => {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState((current) => ({ ...current, [field]: event.target.value }));
    };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setSaving(true);

    const payload = {
      skills: parseList(formState.skills),
      certifications: parseList(formState.certifications),
      location: formState.location.trim() || undefined,
      availability: formState.availability.trim() || undefined,
      linkedInUrl: formState.linkedInUrl.trim() || undefined
    };

    try {
      if (hasProfile) {
        await updateFreelancerProfile(payload);
      } else {
        await createFreelancerProfile(payload);
      }
      setHasProfile(true);
      setMessage("Freelancer profile saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Freelancer profile
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Highlight your expertise
          </h1>
          <p className="text-sm text-slate-600">
            Share your skills and credentials so companies can assess your fit quickly.
          </p>
        </header>

        <form
          className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50"
          onSubmit={handleSubmit}
        >
          {loading ? (
            <p className="text-sm text-slate-500">Loading profile...</p>
          ) : null}

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="skills">
              Skills (comma separated)
            </label>
            <input
              id="skills"
              type="text"
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
              value={formState.skills}
              onChange={handleChange("skills")}
            />
          </div>

          <div className="space-y-3">
            <label
              className="block text-sm font-semibold text-slate-700"
              htmlFor="certifications"
            >
              Certifications (comma separated)
            </label>
            <input
              id="certifications"
              type="text"
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
              value={formState.certifications}
              onChange={handleChange("certifications")}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="location">
                Location
              </label>
              <input
                id="location"
                type="text"
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                value={formState.location}
                onChange={handleChange("location")}
              />
            </div>
            <div className="space-y-3">
              <label
                className="block text-sm font-semibold text-slate-700"
                htmlFor="availability"
              >
                Availability
              </label>
              <input
                id="availability"
                type="text"
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                value={formState.availability}
                onChange={handleChange("availability")}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="linkedin">
              LinkedIn URL
            </label>
            <input
              id="linkedin"
              type="url"
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
              value={formState.linkedInUrl}
              onChange={handleChange("linkedInUrl")}
            />
          </div>

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

          <button
            type="submit"
            className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={saving || loading}
          >
            {saving ? "Saving..." : hasProfile ? "Update profile" : "Create profile"}
          </button>
        </form>
      </div>
    </main>
  );
}
