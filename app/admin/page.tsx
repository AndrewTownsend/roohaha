import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { readReading, readPlaying } from "@/app/lib/content";
import AdminForm from "./AdminForm";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/signin");

  const [books, games] = await Promise.all([readReading(), readPlaying()]);

  return (
    <AdminForm
      initialReading={JSON.stringify(books, null, 2)}
      initialPlaying={JSON.stringify(games, null, 2)}
    />
  );
}
