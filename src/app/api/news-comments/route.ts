import { NextRequest } from 'next/server';
import { landingPageServer } from '@/lib/landing-page-db';

export async function POST(request: NextRequest) {
  try {
    const { newsId, name, email, content } = await request.json();

    // Validate required fields
    if (!newsId || !name || !content) {
      return Response.json({ 
        message: 'Missing required fields: newsId, name, or content' 
      }, { status: 400 });
    }

    // Add the comment using server function
    const comment = await landingPageServer.addNewsComment(newsId, name, email, content);

    return Response.json({ success: true, comment });
  } catch (error: any) {
    console.error('Error adding news comment:', error);
    return Response.json({ 
      message: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}