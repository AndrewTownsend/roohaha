import { signIn } from "@/auth";
import { Card } from "@/app/components/ui";

export default function SignInPage() {
  return (
    <div style={{ background: "#111825", padding: "60px 16px" }}>
      <div style={{ width: "100%", maxWidth: 360, margin: "0 auto" }}>
        <Card>
          <p
            style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: 13,
              color: "#7a90a8",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            roohaha / admin
          </p>
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/admin" });
            }}
          >
            <button
              type="submit"
              style={{
                width: "100%",
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 13,
                background: "#1a2235",
                color: "#ffffff",
                border: "none",
                borderRadius: 6,
                padding: "10px 20px",
                cursor: "pointer",
              }}
            >
              Sign in with GitHub
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
