import { Module } from "@nestjs/common";
import { TasksController } from "./controllers/task.controller"; 
import { TasksService } from "./services/task.service";
import { TasksRepository } from "./repositry/task.repository";

@Module({
  controllers:[TasksController],
  providers:[TasksService,TasksRepository],
})
export class TasksModule {}