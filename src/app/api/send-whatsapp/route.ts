import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, address, service_type, phone_number, project_description, features, budget, businessNumber } = body;

    // Get API keys from environment
    const fonteApiKey1 = process.env.FONTE_API_KEY_1;
    const fonteApiKey2 = process.env.FONTE_API_KEY_2;

    // Check if API keys exist
    if (!fonteApiKey1 || !fonteApiKey2) {
      return new Response(
        JSON.stringify({ 
          error: 'Fontte API keys not configured',
          message: 'Please set FONTE_API_KEY_1 and FONTE_API_KEY_2 environment variables' 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Format the business notification message
    let businessNotificationMessage = `[NOTIFICATION] New Lead Notification\n\n`;
    businessNotificationMessage += `Name: ${name}\n`;
    businessNotificationMessage += `Phone: ${phone_number || 'No phone provided'}\n`;
    businessNotificationMessage += `Address: ${address}\n`;
    businessNotificationMessage += `Service: ${service_type}\n`;
    
    if (project_description) {
      businessNotificationMessage += `Description: ${project_description}\n`;
    }
    if (features) {
      businessNotificationMessage += `Features: ${features}\n`;
    }
    if (budget) {
      businessNotificationMessage += `Budget: ${budget}\n`;
    }

    // Send message to business using Fontte API
    const fontteResponse = await fetch('https://api.fontte.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key_1: fonteApiKey1,
        api_key_2: fonteApiKey2,
        phone: businessNumber, // Business number to receive the lead notification
        message: businessNotificationMessage,
      }),
    });

    const fontteResult = await fontteResponse.json();
    console.log('Fontte API response for business:', fontteResult);

    // If client provided phone number, send confirmation message to client
    let clientFontteResult = null;
    if (phone_number) {
      // Create timestamp using Date object
      const requestTimestamp = Date.now();
      let clientMessage = `Terima kasih ${name}, permintaan Anda telah kami terima!\n\n`;
      clientMessage += `Kami telah menerima permintaan Anda untuk layanan ${service_type}.\n`;
      clientMessage += `Tim kami akan segera menghubungi Anda kembali.\n\n`;
      clientMessage += `Status permintaan Anda: *Come in (0%)*\n`;
      clientMessage += `Nomor permintaan Anda: *${requestTimestamp}*`;
      
      // Send message to client using Fontte API
      const clientFontteResponse = await fetch('https://api.fontte.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key_1: fonteApiKey1,
          api_key_2: fonteApiKey2,
          phone: phone_number, // Client's phone number
          message: clientMessage,
        }),
      });

      clientFontteResult = await clientFontteResponse.json();
      console.log('Fontte API response for client:', clientFontteResult);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'WhatsApp messages sent successfully',
        businessResult: fontteResult,
        clientResult: phone_number ? clientFontteResult : null
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send message', details: (error as Error).message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}