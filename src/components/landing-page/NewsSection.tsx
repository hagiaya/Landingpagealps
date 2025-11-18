'use client';

import { useState } from 'react';
import { News } from '@/lib/landing-page-db';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';
import Link from 'next/link';

interface NewsSectionProps {
  news: News[];
}

export default function NewsSection({ news }: NewsSectionProps) {
  const [visibleCount, setVisibleCount] = useState(3);

  
  const loadMore = () => {
    setVisibleCount(prev => prev + 3);
  };



  const displayedNews = news.slice(0, visibleCount);

  if (!news || news.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Berita Terbaru</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Informasi dan berita terbaru dari perusahaan kami
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {displayedNews.map((article) => (
            <Card 
              key={article.id} 
              className="overflow-hidden h-full flex flex-col border rounded-lg cursor-pointer hover:shadow-lg transition-shadow" 
              style={{ height: '500px' }}
            >
            <Link href={`/news/${article.id}`}>
              {article.featured_image && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.featured_image} 
                    alt={article.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-6 flex flex-col flex-grow overflow-y-auto" style={{ maxHeight: 'calc(500px - 12rem)' }}>
                {article.category && (
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full mb-3">
                    {article.category}
                  </span>
                )}
                <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                <p className="text-muted-foreground mb-4 flex-grow">
                  {article.excerpt || article.content}
                </p>
                <div className="flex items-center text-sm text-muted-foreground pt-4">
                  <User className="h-4 w-4 mr-2" />
                  <span className="mr-4">{article.author}</span>
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(article.published_at).toLocaleDateString('id-ID')}</span>
                </div>
              </CardContent>
            </Link>
            </Card>
          ))}
        </div>
        
        {visibleCount < news.length && (
          <div className="text-center mt-12">
            <button 
              onClick={loadMore}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </div>
    </section>
  );
}