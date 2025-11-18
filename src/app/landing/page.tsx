import { landingPageServer, adminLandingPageServer } from '@/lib/landing-page-db';
import HeroSection from '@/components/landing-page/HeroSection';
import PartnersSection from '@/components/landing-page/PartnersSection';
import ServicesSection from '@/components/landing-page/ServicesSection';
import ProjectProgressSection from '@/components/landing-page/ProjectProgressSection';
import NewsSection from '@/components/landing-page/NewsSection';
import ClientThemeToggle from '@/components/ClientThemeToggle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger 
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const ClientLocationsSection = dynamic(() => import('@/components/landing-page/ClientLocationsSection'), { 
  ssr: false,
  loading: () => <div className="min-h-[400px] flex items-center justify-center"><p>Loading map...</p></div>
});

export default async function LandingPage() {
  // Fetch all data needed for the landing page in parallel
  // Use special function for hero section to bypass RLS since it's public content
  const [
    hero,
    partners,
    services,
    portfolio,
    testimonials,
    clientLocations,
    newsData,
    projectsAndMilestones
  ] = await Promise.all([
    landingPageServer.getPublicHeroSection().catch(() => null),
    landingPageServer.getPartners().catch(() => []),
    landingPageServer.getServices().catch(() => []),
    landingPageServer.getPortfolioItems().catch(() => []),
    landingPageServer.getTestimonials().catch(() => []),
    landingPageServer.getClientLocations().catch(() => []),
    landingPageServer.getNews().catch(() => []),
    adminLandingPageServer.getAllProjectsAndMilestones().catch(() => ({ projects: [], milestones: {} }))
  ]);

  const projects = projectsAndMilestones.projects.map(project => ({
    ...project,
    estimatedCompletionFormatted: project.estimated_completion 
      ? new Date(project.estimated_completion).toLocaleDateString('id-ID') 
      : null,
  }));

  console.log("Projects loaded for landing page:", projects.map(p => ({ id: p.id, short_id: p.short_id, name: p.project_name })));

  const milestones = Object.values(projectsAndMilestones.milestones).flat().map(milestone => ({
    ...milestone,
    dueDateFormatted: milestone.due_date
      ? new Date(milestone.due_date).toLocaleDateString('id-ID')
      : null,
  }));

  // If no data is loaded, show a loading state
  if (!hero && partners.length === 0 && services.length === 0 && portfolio.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Memuat konten...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="font-bold text-lg flex items-center">
              <img src="/codeguide-logo.png" alt="Techagi Logo" width={120} height={32} className="h-8 w-auto" />
            </div>
            
            {/* Desktop Navigation - Centered */}
            <NavigationMenu className="hidden md:flex mx-auto">
              <NavigationMenuList className="flex items-center gap-2">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="#hero" className="block select-none space-y-1 px-3 py-2 text-sm font-medium leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground rounded-md">
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="#services" className="block select-none space-y-1 px-3 py-2 text-sm font-medium leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground rounded-md">
                      Services
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="#portfolio" className="block select-none space-y-1 px-3 py-2 text-sm font-medium leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground rounded-md">
                      Portfolio
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="#testimonials" className="block select-none space-y-1 px-3 py-2 text-sm font-medium leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground rounded-md">
                      Testimonials
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="#hero" className="block select-none space-y-1 px-3 py-2 text-sm font-medium leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground rounded-md">
                      Contact
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            {/* Mobile Navigation */}
            <div className="flex items-center gap-2">
              <ClientThemeToggle />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <nav className="flex flex-col space-y-4">
                    <Link 
                      href="#hero" 
                      className="text-lg font-medium hover:underline py-2"
                    >
                      Home
                    </Link>
                    <Link 
                      href="#services" 
                      className="text-lg font-medium hover:underline py-2"
                    >
                      Services
                    </Link>
                    <Link 
                      href="#portfolio" 
                      className="text-lg font-medium hover:underline py-2"
                    >
                      Portfolio
                    </Link>
                    <Link 
                      href="#testimonials" 
                      className="text-lg font-medium hover:underline py-2"
                    >
                      Testimonials
                    </Link>
                    <Link 
                      href="#hero" 
                      className="text-lg font-medium hover:underline py-2"
                    >
                      Contact
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>

            </div>
          </div>
        </div>
      </header>

      {/* Main Content Wrapper - Centered Content */}
      <main className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <HeroSection data={hero || {
          id: 'default-hero',
          title: 'Welcome to Our Digital Agency',
          subtitle: 'We provide top-quality web development, app creation, and UI/UX design services for your business.',
          button_text: 'Get Started',
          image_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }} />

        {/* Partners Section */}
        <PartnersSection partners={partners} />
        
        {/* Services Section */}
        <ServicesSection services={services} />
        
        {/* Portfolio Section */}
        <PortfolioSection items={portfolio} />
        
        {/* Testimonials Section */}
        <TestimonialsSection testimonials={testimonials} />
        
        {/* Client Locations Section */}
        <ClientLocationsSection locations={clientLocations} />
        
        {/* News Section - Handle potential error by checking if news exists and is an array */}
        {Array.isArray(newsData) && newsData.length > 0 && (
          <NewsSection news={newsData} />
        )}
        
        {/* Project Progress Section */}
        <ProjectProgressSection projects={projects} milestones={milestones} />

        {/* Contact Section - Replaced with the form in Hero section */}
      </main>
      
      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">Techagi</h3>
              <p className="text-gray-400 mb-4">
                Kami menyediakan solusi digital terbaik untuk bisnis Anda, termasuk pembuatan website, aplikasi, dan desain UI/UX profesional.
              </p>
              <div className="flex space-x-4">
                {/* Social media icons would go here */}
              </div>
            </div>

            {/* Services Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                {services.slice(0, 5).map((service) => (
                  <li key={service.id}>
                    <a href="#services" className="text-gray-400 hover:text-white transition-colors">
                      {service.title}
                    </a>
                  </li>
                ))}
                {services.length === 0 && (
                  <li className="text-gray-400">No services available</li>
                )}
              </ul>
            </div>

            {/* Projects Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Projects</h3>
              <ul className="space-y-2">
                {portfolio.slice(0, 5).map((item) => (
                  <li key={item.id}>
                    <a href="#portfolio" className="text-gray-400 hover:text-white transition-colors">
                      {item.title}
                    </a>
                  </li>
                ))}
                {portfolio.length === 0 && (
                  <li className="text-gray-400">No projects available</li>
                )}
              </ul>
            </div>

            {/* News & Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
              <ul className="space-y-2 mb-4">
                <li>
                  <Link href="/#news" className="text-gray-400 hover:text-white transition-colors">
                    Latest News
                  </Link>
                </li>
                <li>
                  <Link href="/#hero" className="text-gray-400 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
              <div className="text-gray-400 text-sm">
                <p>Have a project in mind?</p>
                <Link href="/#hero" className="text-blue-400 hover:text-blue-300 mt-1 inline-block">
                  Get in touch →
                </Link>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 my-8"></div>

          {/* Copyright and Bottom Links */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Digital Agency. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}