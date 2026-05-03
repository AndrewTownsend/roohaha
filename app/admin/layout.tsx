import Link from "next/link";
import { signOut } from "@/auth";
import { Card } from "@/app/components/ui";

export const metadata = { title: "Admin — roohaha.com" };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111825",
        padding: "40px 16px",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: 13,
              color: "#7a90a8",
              letterSpacing: "0.05em",
            }}
          >
            <Link href="/" style={{ color: "#7a90a8", textDecoration: "none" }}>
              roohaha
            </Link>
            {" / admin"}
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
        <Card>{children}</Card>
      </div>
    </div>
  );
}
