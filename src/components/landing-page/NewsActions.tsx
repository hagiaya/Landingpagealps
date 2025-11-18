'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { News } from '@/lib/types';

interface NewsActionsProps {
  newsId: string;
  newsTitle: string;
}

export default function NewsActions({ newsId, newsTitle }: NewsActionsProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: newsTitle,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link disalin ke clipboard!');
      });
    }
  };

  const handleShareWhatsApp = () => {
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(newsTitle + ' - ' + window.location.href)}`;
    window.open(shareUrl, '_blank');
  };

  const handleShareFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(shareUrl, '_blank');
  };

  const handleShareTwitter = () => {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(newsTitle)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(shareUrl, '_blank');
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <Button variant="outline" onClick={handleBack} className="flex items-center">
        ← Kembali
      </Button>
      <div className="flex space-x-2">
        <Button variant="outline" className="flex items-center" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button variant="outline" className="flex items-center" onClick={handleShareWhatsApp}>
          <span className="mr-2">💬</span>
          WhatsApp
        </Button>
        <Button variant="outline" className="flex items-center" onClick={handleShareFacebook}>
          <span className="mr-2">f</span>
          Facebook
        </Button>
        <Button variant="outline" className="flex items-center" onClick={handleShareTwitter}>
          <span className="mr-2">X</span>
          Twitter
        </Button>
      </div>
    </div>
  );
}