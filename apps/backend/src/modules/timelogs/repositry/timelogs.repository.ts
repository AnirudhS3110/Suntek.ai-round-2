import { Injectable } from "@nestjs/common";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "src/db/dizzle";
import { timelogs } from "src/db/schema/schema";

@Injectable()
export class TimelogsRepository 
{
  async findActiveTimer(userId:string) 
  {
    const [timelog] = await db.select().from(timelogs).where(and(eq(timelogs.userId,userId),isNull(timelogs.endedAt))).limit(1);
    return timelog;
  }

  async create(taskId:string,userId:string) 
  {
    const [timelog] = await db.insert(timelogs).values({taskId,userId,startedAt:new Date()}).returning();
    return timelog;
  }

  async stop(timelogId:string) 
  {
    const activeLog = await this.findById(timelogId);

    if (!activeLog)
      return null;

    const endedAt = new Date();

    const durationSeconds = Math.floor((endedAt.getTime() - new Date(activeLog.startedAt).getTime()) / 1000,);

    const [updatedLog] = await db.update(timelogs).set({endedAt,durationSeconds,}).where(eq(timelogs.id,timelogId)).returning();

    return updatedLog;
  }

  async findById(id:string) 
  {
    const [timelog] = await db.select().from(timelogs).where(eq(timelogs.id,id)).limit(1);
    return timelog;
  }

  async findAllByUser(userId:string) 
  {
    return await db.select().from(timelogs).where(eq(timelogs.userId,userId)).orderBy(desc(timelogs.startedAt));
  }
}