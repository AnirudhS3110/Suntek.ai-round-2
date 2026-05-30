import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { TasksRepository } from "src/modules/tasks/repositry/task.repository"; 
import { StartTimerDto } from "../dto/start-timer.dto";  
import { TimelogsRepository } from "../repositry/timelogs.repository";  
import { WebsocketGateway } from "src/modules/websocket/gateway/websocket.gateway";

@Injectable()
export class TimelogsService 
{
  constructor(
    private readonly timelogsRepository: TimelogsRepository,
    private readonly tasksRepository: TasksRepository,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  async start(userId:string,dto:StartTimerDto) 
  {
    const task = await this.tasksRepository.findById(dto.taskId);

    if (!task || task.userId !== userId)
      throw new NotFoundException("Task not found");

    const activeTimer = await this.timelogsRepository.findActiveTimer(userId);

    if (activeTimer)
      throw new ConflictException("Another timer is already active");

    const timelog = await this.timelogsRepository.create(dto.taskId,userId);

    this.websocketGateway.emitTimerStarted(userId,{
      taskId:dto.taskId,
      timelog,
    });

    return timelog;
  }

  async stop(userId:string) 
  {
    const activeTimer = await this.timelogsRepository.findActiveTimer(userId);

    if (!activeTimer)
      throw new NotFoundException("No active timer found");

    const stoppedLog = await this.timelogsRepository.stop(activeTimer.id);

    this.websocketGateway.emitTimerStopped(userId,stoppedLog);

    return stoppedLog;
  }

  async findAll(userId:string) 
  {
    return await this.timelogsRepository.findAllByUser(userId);
  }
}