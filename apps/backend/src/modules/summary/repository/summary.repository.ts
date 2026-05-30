import { Injectable } from "@nestjs/common";
import { and, count, eq, gte, isNotNull, lt, sql, sum } from "drizzle-orm";
import { db } from "src/db/dizzle";
import { tasks, timelogs } from "src/db/schema/schema";

@Injectable()
export class SummaryRepository {
  async getTodaySummary(userId:string,startOfDay:Date,endOfDay:Date) {
    const [totalTracked] = await db.select({ total:sum(timelogs.durationSeconds) }).from(timelogs).where(and(eq(timelogs.userId,userId),isNotNull(timelogs.endedAt),gte(timelogs.startedAt,startOfDay),lt(timelogs.startedAt,endOfDay)));

    const [completedTasks] = await db.select({ count:count() }).from(tasks).where(and(eq(tasks.userId,userId),eq(tasks.status,"COMPLETED")));

    const [pendingTasks] = await db.select({ count:count() }).from(tasks).where(and(eq(tasks.userId,userId),eq(tasks.status,"PENDING")));

    const [inProgressTasks] = await db.select({ count:count() }).from(tasks).where(and(eq(tasks.userId,userId),eq(tasks.status,"IN_PROGRESS")));

    const workedTasks = await db.select({id:tasks.id,title:tasks.title,status:tasks.status,totalDuration:sql<number>`COALESCE(SUM(${timelogs.durationSeconds}),0)`,}).from(tasks).leftJoin(timelogs,eq(tasks.id,timelogs.taskId)).where(eq(tasks.userId,userId)).groupBy(tasks.id);

    return {
      totalTrackedSeconds:Number(totalTracked.total || 0),
      completedTasks:completedTasks.count,
      pendingTasks:pendingTasks.count,
      inProgressTasks:inProgressTasks.count,
      workedTasks,
    };
  }

  async getWeeklySummary(userId:string,startDate:Date) 
  {
    return await db.select({date:sql<string>`DATE(${timelogs.startedAt})`,totalDuration:sql<number>`COALESCE(SUM(${timelogs.durationSeconds}),0)`,}).from(timelogs).where(and(eq(timelogs.userId,userId),gte(timelogs.startedAt,startDate))).groupBy(sql`DATE(${timelogs.startedAt})`).orderBy(sql`DATE(${timelogs.startedAt})`);
  }
}