import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { readReading, readPlaying } from "@/app/lib/content";
import { readFeatureGates } from "@/app/lib/feature-gates";
import { readProjectsForAdmin } from "@/app/lib/projects-admin";
import AdminTabs from "./AdminTabs";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/signin");

  const [books, games, projects, gates] = await Promise.all([
    readReading(),
    readPlaying(),
    readProjectsForAdmin(),
    readFeatureGates(),
  ]);

  return (
    <AdminTabs
      initialReading={books}
      initialPlaying={games}
      initialProjects={projects}
      initialGates={gates}
    />
  );
}
