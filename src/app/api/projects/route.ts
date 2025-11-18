import { NextRequest } from 'next/server';
import { adminLandingPageServer } from '@/lib/landing-page-db';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { client_name, project_name, description, status, estimated_completion, short_id } = body;

    // Create project using the admin server function
    const newProject = await adminLandingPageServer.createProject({
      client_name,
      project_name,
      description: description || null,
      status: status as 'Diskusi' | 'Desain' | 'Development' | 'Test' | 'Selesai',
      estimated_completion: estimated_completion || null,
      short_id: short_id || null,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        project: newProject,
        message: 'Project created successfully'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating project:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create project', details: (error as Error).message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}