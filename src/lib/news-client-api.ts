// Client-side API service for news-related operations
export const newsClientAPI = {
  // Add a comment to a news article
  addComment: async (newsId: string, name: string, email: string | null, content: string) => {
    const response = await fetch('/api/news-comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newsId,
        name,
        email,
        content,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add comment');
    }

    const data = await response.json();
    return data.comment;
  },
};