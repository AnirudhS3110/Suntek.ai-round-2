import { Injectable } from "@nestjs/common";
import { and, desc, eq } from "drizzle-orm";
import { StatusTypes } from "src/common/types/db.types";
import { db } from "src/db/dizzle";
import { tasks } from "src/db/schema/schema";

@Injectable()
export class TasksRepository {
  async create(title:string,description:string|undefined,userId:string) 
  {
    const [task] = await db.insert(tasks).values({ title, description, userId }).returning();
    return task;
  }

  async findAllByUser(userId:string) 
  {
    return db.select().from(tasks).where(eq(tasks.userId,userId)).orderBy(desc(tasks.createdAt));
  }

  async findById(taskId:string) 
  {
    const [task] = await db.select().from(tasks).where(eq(tasks.id,taskId)).limit(1);
    return task;
  }

  async update(taskId:string,userId:string,data:{ title:string; description:string; status:StatusTypes; }) 
  {
    const [task] = await db.update(tasks).set({title:data.title, description:data.description,status:data.status }).where(and(eq(tasks.id,taskId),eq(tasks.userId,userId))).returning();
    return task;
  }

  async delete(taskId:string,userId:string) 
  {
    const [task] = await db.delete(tasks).where(and(eq(tasks.id,taskId),eq(tasks.userId,userId))).returning();
    return task;
  }
}