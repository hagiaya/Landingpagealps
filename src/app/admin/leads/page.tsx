import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Mail, Phone, Check, Trash2 } from "lucide-react";
import LeadRow from "@/components/admin/LeadRow";
import fs from 'fs';
import path from 'path';
import type { LeadSubmission } from '@/lib/landing-page-db';
import AdminAuthWrapper from "@/components/admin/AdminAuthWrapper";
import AdminLayout from "@/components/admin/AdminLayout";

// Function to read leads from file
async function getLeadsFromFile(): Promise<LeadSubmission[]> {
  try {
    // Using dynamic import for server-only functionality
    const { promises: fsPromises } = await import('fs');
    const leadsFilePath = path.join(process.cwd(), 'temp', 'leads.json');

    if (!fs.existsSync(leadsFilePath)) {
      return [];
    }

    const fileContent = await fsPromises.readFile(leadsFilePath, 'utf-8');
    const leads: LeadSubmission[] = JSON.parse(fileContent);

    // Sort by submitted_at in descending order (newest first)
    return leads.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
  } catch (error) {
    console.error('Error reading leads from file:', error);
    return [];
  }
}

// Function to get leads from database (fallback)
async function getLeadsFromDatabase() {
  try {
    const { adminLandingPageServer } = await import('@/lib/landing-page-db');
    return await adminLandingPageServer.getLeadSubmissions();
  } catch (error) {
    console.error('Error reading leads from database:', error);
    return [];
  }
}

export default async function LeadsPage() {
  // Try to get leads from both sources
  const [fileLeads, dbLeads] = await Promise.all([
    getLeadsFromFile(),
    getLeadsFromDatabase()
  ]);

  // Combine both sources, prioritizing file leads (newer) with fallback to DB
  let allLeads: LeadSubmission[] = [...fileLeads];

  // Add any DB leads that aren't in file leads (to avoid duplicates)
  const existingIds = new Set(fileLeads.map(lead => lead.id));
  for (const dbLead of dbLeads) {
    if (!existingIds.has(dbLead.id)) {
      allLeads.push(dbLead);
    }
  }

  // Sort by submitted_at in descending order (newest first)
  allLeads = allLeads.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());

  const getServiceLabel = (type: string) => {
    switch (type) {
      case 'website': return 'Website';
      case 'aplikasi': return 'Aplikasi';
      case 'uiux': return 'UI/UX';
      default: return type;
    }
  };

  return (
    <AdminAuthWrapper>
      <AdminLayout initialPage="/admin/leads">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Lead Management</h1>
          <div className="flex space-x-2">
            <Button variant="outline">Export Data</Button>
            <Button>
              Refresh Data
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lead Submissions</CardTitle>
            <div className="text-sm text-muted-foreground">
              Showing {allLeads.length} lead{allLeads.length !== 1 ? 's' : ''} from file and database storage
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Project Description</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allLeads.length > 0 ? allLeads.map((lead: LeadSubmission) => {
                  const submittedAtFormatted = new Date(lead.submitted_at).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <LeadRow
                      key={lead.id}
                      lead={lead}
                      serviceLabel={getServiceLabel(lead.service_type)}
                      submittedAtFormatted={submittedAtFormatted}
                    />
                  );
                }) : (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-muted-foreground">
                      No leads submitted yet
                    </td>
                  </tr>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </AdminLayout>
    </AdminAuthWrapper>
  );
}