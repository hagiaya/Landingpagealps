import { adminLandingPageServer } from "@/lib/landing-page-db";
import PortfolioClient from "./PortfolioClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function PortfolioPage() {
  const portfolioItems = await adminLandingPageServer.getAllPortfolioItems();

  async function createPortfolioItemAction(formData: FormData) {
    'use server';
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const projectUrl = formData.get('projectUrl') as string;
    const category = formData.get('category') as string;
    const orderIndex = parseInt(formData.get('orderIndex') as string || '0');

    await adminLandingPageServer.createPortfolioItem({
      title,
      description: description || null,
      image_url: imageUrl,
      project_url: projectUrl || null,
      category: category || null,
      order_index: orderIndex
    });

    revalidatePath('/admin/portfolio');
    redirect('/admin/portfolio');
  }

  async function deletePortfolioItemAction(id: string) {
    'use server';
    await adminLandingPageServer.deletePortfolioItem(id);
    revalidatePath('/admin/portfolio');
  }

  async function editPortfolioItemAction(item: any) {
    'use server';
    console.log('Editing portfolio item:', item);
    // Example: await adminLandingPageServer.updatePortfolioItem(item.id, { ... });
    // revalidatePath('/admin/portfolio');
  }

  return (
    <PortfolioClient
      portfolioItems={portfolioItems}
      createPortfolioItemAction={createPortfolioItemAction}
      deletePortfolioItemAction={deletePortfolioItemAction}
      editPortfolioItemAction={editPortfolioItemAction}
    />
  );
}