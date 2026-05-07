import Link from "next/link";
import { signOut } from "@/auth";
import { Card } from "@/app/components/ui";
import { LogoSvg } from "@/app/components/icons";

export const metadata = { title: "Admin — roohaha.com" };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", background: "#111825" }}>
      <nav style={{ borderBottom: "1px solid #243048" }}>
        <div
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 36px",
          }}
        >
          <Link href="/" aria-label="roohaha home">
            <LogoSvg />
          </Link>
          <span
            style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: 12,
              color: "#5a7088",
              letterSpacing: "0.05em",
            }}
          >
            admin
          </span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/signin" });
            }}
          >
            <button
              type="submit"
              style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 11,
                color: "#7a90a8",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              sign out
            </button>
          </form>
        </div>
      </nav>
      <div style={{ maxWidth: 920, margin: "40px auto", padding: "0 16px" }}>
        <Card>{children}</Card>
      </div>
    </div>
  );
}
