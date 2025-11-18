import { NextRequest } from 'next/server';
import { adminLandingPageServer } from '@/lib/landing-page-db';
import { revalidatePath } from 'next/cache';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'Partner ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delete the partner
    await adminLandingPageServer.deletePartner(id);
    
    // Revalidate the partners page to reflect changes
    revalidatePath('/admin/partners');
    
    return new Response(JSON.stringify({ message: 'Partner deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting partner:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete partner' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}