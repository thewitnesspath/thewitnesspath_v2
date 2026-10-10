export type WordOfWeekAdminItem = {
  id: string;

  title: string;

  author: string;

  content: string;

  createdAt?:
    | string
    | null;
};