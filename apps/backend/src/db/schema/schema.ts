
import { pgEnum,pgTable,uuid,text ,varchar,timestamp,integer} from "drizzle-orm/pg-core";

export const taskStatusEnum = pgEnum("task_status", ["PENDING","IN_PROGRESS","COMPLETED"]);

export const users = pgTable("users",{
    id: uuid("id").defaultRandom().primaryKey(),
    username:varchar("username",{length:255}).notNull(),
    email: varchar("email",{length:255}).notNull().unique(),
    passwordHash: varchar("password_hash",{length:255}).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
})


export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: taskStatusEnum("status").default("PENDING").notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const timelogs = pgTable("timelogs", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  durationSeconds: integer("duration_seconds"),
});