import { notFound } from 'next/navigation';
import { landingPageServer } from '@/lib/landing-page-db';
import { Calendar, MessageCircle, Share2, Eye, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import NewsActions from '@/components/landing-page/NewsActions';

interface NewsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const resolvedParams = await params;
  const news = await landingPageServer.getNewsById(resolvedParams.id).catch(() => null);

  if (!news || !news.is_published) {
    notFound();
  }

  // Increment view count
  await landingPageServer.incrementNewsView(resolvedParams.id);

  // Get real data for interactions
  const viewCount = await landingPageServer.getNewsViews(resolvedParams.id);
  const commentCount = await landingPageServer.getNewsCommentCount(resolvedParams.id);
  const shareCount = await landingPageServer.getNewsShareCount(resolvedParams.id);
  const comments = await landingPageServer.getNewsComments(resolvedParams.id);

  // Get related news (same category, excluding current news)
  const filteredRelatedNews = await landingPageServer.getRelatedNews(resolvedParams.id, news.category, 4).catch(() => []);
  
  // Get other news (different from current and related)
  const allNews = await landingPageServer.getNews(10).catch(() => []);
  const otherNews = allNews.filter(article => 
    article.id !== news.id && 
    !filteredRelatedNews.some(related => related.id === article.id)
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main News Content */}
          <div className="lg:col-span-3">
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
              {news.featured_image && (
                <div className="h-80 overflow-hidden">
                  <img 
                    src={news.featured_image} 
                    alt={news.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-8">
                {news.category && (
                  <span className="inline-block px-3 py-1 text-sm font-semibold text-primary bg-primary/10 rounded-full mb-4">
                    {news.category}
                  </span>
                )}
                
                <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
                
                <div className="flex items-center text-sm text-muted-foreground mb-6">
                  <User className="h-4 w-4 mr-2" />
                  <span className="mr-4">{news.author}</span>
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(news.published_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</span>
                </div>
                
                <div className="flex items-center mb-6 text-sm text-muted-foreground">
                  <div className="flex items-center mr-4">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{viewCount} views</span>
                  </div>
                  <div className="flex items-center mr-4">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span>{commentCount} comments</span>
                  </div>
                  <div className="flex items-center">
                    <Share2 className="h-4 w-4 mr-1" />
                    <span>{shareCount} shares</span>
                  </div>
                </div>
                
                <div className="prose dark:prose-invert max-w-none mt-6">
                  <p className="text-lg text-muted-foreground mb-6">{news.excerpt}</p>
                  <div className="space-y-4">
                    {news.content
                      .split('\n')
                      .filter(paragraph => paragraph.trim() !== '')
                      .map((paragraph, index) => (
                        <p key={index} className="mb-4">{paragraph.trim()}</p>
                      ))
                    }
                  </div>
                </div>
              </div>
            </article>

            {/* Back and Share Actions */}
            <NewsActions newsId={resolvedParams.id} newsTitle={news.title} />
            

            {/* Related News */}
            {filteredRelatedNews && filteredRelatedNews.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Berita Terkait</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRelatedNews.map((article) => (
                    <a key={article.id} href={`/news/${article.id}`} className="block">
                      <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                        {article.featured_image && (
                          <div className="h-40 overflow-hidden">
                            <img
                              src={article.featured_image}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          {article.category && (
                            <span className="inline-block px-2 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full mb-2">
                              {article.category}
                            </span>
                          )}
                          <h3 className="font-bold mb-2 line-clamp-2">{article.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {article.excerpt || article.content.substring(0, 100)}...
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(article.published_at).toLocaleDateString('id-ID')}
                          </p>
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - Other News */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-2xl font-bold mb-6">Berita Lainnya</h2>
              <div className="space-y-6">
                {otherNews && otherNews.length > 0 ? (
                  otherNews.map((article) => (
                    <a 
                      key={article.id} 
                      href={`/news/${article.id}`}
                      className="block flex items-start space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      {article.featured_image && (
                        <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded">
                          <img
                            src={article.featured_image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm line-clamp-2 mb-1">{article.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(article.published_at).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </a>
                  ))
                ) : (
                  <p className="text-muted-foreground">Tidak ada berita lainnya saat ini.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}