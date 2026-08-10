import type { Metadata } from "next";
import Link from "next/link";
import DocShell, { DocHeading, DocText } from "../../_components/DocShell";

export const metadata: Metadata = {
  title: "Reticle Privacy Policy — roohaha.com",
  description:
    "Reticle collects no data. It has no network access, and screenshots never leave your Mac.",
};

// The short version, pulled out so it reads first and stands alone. Everything
// below it is the same statement in the detail a privacy policy is expected to
// carry.
function Summary() {
  return (
    <div
      style={{
        background: "#e6ebf2",
        border: "1px solid #dde2ea",
        borderRadius: 8,
        padding: "20px 24px",
        marginBottom: 40,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: "1rem",
          lineHeight: 1.65,
          color: "#1a2235",
          margin: 0,
          fontWeight: 500,
        }}
      >
        Reticle collects nothing. It has no network access of any kind, so your
        screenshots and everything in them stay on your Mac. There is no account,
        no analytics, no crash reporting, and no third-party code that could send
        anything anywhere.
      </p>
    </div>
  );
}

export default function ReticlePrivacyPage() {
  return (
    <DocShell
      title="Privacy Policy"
      subtitle="Reticle for macOS"
      updated="10 August 2026"
      backHref="/projects/reticle"
      backLabel="Reticle"
    >
      <Summary />

      <section style={{ marginBottom: 36 }}>
        <DocHeading>What Reticle collects</DocHeading>
        <DocText>
          Nothing. Reticle does not collect, store, transmit, sell, or share any
          personal information or usage data. There is no analytics or telemetry
          of any kind, and no crash reporting.
        </DocText>
      </section>

      <section style={{ marginBottom: 36 }}>
        <DocHeading>Your screenshots</DocHeading>
        <DocText>
          A capture exists in memory while you are working on it. When you press
          Copy it goes to your Mac&apos;s clipboard; when you press Save it is
          written as a PNG to the location you pick in the save dialog. If you
          cancel, it is discarded. Reticle keeps no history, no library, and no
          copy of anything you have captured.
        </DocText>
      </section>

      <section style={{ marginBottom: 36 }}>
        <DocHeading>No network access</DocHeading>
        <DocText>
          Reticle runs in Apple&apos;s App Sandbox without the network client
          entitlement. That is a stronger statement than a promise not to send
          data: macOS does not permit the app to make outbound network
          connections at all. Nothing it captures can leave your machine, because
          it has no means of sending it.
        </DocText>
      </section>

      <section style={{ marginBottom: 36 }}>
        <DocHeading>Screen Recording permission</DocHeading>
        <DocText>
          macOS requires Screen Recording permission before any app can capture
          the screen, and Reticle asks for it the first time you take a capture.
          It uses that permission only at the moment you start a capture, either
          by pressing the shortcut or choosing Capture Area from the menu bar.
          Reticle never captures in the background and never records video. You
          can revoke the permission at any time in System Settings under Privacy
          &amp; Security.
        </DocText>
      </section>

      <section style={{ marginBottom: 36 }}>
        <DocHeading>Settings stored on your Mac</DocHeading>
        <DocText>
          Reticle saves two things locally, in your Mac&apos;s standard
          preferences store: the keyboard shortcut you have chosen, and a single
          true/false flag recording whether you have ever left a tip, which is
          used only to soften the wording of the tip section. Neither leaves your
          device. Deleting the app removes them.
        </DocText>
      </section>

      <section style={{ marginBottom: 36 }}>
        <DocHeading>Tips and in-app purchases</DocHeading>
        <DocText>
          Reticle offers optional tips through Apple&apos;s In-App Purchase
          system. Apple handles the entire transaction — Reticle never sees your
          payment details, and no personal information about you is passed to the
          developer. Apple provides only aggregate sales reporting. Tips unlock
          nothing; the app is fully functional without them. Apple&apos;s handling
          of purchase data is covered by Apple&apos;s own privacy policy.
        </DocText>
      </section>

      <section style={{ marginBottom: 36 }}>
        <DocHeading>Children</DocHeading>
        <DocText>
          Reticle is suitable for all ages and collects no data from anyone,
          including children under 13.
        </DocText>
      </section>

      <section style={{ marginBottom: 36 }}>
        <DocHeading>Changes to this policy</DocHeading>
        <DocText>
          If this policy changes, the updated version will be posted on this page
          with a new date at the top. Reticle&apos;s data practices would have to
          change substantially for that to happen, and any such change would
          arrive as part of an app update you choose to install.
        </DocText>
      </section>

      <section>
        <DocHeading>Contact</DocHeading>
        <DocText>
          Questions about this policy are welcome through the{" "}
          <Link href="/projects/reticle/support" style={{ color: "#4a7fa5" }}>
            Reticle support page
          </Link>
          .
        </DocText>
      </section>
    </DocShell>
  );
}
