export type Event = {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO 8601
  location: string; // stored UPPERCASE
};