import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

// Define the path for our temporary storage file
const leadsFilePath = path.join('/tmp', 'leads.json');

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
  features: string | null;  // New field for features
  budget: string | null;    // New field for budget
  ai_analysis: string | null; // New field for AI analysis result
  submitted_at: string;
  processed: boolean;
}

// Fungsi untuk mengirim lead ke WhatsApp
async function sendLeadToWhatsApp(lead: LeadSubmission) {
  // Format pesan WhatsApp
  let message = `📥 *New Lead Alert*\n\n`;
  message += `*Nama:* ${lead.name}\n`;
  message += `*Alamat:* ${lead.address}\n`;
  message += `*Jenis Layanan:* ${lead.service_type}\n`;
  
  if (lead.phone_number) {
    message += `*No. HP:* ${lead.phone_number}\n`;
  }
  
  if (lead.project_description) {
    message += `*Deskripsi Project:* ${lead.project_description}\n`;
  }
  
  if (lead.features) {
    message += `*Fitur-fitur:* ${lead.features}\n`;
  }
  
  if (lead.budget) {
    message += `*Anggaran:* ${lead.budget}\n`;
  }
  
  message += `\n_Tanggal: ${new Date(lead.submitted_at).toLocaleString('id-ID', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  })}_`;

  // Nomor tujuan dan dari (berdasarkan permintaan pengguna)
  const toNumber = '6283117927964'; // 083117927964
  const fromNumber = '6285123968217'; // +6285123968217

  // Cek apakah menggunakan API WhatsApp tertentu (misalnya: WhatsApp Business API, Twilio, dll)
  const whatsappProvider = process.env.WHATSAPP_PROVIDER || 'generic'; // 'whatsapp-business', 'twilio', 'fontte', 'generic'

  try {
    let response;
    
    if (whatsappProvider === 'whatsapp-business') {
      // Contoh untuk WhatsApp Business API (Meta)
      const accessToken = process.env.WHATSAPP_BUSINESS_ACCESS_TOKEN;
      const phoneNumberId = process.env.WHATSAPP_BUSINESS_PHONE_NUMBER_ID;
      
      if (!accessToken || !phoneNumberId) {
        throw new Error('WHATSAPP_BUSINESS_ACCESS_TOKEN and WHATSAPP_BUSINESS_PHONE_NUMBER_ID are required for WhatsApp Business API');
      }
      
      const payload = {
        messaging_product: 'whatsapp',
        to: toNumber,
        type: 'text',
        text: {
          body: message
        }
      };
      
      response = await fetch(`https://graph.facebook.com/v17.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } else if (whatsappProvider === 'twilio') {
      // Contoh untuk Twilio WhatsApp API
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      
      if (!accountSid || !authToken) {
        throw new Error('TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are required for Twilio API');
      }
      
      const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER || `whatsapp:+${fromNumber}`;
      const toWhatsApp = `whatsapp:+${toNumber}`;
      
      const payload = {
        from: twilioNumber,
        to: toWhatsApp,
        body: message,
      };
      
      response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(payload).toString(),
      });
    } else if (whatsappProvider === 'fontte') {
      // Fontte API dengan dua token yang Anda miliki
      const fontteApiUrl = process.env.FONTE_API_URL || 'https://api.fontte.com/send'; // Ganti dengan URL endpoint sebenarnya
      const apiKey1 = process.env.FONTE_API_KEY_1; // Token pertama: Fxw2ufq7qTPmxNB1ZjsoN33QLAyNeU1o5Te1fh
      const apiKey2 = process.env.FONTE_API_KEY_2; // Token kedua: BNjyhjRoF8WB4R45XDsd
      
      if (!apiKey1 || !apiKey2) {
        throw new Error('FONTE_API_KEY_1 and FONTE_API_KEY_2 are required for Fontte API');
      }
      
      // Format payload untuk Fontte API - Anda mungkin perlu menyesuaikan ini berdasarkan dokumentasi Fontte
      const payload = {
        to: toNumber,
        from: fromNumber,
        message: message,
        // Tambahkan parameter lain sesuai kebutuhan Fontte API
        token1: apiKey1,
        token2: apiKey2,
      };

      response = await fetch(fontteApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key-1': apiKey1,  // atau 'Authorization': `Bearer ${apiKey1}`, tergantung Fontte API
          'X-API-Key-2': apiKey2,  // atau header lain sesuai kebutuhan Fontte
        },
        body: JSON.stringify(payload),
      });
    } else {
      // Generic API - bisa disesuaikan dengan API Fontte atau provider lain
      const fontteApiUrl = process.env.FONTE_API_URL || 'https://api.example.com/send';
      const apiKey = process.env.FONTE_API_KEY;
      
      const payload = {
        to: `+${toNumber}`,
        from: `+${fromNumber}`, // nomor pengirim
        message: message,
        // tambahkan parameter tambahan sesuai kebutuhan Fontte API
      };

      response = await fetch(fontteApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,  // atau 'X-API-Key': apiKey, tergantung Fontte API
        },
        body: JSON.stringify(payload),
      });
    }

    if (!response.ok) {
      throw new Error(`Gagal mengirim ke WhatsApp: ${response.status} ${response.statusText}`);
    }

    console.log('Lead berhasil dikirim ke WhatsApp');
    const result = await response.json();
    console.log('Response dari API:', result);
    return result;
  } catch (error) {
    console.error('Error saat mengirim ke WhatsApp:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Log for debugging purposes
    console.log('Received data for lead submission:', {
      name: body.name,
      address: body.address,
      service_type: body.service_type,
      phone_number: body.phone_number,
      project_description: body.project_description,
      features: body.features,
      budget: body.budget
    });
    
    // Validate input
    if (!body.name || !body.address || !body.service_type) {
      console.log('Validation failed', { name: !!body.name, address: !!body.address, service_type: !!body.service_type });
      return new Response(
        JSON.stringify({ error: 'Name, address, and service type are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create the lead object
    const newLead: LeadSubmission = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: body.name,
      address: body.address,
      service_type: body.service_type as 'website' | 'aplikasi' | 'uiux',
      phone_number: body.phone_number || null,
      project_description: body.project_description || null,
      features: body.features || null,
      budget: body.budget || null,
      ai_analysis: null, // Will be populated later when AI analysis is complete
      submitted_at: new Date().toISOString(),
      processed: false
    };

    // Read existing leads
    let existingLeads: LeadSubmission[] = [];
    try {
      const fileContent = await fsPromises.readFile(leadsFilePath, 'utf-8');
      existingLeads = JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading leads file:', error);
      // If there's an error reading the file, start with an empty array
      existingLeads = [];
    }

    // Add the new lead
    existingLeads.push(newLead);

    // Write back to the file
    await fsPromises.writeFile(leadsFilePath, JSON.stringify(existingLeads, null, 2));

    console.log('Lead submitted successfully to file:', newLead);

    // Kirim ke WhatsApp setelah disimpan
    try {
      await sendLeadToWhatsApp(newLead);
    } catch (whatsappError) {
      // Log error jika pengiriman ke WhatsApp gagal, tapi tetap kembalikan success
      console.error('Error sending lead to WhatsApp:', whatsappError);
    }

    return new Response(
      JSON.stringify({ success: true, lead: newLead }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error submitting lead:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to submit lead' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET() {
  try {
    // Read existing leads
    let existingLeads: LeadSubmission[] = [];
    try {
      const fileContent = await fsPromises.readFile(leadsFilePath, 'utf-8');
      existingLeads = JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading leads file:', error);
      existingLeads = [];
    }

    return new Response(
      JSON.stringify({ success: true, leads: existingLeads }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching leads:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch leads' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}