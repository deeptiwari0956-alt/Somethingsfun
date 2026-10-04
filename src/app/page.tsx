"use client";

import { useMemo, useState } from "react";

type Profile = {
  skill: string;
  level: string;
  goal: string;
  minutes: string;
  days: string;
  timeline: string;
};

const levels = [
  { label: "Starting fresh", sub: "I’m completely new to this" },
  { label: "Some experience", sub: "I know the basics" },
  { label: "Comfortable", sub: "I can already do things on my own" },
  { label: "Advanced", sub: "I want to sharpen and specialize" },
];

const timelines = ["4 weeks", "8 weeks", "12 weeks", "6 months"];

export default function Home() {
  const [onboarding, setOnboarding] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [profile, setProfile] = useState<Profile>({
    skill: "",
    level: "",
    goal: "",
    minutes: "30",
    days: "5",
    timeline: "8 weeks",
  });

  const canContinue = useMemo(() => {
    if (step === 1) return profile.skill.trim().length > 1;
    if (step === 2) return Boolean(profile.level);
    if (step === 3) return profile.goal.trim().length > 4;
    if (step === 4)
      return Number(profile.minutes) > 0 && Number(profile.days) > 0;
    return Boolean(profile.timeline);
  }, [profile, step]);

  const update = (key: keyof Profile, value: string) =>
    setProfile((current) => ({ ...current, [key]: value }));

  const next = () => {
    if (!canContinue) return;

    if (step < 6) {
      setStep((current) => current + 1);
    } else {
      setSubmitted(true);
    }
  };

  const startOver = () => {
    setSubmitted(false);
    setOnboarding(false);
    setStep(1);
  };

  if (onboarding) {
    return (
      <main className="min-h-screen bg-[#fbfbfe]">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <button
            onClick={() => setOnboarding(false)}
            className="text-xl font-bold tracking-tight"
            aria-label="Return to home"
          >
            becurious<span className="text-[#6957ff]">.</span>
          </button>
          <span className="text-sm text-gray-500">Your learning journey</span>
        </header>

        <section className="mx-auto flex min-h-[calc(100vh-96px)] max-w-3xl flex-col px-6 pb-16 pt-8 sm:pt-10">
          {submitted ? (
            <div className="flex flex-1 items-center justify-center py-12">
              <div className="w-full rounded-[2rem] border border-gray-200 bg-white p-8 text-center shadow-xl shadow-gray-200/40 sm:p-12">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#f0eeff] text-2xl">
                  ✦
                </div>
                <p className="mt-7 text-sm font-bold uppercase tracking-[.16em] text-[#6957ff]">
                  Profile ready
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                  Your path starts here.
                </h1>
                <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-gray-500">
                  We’ve captured your goals and schedule. The next step is to
                  turn them into a personalized roadmap for{" "}
                  <strong className="text-gray-800">{profile.skill}</strong>.
                </p>
                <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
                  <MiniStat label="Level" value={profile.level} />
                  <MiniStat
                    label="Weekly time"
                    value={`${profile.minutes} min × ${profile.days}`}
                  />
                  <MiniStat label="Timeline" value={profile.timeline} />
                </div>
                <button
                  onClick={startOver}
                  className="mt-8 rounded-xl bg-[#101828] px-6 py-3.5 text-sm font-semibold text-white hover:bg-black"
                >
                  Start another path
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[.16em] text-gray-400">
                  <span>Step {step} of 6</span>
                  <span>{Math.round((step / 6) * 100)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-[#6957ff] transition-all duration-300"
                    style={{ width: `${(step / 6) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex-1">
                {step === 1 && (
                  <Step
                    title="What do you want to learn?"
                    subtitle="Anything goes. A hard skill, a creative skill, or something you’ve always wanted to try."
                  >
                    <input
                      autoFocus
                      value={profile.skill}
                      onChange={(event) =>
                        update("skill", event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && canContinue) next();
                      }}
                      placeholder="e.g. Python, photography, public speaking..."
                      className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-5 text-lg outline-none transition focus:border-[#6957ff] focus:ring-4 focus:ring-[#6957ff]/10"
                    />
                  </Step>
                )}

                {step === 2 && (
                  <Step
                    title="Where are you right now?"
                    subtitle="We’ll start from your actual level, not a generic beginner course."
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      {levels.map((item) => (
                        <Option
                          key={item.label}
                          selected={profile.level === item.label}
                          onClick={() => update("level", item.label)}
                          title={item.label}
                          sub={item.sub}
                        />
                      ))}
                    </div>
                  </Step>
                )}

                {step === 3 && (
                  <Step
                    title="What does “good” look like?"
                    subtitle="Tell us what you want to be able to do when you’ve made it."
                  >
                    <textarea
                      autoFocus
                      value={profile.goal}
                      onChange={(event) =>
                        update("goal", event.target.value)
                      }
                      placeholder="e.g. Build and deploy my own web app, speak confidently in meetings, or take professional-looking photos..."
                      rows={5}
                      className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-5 py-5 text-lg outline-none transition focus:border-[#6957ff] focus:ring-4 focus:ring-[#6957ff]/10"
                    />
                  </Step>
                )}

                {step === 4 && (
                  <Step
                    title="How much time can you give it?"
                    subtitle="We’ll turn your available time into realistic sessions, not an impossible schedule."
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Minutes per session">
                        <input
                          type="number"
                          min="5"
                          value={profile.minutes}
                          onChange={(event) =>
                            update("minutes", event.target.value)
                          }
                          className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-lg outline-none focus:border-[#6957ff]"
                        />
                      </Field>
                      <Field label="Days per week">
                        <input
                          type="number"
                          min="1"
                          max="7"
                          value={profile.days}
                          onChange={(event) =>
                            update("days", event.target.value)
                          }
                          className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-lg outline-none focus:border-[#6957ff]"
                        />
                      </Field>
                    </div>
                  </Step>
                )}

                {step === 5 && (
                  <Step
                    title="When do you want to get there?"
                    subtitle="Pick a pace. Your plan can adapt later if your schedule changes."
                  >
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {timelines.map((item) => (
                        <Option
                          key={item}
                          selected={profile.timeline === item}
                          onClick={() => update("timeline", item)}
                          title={item}
                          sub=""
                          compact
                        />
                      ))}
                    </div>
                  </Step>
                )}

                {step === 6 && (
                  <Step
                    title="Ready to build your path?"
                    subtitle="Here’s what we’ll use to create your personalized learning engine."
                  >
                    <div className="space-y-1 rounded-3xl border border-gray-200 bg-white p-5">
                      <Summary label="Skill" value={profile.skill} />
                      <Summary label="Current level" value={profile.level} />
                      <Summary label="Goal" value={profile.goal} />
                      <Summary
                        label="Time"
                        value={`${profile.minutes} min × ${profile.days} days/week`}
                      />
                      <Summary label="Timeline" value={profile.timeline} />
                    </div>
                  </Step>
                )}
              </div>

              <div className="mt-10 flex items-center justify-between gap-4">
                <button
                  onClick={() =>
                    step === 1
                      ? setOnboarding(false)
                      : setStep((current) => current - 1)
                  }
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-100"
                >
                  {step === 1 ? "Back" : "← Back"}
                </button>

                <button
                  onClick={next}
                  disabled={!canContinue}
                  className="rounded-xl bg-[#6957ff] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#6957ff]/20 transition hover:bg-[#5646e8] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {step === 6
                    ? "Build my learning path →"
                    : "Continue →"}
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-xl font-bold tracking-tight">
          becurious<span className="text-[#6957ff]">.</span>
        </div>
        <button
          onClick={() => setOnboarding(true)}
          className="rounded-xl px-4 py-2 text-sm font-semibold hover:bg-gray-100"
        >
          Get started
        </button>
      </nav>

      <section className="grid-bg relative mx-4 overflow-hidden rounded-[2rem] border border-[#e7e8ef] bg-[#fafaff] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ddd9ff] bg-white px-3 py-1.5 text-xs font-semibold text-[#6957ff]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6957ff]" />
              Your personal learning engine
            </div>

            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-.045em] sm:text-6xl lg:text-7xl">
              Learn anything.
              <br />
              <span className="text-[#6957ff]">Your way.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-[#667085] sm:text-xl">
              Tell us what you want to learn, where you are, and where you
              want to go. We’ll build the path in between.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <button
                onClick={() => setOnboarding(true)}
                className="rounded-xl bg-[#101828] px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-black/10 hover:bg-black"
              >
                Build my learning path →
              </button>
              <a
                href="#how"
                className="rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                See how it works
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-5 text-sm text-gray-500">
              <span>✓ Any skill</span>
              <span>✓ Your pace</span>
              <span>✓ Adapts as you learn</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-5 rounded-[2rem] bg-[#6957ff]/10 blur-2xl" />
            <div className="relative rounded-[1.75rem] border border-gray-200 bg-white p-5 shadow-2xl shadow-[#101828]/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-400">
                    YOUR PATH
                  </p>
                  <p className="mt-1 font-semibold">Learn Python · 8 weeks</p>
                </div>
                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                  On track
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  "Foundations",
                  "Core Python",
                  "Build real things",
                  "Ship & specialize",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 p-3"
                  >
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-lg text-xs font-bold ${
                        index < 2
                          ? "bg-[#6957ff] text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{item}</p>
                      <div className="mt-1 h-1.5 rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${
                            index < 2
                              ? "w-3/4 bg-[#6957ff]"
                              : "w-1/4 bg-gray-300"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl bg-[#f7f7fb] p-4">
                <p className="text-xs font-semibold text-gray-400">
                  TODAY’S MISSION
                </p>
                <p className="mt-1 text-sm font-semibold">
                  Build a tiny command-line tool
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  25 min · Learn → Try → Build
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[.16em] text-[#6957ff]">
            How it works
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">
            A path made for you, not everyone.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            [
              "01",
              "Tell us about you",
              "Skill, experience, goal, time, and timeline. That’s enough to get started.",
            ],
            [
              "02",
              "We build the path",
              "Your inputs become a practical roadmap with lessons, practice, projects, and milestones.",
            ],
            [
              "03",
              "It learns with you",
              "Your progress changes what comes next — faster when you’re ready, slower when you need it.",
            ],
          ].map(([number, title, body]) => (
            <article
              key={number}
              className="rounded-3xl border border-gray-200 p-7"
            >
              <span className="text-sm font-bold text-[#6957ff]">
                {number}
              </span>
              <h3 className="mt-12 text-xl font-semibold">{title}</h3>
              <p className="mt-3 leading-7 text-gray-500">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-4 mb-6 rounded-[2rem] bg-[#101828] px-6 py-20 text-center text-white sm:px-10">
        <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Start with curiosity.
          <br />
          End with capability.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-gray-300">
          No generic courses. No guessing what to learn next. Just a path that
          moves with you.
        </p>
        <button
          onClick={() => setOnboarding(true)}
          className="mt-8 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-[#101828] hover:bg-gray-100"
        >
          Build my learning path →
        </button>
      </section>
    </main>
  );
}

function Step({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-[.15em] text-[#6957ff]">
        Let’s personalize this
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-500">
        {subtitle}
      </p>
      <div className="mt-10">{children}</div>
    </div>
  );
}

function Option({
  selected,
  onClick,
  title,
  sub,
  compact = false,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  sub: string;
  compact?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-5 text-left transition ${
        selected
          ? "border-[#6957ff] bg-[#f5f3ff] ring-2 ring-[#6957ff]/10"
          : "border-gray-200 bg-white hover:border-gray-300"
      } ${compact ? "text-center" : ""}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold">{title}</span>
        <span
          className={`h-4 w-4 rounded-full border-2 ${
            selected
              ? "border-[#6957ff] bg-[#6957ff]"
              : "border-gray-300"
          }`}
        />
      </div>
      {sub && <p className="mt-1 text-sm text-gray-500">{sub}</p>}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-gray-100 py-3 last:border-0 sm:grid-cols-[130px_1fr]">
      <span className="text-sm font-semibold text-gray-400">{label}</span>
      <span className="text-sm leading-6 text-gray-700">{value}</span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f7f7fb] p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}
