import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/common/decorators/currentuser.decorator"; 
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard"; 
import { CreateTaskDto } from "../dto/createtask.dto"; 
import { UpdateTaskDto } from "../dto/updatetask.dto"; 
import { TasksService } from "../services/task.service"; 

@UseGuards(JwtAuthGuard)
@Controller("tasks")
export class TasksController 
{
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@CurrentUser() user:any,@Body() dto:CreateTaskDto) 
  {
    return this.tasksService.create(user.userId,dto);
  }

  @Get()
  findAll(@CurrentUser() user:any) 
  {
    return this.tasksService.findAll(user.userId);
  }

  @Patch(":id")
  update(@Param("id") id:string,@CurrentUser() user:any,@Body() dto:UpdateTaskDto) 
  {
    return this.tasksService.update(id,user.userId,dto);
  }

  @Delete(":id")
  delete(@Param("id") id:string,@CurrentUser() user:any) 
  {
    return this.tasksService.delete(id,user.userId);
  }
}