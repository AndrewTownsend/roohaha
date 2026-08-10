import type { Metadata } from "next";
import Link from "next/link";
import DocShell, { DocHeading } from "../../_components/DocShell";
import ContactForm from "@/app/components/ContactForm";

export const metadata: Metadata = {
  title: "Reticle Support — roohaha.com",
  description:
    "Help with Reticle for macOS: Screen Recording permission, the capture shortcut, saving files, and how to get in touch.",
};

// Ordered by how often each one is likely to be the reason someone arrived
// here. Screen Recording is first because it is the only step that can leave
// the app looking broken on a clean install.
const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Reticle says it needs Screen Recording permission",
    a: (
      <>
        macOS requires this before any app can capture the screen. Reticle&apos;s
        alert has a button that opens the right settings pane directly, or you
        can go to System Settings &rsaquo; Privacy &amp; Security &rsaquo; Screen
        Recording and switch Reticle on. <strong>You then need to quit and
        reopen Reticle</strong> — macOS does not apply a new Screen Recording
        grant to an app that is already running, so this step is easy to miss.
      </>
    ),
  },
  {
    q: "I installed it and nothing happened",
    a: (
      <>
        Reticle has no Dock icon and no window — it lives in the menu bar. Look
        for the viewfinder icon at the top-right of your screen. Clicking it
        gives you Capture Area, Preferences, and Quit.
      </>
    ),
  },
  {
    q: "The keyboard shortcut doesn't do anything",
    a: (
      <>
        Another app has probably claimed the same combination; macOS gives it to
        whichever app registered first, silently. Open Preferences from the menu
        bar icon and record a different shortcut. If capture works from the menu
        but not the keyboard, this is almost always the cause.
      </>
    ),
  },
  {
    q: "Can I change the capture shortcut?",
    a: (
      <>
        Yes. Menu bar icon &rsaquo; Preferences, then click the shortcut field
        and press the combination you want. The default is Command-Shift-9.
      </>
    ),
  },
  {
    q: "Where do my screenshots go?",
    a: (
      <>
        Wherever you tell them to. Save opens a standard macOS save dialog with a
        suggested name you can change, and you can put the file in any folder —
        including a new one you create from the dialog. Copy puts the image
        straight on the clipboard instead, ready to paste.
      </>
    ),
  },
  {
    q: "I drew something wrong",
    a: (
      <>
        Command-Z removes the last thing you drew, and you can press it
        repeatedly to walk back through your annotations. Esc discards the whole
        capture and starts over.
      </>
    ),
  },
  {
    q: "Does Reticle work on an Intel Mac?",
    a: (
      <>
        No. Reticle is built for Apple silicon and requires macOS 14 Sonoma or
        later. The Mac App Store will not offer it to Intel Macs.
      </>
    ),
  },
  {
    q: "What does tipping unlock?",
    a: (
      <>
        Nothing at all. Reticle is free and complete, and the tip jar in
        Preferences is purely a way to say thanks if you find yourself using it a
        lot. No feature is held back behind it.
      </>
    ),
  },
];

export default function ReticleSupportPage() {
  return (
    <DocShell
      title="Reticle Support"
      subtitle="Common questions, and a way to reach me directly."
      backHref="/projects/reticle"
      backLabel="Reticle"
    >
      <section style={{ marginBottom: 48 }}>
        <DocHeading>Common questions</DocHeading>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 20 }}>
          {FAQS.map(({ q, a }) => (
            <div key={q}>
              <h3
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: "#1a2235",
                  margin: "0 0 6px",
                }}
              >
                {q}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "0.92rem",
                  lineHeight: 1.65,
                  color: "#3d5068",
                  margin: 0,
                }}
              >
                {a}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          borderTop: "1px solid #dde2ea",
          paddingTop: 36,
          marginBottom: 40,
        }}
      >
        <DocHeading>Still stuck?</DocHeading>
        <p
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: "0.95rem",
            lineHeight: 1.7,
            color: "#3d5068",
            margin: "0 0 24px",
          }}
        >
          Send a message and I&apos;ll get back to you. If you&apos;re reporting
          something going wrong, it helps to know your macOS version and what you
          were doing when it happened — a screenshot is welcome too, though
          you&apos;ll need a different tool for that one.
        </p>
        <ContactForm />
      </section>

      <section>
        <p
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: "0.9rem",
            lineHeight: 1.65,
            color: "#5a7088",
            margin: 0,
          }}
        >
          Reticle collects no data and has no network access. See the{" "}
          <Link href="/projects/reticle/privacy" style={{ color: "#4a7fa5" }}>
            privacy policy
          </Link>
          .
        </p>
      </section>
    </DocShell>
  );
}
