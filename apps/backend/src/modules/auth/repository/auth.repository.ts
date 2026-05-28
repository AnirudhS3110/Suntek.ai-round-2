import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { db } from "src/db/dizzle";
import { users } from "src/db/schema/schema";

@Injectable()
export class AuthRepositoryService
{
    async findByEmail(email:string)
    {
        const [user] = await db.select().from(users).where(eq(users.email,email));
        return user;
    }

    async create(username:string,email:string, passwordHash:string)
    {
       const [user] = await db.insert(users).values({username,email,passwordHash}).returning({id: users.id , username:users.username ,email: users.email,});
       return user;
    }
}
