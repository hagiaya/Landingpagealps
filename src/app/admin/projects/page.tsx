import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Edit, Save, Trash2, X } from "lucide-react";
import { adminLandingPageServer } from "@/lib/landing-page-db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminAuthWrapper from "@/components/admin/AdminAuthWrapper";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminTable from "@/components/admin/AdminTable";
import ProjectProgressFeature from "@/components/admin/ProjectProgressFeature";

export default async function ProjectsPage() {
  // Use the new function that gets projects with milestones
  const { projects, milestones: milestonesByProject } = await adminLandingPageServer.getAllProjectsAndMilestones();
  
  // Flatten the milestones object into a single array
  const allMilestones = Object.values(milestonesByProject).flat();

  // Pre-format estimated_completion dates for projects
  const projectsWithFormattedDates = projects.map(project => ({
    ...project,
    estimatedCompletionFormatted: project.estimated_completion 
      ? new Date(project.estimated_completion).toLocaleDateString('id-ID') 
      : null,
  }));

  return (
    <AdminAuthWrapper>
      <AdminLayout initialPage="/admin/projects">
        <ProjectProgressFeature 
          projects={projectsWithFormattedDates}
          milestones={allMilestones}
          onUpdateProject={async (project: any) => {
            'use server';
            await adminLandingPageServer.updateProject(project.id, {
              client_name: project.client_name,
              project_name: project.project_name,
              description: project.description,
              status: project.status,
              estimated_completion: project.estimated_completion,
            });
            revalidatePath('/admin/projects');
          }}
          onDeleteProject={async (id: string) => {
            'use server';
            await adminLandingPageServer.deleteProject(id);
            revalidatePath('/admin/projects');
          }}
          onCreateProject={async (project: any) => {
            'use server';
            await adminLandingPageServer.createProject({
              client_name: project.client_name,
              project_name: project.project_name,
              description: project.description,
              status: project.status,
              estimated_completion: project.estimated_completion,
            });
            revalidatePath('/admin/projects');
          }}
        />
      </AdminLayout>
    </AdminAuthWrapper>
  );
}