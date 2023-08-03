import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Event {
  id: Generated<number>;
  name: string | null;
  date: Date | null;
  user_id: string;
  description: string | null;
  url: string | null;
  event_mode: string | null;
  address: string | null;
  city: string | null;
  zipcode: string | null;
  state: string | null;
  created_at: Generated<Date | null>;
}

export interface EventRegistration {
  event_id: string | null;
  user_id: string;
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
