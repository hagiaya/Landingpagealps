import { adminLandingPageServer } from "@/lib/landing-page-db";
import NewsClient from "./NewsClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function NewsPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined; } }) {
  const newsData = await adminLandingPageServer.getAllNews();
  const editId = searchParams?.editId as string;

  const news = newsData.map(n => ({
    ...n,
    publishedAtFormatted: new Date(n.published_at).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
  }));
  
  const newsToEdit = news.find(n => n.id === editId) || null;

  async function createNewsAction(formData: FormData) {
    'use server';
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const featuredImage = formData.get('featuredImage') as string;
    const author = formData.get('author') as string;
    const category = formData.get('category') as string;
    const isPublished = formData.get('isPublished') === 'on';

    await adminLandingPageServer.createNews({
      title,
      content,
      excerpt: excerpt || null,
      featured_image: featuredImage || null,
      author,
      category: category || null,
      is_published: isPublished
    });
    
    revalidatePath('/admin/news');
    redirect('/admin/news');
  }

  async function updateNewsAction(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const featuredImage = formData.get('featuredImage') as string;
    const author = formData.get('author') as string;
    const category = formData.get('category') as string;
    const isPublished = formData.get('isPublished') === 'on';

    await adminLandingPageServer.updateNews(id, {
      title,
      content,
      excerpt: excerpt || null,
      featured_image: featuredImage || null,
      author,
      category: category || null,
      is_published: isPublished
    });

    revalidatePath('/admin/news');
    redirect('/admin/news');
  }

  async function deleteNewsAction(id: string) {
    'use server';
    await adminLandingPageServer.deleteNews(id);
    revalidatePath('/admin/news');
  }

  async function cancelEditAction() {
    'use server';
    redirect('/admin/news');
  }

  return (
    <NewsClient
      news={news}
      newsToEdit={newsToEdit}
      createNewsAction={createNewsAction}
      updateNewsAction={updateNewsAction}
      deleteNewsAction={deleteNewsAction}
      cancelEditAction={cancelEditAction}
    />
  );
}