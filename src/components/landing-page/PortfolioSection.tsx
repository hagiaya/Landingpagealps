'use client';

import { PortfolioItem } from '@/lib/landing-page-db';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface PortfolioSectionProps {
  items: PortfolioItem[];
}

export default function PortfolioSection({ items }: PortfolioSectionProps) {
  if (items.length === 0) return null;

  return (
    <section id="portfolio" className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Portofolio Kami</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Beberapa proyek yang telah kami kerjakan untuk klien kami
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden flex flex-col h-full border rounded-lg">
              <div className="relative h-48 overflow-hidden">
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed w-full h-full flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              <CardContent className="p-6 flex-grow">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  {item.category && (
                    <Badge variant="secondary">{item.category}</Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">{item.description}</p>
                {item.project_url && (
                  <div className="mt-auto">
                    <Button asChild variant="outline" size="sm">
                      <Link href={item.project_url} target="_blank">
                        Lihat Proyek
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}