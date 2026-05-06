import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { readReading, readPlaying } from "@/app/lib/content";
import { readFeatureGates } from "@/app/lib/feature-gates";
import AdminForm from "./AdminForm";
import FeatureGatesForm from "./FeatureGatesForm";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/signin");

  const [books, games, gates] = await Promise.all([
    readReading(),
    readPlaying(),
    readFeatureGates(),
  ]);

  return (
    <>
      <AdminForm
        initialReading={JSON.stringify(books, null, 2)}
        initialPlaying={JSON.stringify(games, null, 2)}
      />
      <div style={{ marginTop: 40, borderTop: "1px solid #dde2ea", paddingTop: 32 }}>
        <FeatureGatesForm initialGates={gates} />
      </div>
    </>
  );
}
