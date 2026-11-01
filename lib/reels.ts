export type InstagramReel = {
  id?: string;
  url?: string;
  thumbnail?: string;
  caption?: string;
  [key: string]: unknown;
};

export async function getInstagramReels(): Promise<InstagramReel[]> {
  return [];
}

