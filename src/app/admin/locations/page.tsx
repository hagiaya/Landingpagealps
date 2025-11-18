import { adminLandingPageServer } from "@/lib/landing-page-db";
import LocationsClient from "./LocationsClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function LocationsPage() {
  const locations = await adminLandingPageServer.getAllClientLocations();

  async function createLocationAction(formData: FormData) {
    'use server';
    const clientName = formData.get('clientName') as string;
    const address = formData.get('address') as string;
    const locationDescription = formData.get('locationDescription') as string;
    const latitude = parseFloat(formData.get('latitude') as string || '');
    const longitude = parseFloat(formData.get('longitude') as string || '');
    
    const lat = isNaN(latitude) ? null : latitude;
    const lng = isNaN(longitude) ? null : longitude;
    
    await adminLandingPageServer.createClientLocation({
      client_name: clientName,
      address,
      latitude: lat,
      longitude: lng,
      location_description: locationDescription || null
    });
    
    revalidatePath('/admin/locations');
    redirect('/admin/locations');
  }

  async function deleteLocationAction(id: string) {
    'use server';
    await adminLandingPageServer.deleteClientLocation(id);
    revalidatePath('/admin/locations');
  }

  async function editLocationAction(item: any) {
    'use server';
    console.log('Editing location:', item);
    // Example: await adminLandingPageServer.updateClientLocation(item.id, { ... });
    // revalidatePath('/admin/locations');
  }

  return (
    <LocationsClient
      locations={locations}
      createLocationAction={createLocationAction}
      deleteLocationAction={deleteLocationAction}
      editLocationAction={editLocationAction}
    />
  );
}