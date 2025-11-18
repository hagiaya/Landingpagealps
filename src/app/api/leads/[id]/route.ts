import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

// Define the path for our temporary storage file
const leadsFilePath = path.join(process.cwd(), 'temp', 'leads.json');

// Ensure the temp directory exists
if (!fs.existsSync(path.join(process.cwd(), 'temp'))) {
  fs.mkdirSync(path.join(process.cwd(), 'temp'), { recursive: true });
}

// Initialize the leads file if it doesn't exist
if (!fs.existsSync(leadsFilePath)) {
  fs.writeFileSync(leadsFilePath, JSON.stringify([]));
}

interface LeadSubmission {
  id: string;
  name: string;
  address: string;
  service_type: 'website' | 'aplikasi' | 'uiux';
  phone_number: string | null;
  project_description: string | null;
  features: string | null;
  budget: string | null;
  ai_analysis: string | null;
  submitted_at: string;
  processed: boolean;
}

// Helper function to read leads from file
async function readLeadsFromFile(): Promise<LeadSubmission[]> {
  try {
    const fileContent = await fsPromises.readFile(leadsFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading leads file:', error);
    return [];
  }
}

// Helper function to write leads to file
async function writeLeadsToFile(leads: LeadSubmission[]): Promise<void> {
  await fsPromises.writeFile(leadsFilePath, JSON.stringify(leads, null, 2));
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const leads = await readLeadsFromFile();
    const lead = leads.find(l => l.id === resolvedParams.id);

    if (!lead) {
      return new Response(
        JSON.stringify({ error: 'Lead not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, lead }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching lead:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch lead' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const leads = await readLeadsFromFile();
    const leadIndex = leads.findIndex(l => l.id === resolvedParams.id);

    if (leadIndex === -1) {
      return new Response(
        JSON.stringify({ error: 'Lead not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { processed, ai_analysis } = body;

    // Update the lead with provided fields
    if (typeof processed === 'boolean') {
      leads[leadIndex] = {
        ...leads[leadIndex],
        processed: processed,
      };
    }

    // If ai_analysis is provided, update it as well
    if (ai_analysis !== undefined) {
      leads[leadIndex] = {
        ...leads[leadIndex],
        ai_analysis: ai_analysis,
      };
    }

    // Write back to file
    await writeLeadsToFile(leads);

    return new Response(
      JSON.stringify({ success: true, lead: leads[leadIndex] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating lead:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update lead' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const leads = await readLeadsFromFile();
    const leadIndex = leads.findIndex(l => l.id === resolvedParams.id);

    if (leadIndex === -1) {
      return new Response(
        JSON.stringify({ error: 'Lead not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Remove the lead
    const deletedLead = leads.splice(leadIndex, 1)[0];

    // Write back to file
    await writeLeadsToFile(leads);

    return new Response(
      JSON.stringify({ success: true, lead: deletedLead }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting lead:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete lead' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}