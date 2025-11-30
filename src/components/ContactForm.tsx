// src/components/ContactForm.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/** Helpers (no external deps) */
const emailOK = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const phoneOK = (v: string) => {
  const digits = v.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 14;
};
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const toDigits = (v: string) => v.replace(/\D/g, "");

/** A *very* simple ballpark estimator (tweak to your model) */
function estimatePrice(hours: number, people: number) {
  const baseHourly =
    people <= 12 ? 120 :
    people <= 20 ? 160 :
    people <= 30 ? 195 :
    people <= 40 ? 225 :
    260;
  const minHours = 4;
  const billable = Math.max(hours || 0, minHours);
  const subtotal = baseHourly * billable;
  const gratuity = subtotal * 0.18;
  const fees = subtotal * 0.05;
  const low = Math.round(subtotal + fees); // w/out gratuity
  const high = Math.round(subtotal + fees + gratuity);
  return { low, high, hourly: baseHourly, billable };
}

/** Main Component */
export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    pickup: "",
    dropoff: "",
    hours: "4",
    people: "12",
    eventType: "",
    notes: "",
    // honeypot:
    company: "", // bots love this
  });

  // Autosave to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("quoteForm");
      if (saved) setForm((f) => ({ ...f, ...JSON.parse(saved) }));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("quoteForm", JSON.stringify(form));
    } catch {}
  }, [form]);

  // Derived
  const hoursNum = clamp(parseInt(form.hours || "0", 10) || 0, 1, 24);
  const peopleNum = clamp(parseInt(form.people || "0", 10) || 0, 1, 60);
  const est = useMemo(() => estimatePrice(hoursNum, peopleNum), [hoursNum, peopleNum]);

  // Validation
  const touched = useRef<Record<string, boolean>>({});
  const [showErrors, setShowErrors] = useState(false);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!emailOK(form.email)) e.email = "Enter a valid email.";
    if (!phoneOK(form.phone)) e.phone = "Enter a valid phone number.";
    if (!form.date) e.date = "Select a date.";
    if (!form.pickup.trim()) e.pickup = "Where should we pick you up?";
    if (!form.dropoff.trim()) e.dropoff = "Where’s the drop-off?";
    if (!(hoursNum >= 1)) e.hours = "Hours must be at least 1.";
    if (!(peopleNum >= 1)) e.people = "Tell us your group size.";
    // eventType is optional but helps conversion
    return e;
  }, [form, hoursNum, peopleNum]);

  const hasErrors = Object.keys(errors).length > 0;

  // Handlers
  function setField<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function markTouched(key: string) {
    touched.current[key] = true;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOk(null);
    setErr(null);
    setShowErrors(true);

    // Honeypot: if filled, silently "succeed"
    if (form.company.trim().length > 0) {
      setOk("Thanks! We’ll text and email you a quote shortly.");
      return;
    }

    if (hasErrors) {
      // focus the first invalid field
      const firstKey = Object.keys(errors)[0];
      const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${firstKey}"]`);
      el?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          hours: hoursNum,
          people: peopleNum,
          estimate: est,
          submittedAt: new Date().toISOString(),
          source: "ContactForm-v2",
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setOk("Got it! We’ll text & email your quote shortly. You can reply to customize anything.");
      setErr(null);
      // Optional: clear, but keep email/phone for convenience
      setForm((f) => ({
        ...f,
        name: "",
        date: "",
        pickup: "",
        dropoff: "",
        hours: "4",
        people: "12",
        eventType: "",
        notes: "",
      }));
    } catch (e: any) {
      setErr("Sorry—something went wrong. Please try again or call (888) 535-2566.");
      setOk(null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      {/* Header / Trust strip */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-700/20 via-blue-600/10 to-cyan-500/10 p-5 border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Request a Fast, Firm Quote
            </h2>
            <p className="text-blue-200 text-sm md:text-base">
              Under 2 minutes. No spam. A human texts you options & confirms availability.
            </p>
          </div>
          <div className="flex items-center gap-3 text-blue-100 text-sm">
            <span className="px-3 py-1 rounded-full border border-blue-400/30 bg-blue-900/30">Best Price Match</span>
            <span className="px-3 py-1 rounded-full border border-blue-400/30 bg-blue-900/30">Licensed & Insured</span>
            <span className="px-3 py-1 rounded-full border border-blue-400/30 bg-blue-900/30">24/7 Concierge</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* FORM */}
        <div className="lg:col-span-2">
          <form
            onSubmit={onSubmit}
            className="p-6 md:p-8 bg-white rounded-2xl shadow-lg border border-gray-100 space-y-5"
            noValidate
          >
            {/* Hidden Honeypot */}
            <input
              name="company"
              autoComplete="organization"
              tabIndex={-1}
              className="hidden"
              value={form.company}
              onChange={(e) => setField("company", e.target.value)}
            />

            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Full Name"
                name="name"
                placeholder="John Doe"
                value={form.name}
                error={showErrors && touched.current.name ? errors.name : ""}
                onBlur={() => markTouched("name")}
                onChange={(v) => setField("name", v)}
              />
              <Field
                label="Email dont stress too much"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                error={showErrors && touched.current.email ? errors.email : ""}
                onBlur={() => markTouched("email")}
                onChange={(v) => setField("email", v)}
              />
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Mobile Phone"
                name="phone"
                type="tel"
                inputMode="tel"
                placeholder="(555) 555-5555"
                value={form.phone}
                error={showErrors && touched.current.phone ? errors.phone : ""}
                onBlur={() => markTouched("phone")}
                onChange={(v) => setField("phone", v)}
                transformOnChange={(v) => {
                  // basic masking: (XXX) XXX-XXXX
                  const d = toDigits(v).slice(0, 14);
                  if (d.length <= 3) return d;
                  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
                  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
                }}
              />
              <Field
                label="Trip Date"
                name="date"
                type="date"
                placeholder=""
                value={form.date}
                error={showErrors && touched.current.date ? errors.date : ""}
                onBlur={() => markTouched("date")}
                onChange={(v) => setField("date", v)}
              />
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Pickup Area / Address"
                name="pickup"
                placeholder="Downtown Dallas, TX"
                value={form.pickup}
                error={showErrors && touched.current.pickup ? errors.pickup : ""}
                onBlur={() => markTouched("pickup")}
                onChange={(v) => setField("pickup", v)}
              />
              <Field
                label="Drop-off Area / Address"
                name="dropoff"
                placeholder="Fort Worth, TX"
                value={form.dropoff}
                error={showErrors && touched.current.dropoff ? errors.dropoff : ""}
                onBlur={() => markTouched("dropoff")}
                onChange={(v) => setField("dropoff", v)}
              />
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberField
                label="Hours"
                name="hours"
                min={1}
                max={24}
                step={1}
                value={form.hours}
                error={showErrors && touched.current.hours ? errors.hours : ""}
                onBlur={() => markTouched("hours")}
                onChange={(v) => setField("hours", v)}
              />
              <NumberField
                label="People"
                name="people"
                min={1}
                max={60}
                step={1}
                value={form.people}
                error={showErrors && touched.current.people ? errors.people : ""}
                onBlur={() => markTouched("people")}
                onChange={(v) => setField("people", v)}
              />
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Event Type (optional)"
                name="eventType"
                placeholder="Birthday, Wedding, Prom…"
                value={form.eventType}
                onChange={(v) => setField("eventType", v)}
              />
              <Field
                label="Notes (optional)"
                name="notes"
                placeholder="Special requests, timeline, venues…"
                value={form.notes}
                onChange={(v) => setField("notes", v)}
                textarea
              />
            </div>

            {/* Consent + Submit */}
            <div className="flex items-start gap-3">
              <input id="consent" type="checkbox" required className="mt-1" />
              <label htmlFor="consent" className="text-sm text-gray-700">
                I agree to be contacted by phone/SMS & email for my quote. No spam, unsubscribe anytime.
              </label>
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold
                  bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:opacity-95
                  disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending…" : "Get My Quote"}
              </button>
              <p className="text-xs text-gray-500">
                <span className="font-semibold">Privacy:</span> We don’t share your info. Ever.
              </p>
            </div>

            {/* Messages */}
            <div aria-live="polite" className="min-h-6">
              {ok && <div className="text-green-600 text-sm font-medium">{ok}</div>}
              {err && <div className="text-red-600 text-sm font-medium">{err}</div>}
            </div>
          </form>
        </div>

        {/* SIDEBAR — Live Ballpark + Trust */}
        <aside className="space-y-6">
          <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-900 to-blue-700 text-white shadow-xl">
            <h3 className="text-xl font-bold mb-2">Live Ballpark</h3>
            <p className="text-blue-100 text-sm mb-4">
              Final price depends on vehicle, date, and drive time. This helps you plan fast.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-blue-200">Group Size</div>
                <div className="text-2xl font-extrabold">{peopleNum}</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-blue-200">Billable Hours</div>
                <div className="text-2xl font-extrabold">{est.billable}</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-blue-200">Est. Hourly</div>
                <div className="text-2xl font-extrabold">${est.hourly}</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-blue-200">Range</div>
                <div className="text-2xl font-extrabold">${est.low} – ${est.high}</div>
              </div>
            </div>
            <a href="#contact" className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-blue-700 font-semibold hover:opacity-90">
              Lock My Quote <span aria-hidden>→</span>
            </a>
          </div>

          <div className="rounded-2xl p-6 bg-white shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">What happens next?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• A human confirms availability & best-fit vehicles.</li>
              <li>• We text you options and a firm price (no surprises).</li>
              <li>• Approve in 1 tap. We handle everything else.</li>
            </ul>
            <div className="mt-4 text-xs text-gray-500">
              Need it faster? Call <a className="underline" href="tel:18885352566">(888) 535-2566</a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/** Reusable Field components (accessible, minimal, pretty) */

type FieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  textarea?: boolean;
  error?: string;
  transformOnChange?: (v: string) => string;
};

function Field({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  inputMode,
  textarea,
  error,
  transformOnChange,
}: FieldProps) {
  const id = `field-${name}`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-800">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(transformOnChange ? transformOnChange(e.target.value) : e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`border rounded-xl p-3 min-h-[48px] h-[48px] max-h-[120px] resize-y
            ${error ? "border-red-300 ring-2 ring-red-100" : "border-gray-200 focus:ring-2 focus:ring-blue-200"}
          `}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(transformOnChange ? transformOnChange(e.target.value) : e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`border rounded-xl p-3
            ${error ? "border-red-300 ring-2 ring-red-100" : "border-gray-200 focus:ring-2 focus:ring-blue-200"}
          `}
        />
      )}
      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  );
}

type NumberFieldProps = Omit<FieldProps, "textarea" | "type" | "inputMode"> & {
  min?: number;
  max?: number;
  step?: number;
};

function NumberField({ label, name, value, onChange, onBlur, error, min = 1, max = 100, step = 1 }: NumberFieldProps) {
  const id = `field-${name}`;
  const n = parseInt(value || "0", 10) || 0;

  function set(nv: number) {
    const clamped = clamp(nv, min, max);
    onChange(String(clamped));
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-800">
        {label}
      </label>
      <div className={`flex rounded-xl border overflow-hidden ${error ? "border-red-300 ring-2 ring-red-100" : "border-gray-200 focus-within:ring-2 focus-within:ring-blue-200"}`}>
        <button
          type="button"
          onClick={() => set(n - step)}
          className="px-3 bg-gray-50 hover:bg-gray-100 text-gray-700"
          aria-label={`Decrease ${label}`}
        >
          –
        </button>
        <input
          id={id}
          name={name}
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          min={min}
          max={max}
          step={step}
          className="w-full p-3 text-center outline-none"
        />
        <button
          type="button"
          onClick={() => set(n + step)}
          className="px-3 bg-gray-50 hover:bg-gray-100 text-gray-700"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  );
}
