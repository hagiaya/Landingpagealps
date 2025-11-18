import { NextRequest } from 'next/server';
import { adminLandingPageServer } from '@/lib/landing-page-db';
import { revalidatePath } from 'next/cache';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'News ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delete the news
    await adminLandingPageServer.deleteNews(id);
    
    // Revalidate the news page to reflect changes
    revalidatePath('/admin/news');
    
    return new Response(JSON.stringify({ message: 'News deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting news:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete news' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}