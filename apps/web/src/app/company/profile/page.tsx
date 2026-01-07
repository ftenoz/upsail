"use client";

import { useEffect, useState } from "react";
import type { CompanyProfile } from "@upsail/shared";
import {
  createCompanyProfile,
  getCompanyProfile,
  updateCompanyProfile
} from "../../../services/company";

type CompanyProfileForm = {
  name: string;
  description: string;
  contactEmail: string;
  location: string;
};

const emptyForm: CompanyProfileForm = {
  name: "",
  description: "",
  contactEmail: "",
  location: ""
};

const toFormState = (profile: CompanyProfile): CompanyProfileForm => ({
  name: profile.name,
  description: profile.description ?? "",
  contactEmail: profile.contactEmail,
  location: profile.location ?? ""
});

export default function CompanyProfilePage() {
  const [formState, setFormState] = useState<CompanyProfileForm>(emptyForm);
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
        const result = await getCompanyProfile();
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

  const handleChange = (field: keyof CompanyProfileForm) => {
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
      name: formState.name.trim(),
      description: formState.description.trim() || undefined,
      contactEmail: formState.contactEmail.trim(),
      location: formState.location.trim() || undefined
    };

    try {
      if (hasProfile) {
        await updateCompanyProfile(payload);
      } else {
        await createCompanyProfile(payload);
      }
      setHasProfile(true);
      setMessage("Company profile saved.");
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
            Company profile
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Tell freelancers who you are
          </h1>
          <p className="text-sm text-slate-600">
            Share the essentials so candidates understand your work environment and
            how to reach you.
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
            <label className="block text-sm font-semibold text-slate-700" htmlFor="company-name">
              Company name
            </label>
            <input
              id="company-name"
              type="text"
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
              value={formState.name}
              onChange={handleChange("name")}
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="company-description">
              Description
            </label>
            <textarea
              id="company-description"
              className="min-h-[120px] w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
              value={formState.description}
              onChange={handleChange("description")}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="contact-email">
                Contact email
              </label>
              <input
                id="contact-email"
                type="email"
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                value={formState.contactEmail}
                onChange={handleChange("contactEmail")}
                required
              />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="company-location">
                Location
              </label>
              <input
                id="company-location"
                type="text"
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                value={formState.location}
                onChange={handleChange("location")}
              />
            </div>
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
