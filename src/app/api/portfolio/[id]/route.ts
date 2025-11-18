import { NextRequest } from 'next/server';
import { adminLandingPageServer } from '@/lib/landing-page-db';
import { revalidatePath } from 'next/cache';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'Portfolio item ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delete the portfolio item
    await adminLandingPageServer.deletePortfolioItem(id);
    
    // Revalidate the portfolio page to reflect changes
    revalidatePath('/admin/portfolio');
    
    return new Response(JSON.stringify({ message: 'Portfolio item deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete portfolio item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}