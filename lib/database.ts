import { Kysely, Generated } from 'kysely'
import { PlanetScaleDialect } from 'kysely-planetscale'

interface Database {
    users: {
        id: Generated<'uuid'>,
        name: string,
        email: string
    },
    events: {
        id: Generated<'uuid'>,
        user_id: string,
        event_name: string,
        event_date: Date,
        description: string,
        link: string        
        location: string,        
    }
}

const db = new Kysely<Database>({
  dialect: new PlanetScaleDialect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  }),
});

export default db;