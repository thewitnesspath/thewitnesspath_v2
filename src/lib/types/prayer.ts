export type PrayerRequest = {
  id: string;

  category: string;

  content: string;

  prayerCount: number;

  approved: boolean;

  createdAt?: string | null;
};