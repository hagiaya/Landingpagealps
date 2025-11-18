import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  Briefcase,
  Star,
  MapPin,
  MessageCircle,
  Newspaper,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { landingPageServer } from "@/lib/landing-page-db";
import { adminLandingPageServer } from "@/lib/landing-page-db";
import AdminAuthWrapper from "@/components/admin/AdminAuthWrapper";
import AdminLayout from "@/components/admin/AdminLayout";

export default async function AdminDashboard() {
  // Fetch counts for dashboard metrics
  const [partners, services, portfolio, testimonials, clientLocations, projects, leads, news] = await Promise.all([
    landingPageServer.getPartners(),
    landingPageServer.getServices(),
    landingPageServer.getPortfolioItems(),
    landingPageServer.getTestimonials(),
    landingPageServer.getClientLocations(),
    landingPageServer.getProjects(),
    adminLandingPageServer.getLeadSubmissions(), // Now using the proper function
    landingPageServer.getNews() // Fetch news count
  ]);

  return (
    <AdminAuthWrapper>
      <AdminLayout initialPage="/admin">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Partners</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{partners.length}</div>
              <p className="text-xs text-muted-foreground">Total partners</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Services</CardTitle>
              <Briefcase className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{services.length}</div>
              <p className="text-xs text-muted-foreground">Service offerings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Portfolio</CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{portfolio.length}</div>
              <p className="text-xs text-muted-foreground">Projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">News</CardTitle>
              <Newspaper className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{news.length}</div>
              <p className="text-xs text-muted-foreground">News articles</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button asChild variant="outline">
                <Link href="/admin/hero">Update Hero Section</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/partners">Manage Partners</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/services">Manage Services</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/portfolio">Manage Portfolio</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin/leads" className="flex items-center p-2 hover:bg-accent rounded-lg">
                <MessageCircle className="h-4 w-4 mr-2" />
                <span>View Leads ({leads.length})</span>
              </Link>
              <Link href="/admin/news" className="flex items-center p-2 hover:bg-accent rounded-lg">
                <Newspaper className="h-4 w-4 mr-2" />
                <span>Manage News</span>
              </Link>
              <Link href="/admin/testimonials" className="flex items-center p-2 hover:bg-accent rounded-lg">
                <Star className="h-4 w-4 mr-2" />
                <span>Manage Testimonials</span>
              </Link>
              <Link href="/admin/locations" className="flex items-center p-2 hover:bg-accent rounded-lg">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Manage Client Locations</span>
              </Link>
              <Link href="/admin/projects" className="flex items-center p-2 hover:bg-accent rounded-lg">
                <Briefcase className="h-4 w-4 mr-2" />
                <span>Manage Projects</span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminAuthWrapper>
  );
}