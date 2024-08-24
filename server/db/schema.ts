import {pgTable,serial,varchar} from 'drizzle-orm/pg-core'
export const Users =pgTable( "users",{
    id: serial("user_id").primaryKey(),
    name:varchar("50").notNull(),
    }
)