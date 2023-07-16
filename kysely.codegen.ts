export interface Event {
  id: number | null;
  name: string | null;
  date: Date | null;
  user_id: string | null;
  description: string | null;
  url: string | null;
  eventMode: string | null;
  address: string | null;
  city: string | null;
  zipcode: string | null;
  state: string | null;
}

export interface EventRegistration {
  user_id: string | null;
  event_id: string | null;
}

export interface User {
  id: string;
  name: string | null;
  email: string | null;
}

export interface DB {
  event: Event;
  event_registration: EventRegistration;
  user: User;
}
