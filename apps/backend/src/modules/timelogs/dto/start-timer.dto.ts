import { IsUUID } from "class-validator";

export class StartTimerDto {
  @IsUUID()
  taskId:string;
}