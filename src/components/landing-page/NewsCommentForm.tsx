'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { newsClientAPI } from '@/lib/news-client-api';

interface NewsCommentFormProps {
  newsId: string;
  onCommentAdded?: () => void; // Callback to refresh comments
}

export default function NewsCommentForm({ newsId, onCommentAdded }: NewsCommentFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!name.trim() || !content.trim()) {
      setError('Nama dan komentar wajib diisi.');
      setIsSubmitting(false);
      return;
    }

    try {
      await newsClientAPI.addComment(newsId, name, email || null, content);
      setName('');
      setEmail('');
      setContent('');
      // Refresh the page to show the new comment, with fallback to page reload if no callback provided
      if (onCommentAdded) {
        onCommentAdded();
      } else {
        window.location.reload();
      }
    } catch (err) {
      setError('Gagal mengirim komentar. Silakan coba lagi.');
      console.error('Error adding comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-destructive text-sm">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input 
            placeholder="Nama*" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Input 
            placeholder="Email (opsional)" 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <Textarea 
        placeholder="Tulis komentar Anda*" 
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Mengirim...' : 'Kirim Komentar'}
      </Button>
    </form>
  );
}