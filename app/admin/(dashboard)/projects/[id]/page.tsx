import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { projects as projectsTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { AdminProjectEditor } from "@/components/admin-project-editor"

export const metadata = {
  title: "Edit Project | DrillThru Admin",
  description: "Edit a showcase project",
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const projectId = parseInt(id)
  if (isNaN(projectId)) notFound()

  const project = await db.select().from(projectsTable).where(eq(projectsTable.id, projectId)).then((r) => r[0])
  if (!project) notFound()

  return <AdminProjectEditor project={project} />
}
