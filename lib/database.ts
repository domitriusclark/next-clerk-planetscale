import { Kysely, Generated } from 'kysely'
import { PlanetScaleDialect } from 'kysely-planetscale'

interface User { 
  id: string,
  name: string,
  email: string
}

interface Event {
  id: string,
  user_id: string,
  event_name: string,
  event_date: Date,
  description: string,
  link: string        
  location: string,        
}

interface Database {
    users: User
    events: Event
}

const db = new Kysely<Database>({
  dialect: new PlanetScaleDialect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  }),
});

export default db;