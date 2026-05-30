import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "../dto/createtask.dto"; 
import { UpdateTaskDto } from "../dto/updatetask.dto"; 
import { TasksRepository } from "../repositry/task.repository"; 
@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async create(userId:string,dto:CreateTaskDto) 
  {
    return this.tasksRepository.create(dto.title,dto.description,userId);
  }

  async findAll(userId:string) 
  {
    return this.tasksRepository.findAllByUser(userId);
  }

  async update(taskId:string,userId:string,dto:UpdateTaskDto) 
  {
    const updatedTask = await this.tasksRepository.update(taskId,userId,dto);

    if (!updatedTask)
      throw new NotFoundException("Task not found");

    return updatedTask;
  }

  async delete(taskId:string,userId:string) 
  {
    const deletedTask = await this.tasksRepository.delete(taskId,userId);

    if (!deletedTask)
      throw new NotFoundException("Task not found");

    return { message:"Task deleted successfully" };
  }
}