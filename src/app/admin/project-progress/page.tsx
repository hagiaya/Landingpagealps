import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { adminLandingPageServer } from "@/lib/landing-page-db";
import { notFound } from 'next/navigation';
import { Search, Calendar, BarChart3 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ProjectProgressPageProps {
  searchParams: Promise<{
    id?: string;
  }>;
}

export default async function ProjectProgressPage({ searchParams }: ProjectProgressPageProps) {
  const resolvedSearchParams = await searchParams;
  const projectId = resolvedSearchParams.id;
  
  let project = null;
  let allProjects = [];
  
  if (projectId) {
    // Get all projects and find the specific one
    allProjects = await adminLandingPageServer.getAllProjects();
    project = allProjects.find(p => p.id === projectId);
    
    if (!project) {
      notFound(); // Show 404 if project doesn't exist
    }
  } else {
    // If no specific project ID, just get all projects for the list
    allProjects = await adminLandingPageServer.getAllProjects();
  }

  // Handle form submission for searching
  async function searchProject(formData: FormData) {
    'use server';
    const searchId = formData.get('projectId') as string;
    
    // Redirect to the same page with the project ID as a query parameter
    // For now, we'll just continue without redirect since we're in a server component
    // In a real app, you'd use redirect(`/admin/project-progress?id=${searchId}`)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Project Progress</h1>
        <Button 
          variant="outline"
          asChild
        >
          <a href="/admin/projects">Manage Projects</a>
        </Button>
      </div>

      {/* Search Project Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Check Project Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={searchProject} className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="projectId">Project ID</Label>
              <Input 
                id="projectId" 
                name="projectId" 
                placeholder="Enter Project ID to check progress"
                required
                defaultValue={projectId || ''}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Check Progress
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Specific Project Detail (if ID provided) */}
      {project && (
        <div className="space-y-6 mb-8">
          <Card>
            <CardHeader className="bg-muted">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Project: {project.project_name}
                </CardTitle>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  project.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : project.status === 'in_progress' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-lg mb-3">Project Details</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Project ID:</span> {project.id}</p>
                    <p><span className="font-medium">Client:</span> {project.client_name}</p>
                    <p><span className="font-medium">Description:</span> {project.description}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-3">Timeline</h3>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span><span className="font-medium">Start:</span> {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Not set'}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span><span className="font-medium">Deadline:</span> {project.estimated_completion ? new Date(project.estimated_completion).toLocaleDateString() : 'Not set'}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Status</span>
                  <span className="capitalize">{project.status.replace('_', ' ')}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-600 h-4 rounded-full" 
                    style={{ width: `${project.status === 'completed' ? '100%' : project.status === 'in_progress' ? '50%' : '10%'}` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-3">Project Details</h3>
                <div className="space-y-3">
                  <p><span className="font-medium">Description:</span> {project.description || 'No description provided'}</p>
                  <p><span className="font-medium">Status:</span> <span className="capitalize">{project.status.replace('_', ' ')}</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* All Projects Table (if no specific project selected) */}
      {!project && (
        <Card>
          <CardHeader>
            <CardTitle>All Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project ID</TableHead>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allProjects.map((proj) => (
                    <TableRow key={proj.id}>
                      <TableCell className="font-medium">{proj.id}</TableCell>
                      <TableCell>{proj.project_name}</TableCell>
                      <TableCell>{proj.client_name}</TableCell>
                      <TableCell>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${proj.status === 'completed' ? '100%' : proj.status === 'in_progress' ? '50%' : '10%'}` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{proj.status === 'completed' ? '100%' : proj.status === 'in_progress' ? '50%' : '10%'}</span>
                      </TableCell>
                      <TableCell>{proj.created_at ? new Date(proj.created_at).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>{proj.estimated_completion ? new Date(proj.estimated_completion).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          proj.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : proj.status === 'in_progress' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {proj.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}