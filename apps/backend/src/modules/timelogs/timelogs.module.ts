import { Module } from "@nestjs/common";
import { WebsocketModule } from "../websocket/websocket.module";
import { TasksRepository } from "../tasks/repositry/task.repository"; 
import { TimelogsController } from "./controllers/timelogs.controller";
import { TimelogsRepository } from "./repositry/timelogs.repository"; 
import { TimelogsService } from "./services/timelogs.service";

@Module({
  imports:[WebsocketModule],
  controllers:[TimelogsController],
  providers:[TimelogsRepository,TimelogsService,TasksRepository],
})
export class TimelogsModule {}