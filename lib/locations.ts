export type LocationItem = {
  id?: string;
  name: string;
  lat?: number;
  lng?: number;
  address?: string;
  city?: string;
  state?: string;
  [key: string]: unknown;
};

export async function getSheetLocations(): Promise<LocationItem[]> {
  return [];
}

