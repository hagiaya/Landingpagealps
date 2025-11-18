import { NextRequest } from 'next/server';
import { adminLandingPageServer } from '@/lib/landing-page-db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const body = await req.json();
    const { id } = resolvedParams;

    const { client_name, project_name, description, status, estimated_completion } = body;

    // Update project using the admin server function
    const updatedProject = await adminLandingPageServer.updateProject(id, {
      client_name,
      project_name,
      description: description || null,
      status: status as 'Diskusi' | 'Desain' | 'Development' | 'Test' | 'Selesai',
      estimated_completion: estimated_completion || null,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        project: updatedProject,
        message: 'Project updated successfully'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating project:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update project', details: (error as Error).message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Delete project using the admin server function
    await adminLandingPageServer.deleteProject(id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Project deleted successfully'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting project:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete project', details: (error as Error).message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}