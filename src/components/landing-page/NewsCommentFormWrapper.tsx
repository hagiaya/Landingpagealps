'use client';

import { useRouter } from 'next/navigation';
import NewsCommentForm from '@/components/landing-page/NewsCommentForm';

interface NewsCommentFormWrapperProps {
  newsId: string;
}

export default function NewsCommentFormWrapper({ newsId }: NewsCommentFormWrapperProps) {
  const router = useRouter();

  const handleCommentAdded = () => {
    // Refresh the page to show the new comment
    router.refresh(); // This refreshes the server component
  };

  return <NewsCommentForm newsId={newsId} onCommentAdded={handleCommentAdded} />;
}