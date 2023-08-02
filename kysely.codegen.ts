import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

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
  created_at: Date | null;
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
