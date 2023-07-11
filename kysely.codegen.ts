export interface Event {
  id: number;
  event_name: string;
  event_date: Date;
  user_id: number;
  description: string | null;
  link: string | null;
}

export interface User {
  id: string;
  name: string | null;
  email: string | null;
}

export interface DB {
  event: Event;
  user: User;
}
